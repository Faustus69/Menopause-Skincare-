import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// App owner credentials: secure Firebase User ID and verified admin email
export const OWNER_UID = 'hCN44TadBZMVJC5mzKspDFWNYYL2';
export const OWNER_EMAIL = 'needthis2027@gmail.com';

/**
 * Validates whether an authenticated user is the app owner.
 * Primary authority: cryptographic Firebase User ID (UID).
 * Secondary authority: verified owner email.
 */
export const isOwnerUser = (user: { uid?: string | null; email?: string | null; emailVerified?: boolean | null } | null | undefined): boolean => {
  if (!user) return false;
  if (user.uid && user.uid === OWNER_UID) return true;
  if (user.email && user.email.toLowerCase() === OWNER_EMAIL.toLowerCase() && user.emailVerified !== false) return true;
  return false;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Maps Firebase Auth errors to calm, reassuring, plain-English messages.
 */
export function getAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';
  const code = error.code || '';
  const message = error.message || '';

  if (code === 'auth/operation-not-allowed' || message.includes('OPERATION_NOT_ALLOWED')) {
    return 'Email/Password sign-in is not yet enabled in the Firebase Console for this project. Please turn on Email/Password in your Firebase Console under Authentication > Sign-in method, or sign in with Google.';
  }
  if (code === 'auth/email-already-in-use') {
    return 'An account already exists with this email address. Please sign in instead.';
  }
  if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
    return 'Incorrect email or password. Please double-check and try again, or use "Forgot Password".';
  }
  if (code === 'auth/user-not-found') {
    return 'No account was found with this email. Please check the spelling or create an account.';
  }
  if (code === 'auth/weak-password') {
    return 'Password should be at least 6 characters for your security.';
  }
  if (code === 'auth/invalid-email') {
    return 'Please enter a valid email address.';
  }
  if (code === 'auth/too-many-requests') {
    return 'Too many unsuccessful attempts. For your safety, please wait a moment and try again.';
  }
  if (code === 'auth/popup-closed-by-user') {
    return 'Sign-in was cancelled.';
  }
  if (code === 'auth/network-request-failed') {
    return 'Network connection issue. Please check your internet connection.';
  }
  return error.message || 'Authentication error. Please try again.';
}

/**
 * Register a new user with email and password.
 * Automatically sends email verification and initializes user record in Firestore.
 */
export const registerWithEmail = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;

  // Send verification email automatically
  try {
    await sendEmailVerification(user);
  } catch (verifyErr) {
    console.warn('Could not send initial verification email:', verifyErr);
  }

  // Ensure Firestore user document exists with paid status (owner is auto-approved)
  try {
    await ensureUserProfileDoc(user);
  } catch (docErr) {
    console.warn('Could not create initial user profile document:', docErr);
  }

  return user;
};

/**
 * Sign in an existing user with email and password.
 */
export const signInWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  const user = userCredential.user;
  await ensureUserProfileDoc(user);
  return user;
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email.trim());
};

/**
 * Resend verification email to the current user
 */
export const resendVerificationEmail = async (user: User) => {
  await sendEmailVerification(user);
};

/**
 * Sign in with Google provider
 */
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  const user = userCredential.user;
  await ensureUserProfileDoc(user);
  return user;
};

/**
 * Sign out the current user
 */
export const logout = async () => {
  await signOut(auth);
};

/**
 * Ensure user document exists in Firestore `/users/{uid}`.
 * Sets isPaid to true for the owner email, false by default for new accounts.
 */
export const ensureUserProfileDoc = async (user: User) => {
  if (!user || !user.uid) return null;
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    const isOwner = isOwnerUser(user);

    if (!snap.exists()) {
      const initialProfile = {
        email: user.email || '',
        isPaid: isOwner ? true : false,
        role: isOwner ? 'admin' : 'customer',
        barrierType: null,
        concerns: [],
        recommendedIngredients: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, initialProfile);
      return initialProfile;
    } else {
      const data = snap.data();
      // Ensure owner always has admin and paid status
      if (isOwner && (!data.isPaid || data.role !== 'admin')) {
        await updateDoc(userRef, {
          isPaid: true,
          role: 'admin',
          updatedAt: serverTimestamp()
        });
        return { ...data, isPaid: true, role: 'admin' };
      }
      return data;
    }
  } catch (error) {
    console.warn('Notice syncing user profile in Firestore:', error);
    const isOwner = isOwnerUser(user);
    return {
      email: user.email || '',
      isPaid: isOwner ? true : false,
      role: isOwner ? 'admin' : 'customer',
      barrierType: null,
      concerns: [],
      recommendedIngredients: []
    };
  }
};

/**
 * Fetch user profile from Firestore
 */
export const getUserProfileDoc = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
};
