import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
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

// WiseBloom permanent complimentary guest account email (legacy shared guest)
export const GUEST_EMAIL = 'guest@wisebloom.co.uk';
const GUEST_PASS_STORAGE_PREFIX = 'wb_guest_pass_';

export const getStoredGuestPass = (uid?: string | null): string | null => {
  if (!uid) return null;
  try {
    return localStorage.getItem(`${GUEST_PASS_STORAGE_PREFIX}${uid}`);
  } catch {
    return null;
  }
};

export const setStoredGuestPass = (uid: string, pass: string) => {
  try {
    localStorage.setItem(`${GUEST_PASS_STORAGE_PREFIX}${uid}`, pass);
  } catch {
    // Ignore storage errors
  }
};

export const clearStoredGuestPass = (uid?: string | null) => {
  try {
    if (uid) {
      localStorage.removeItem(`${GUEST_PASS_STORAGE_PREFIX}${uid}`);
    }
  } catch {
    // Ignore storage errors
  }
};

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

/**
 * Validates whether an authenticated user is the legacy WiseBloom email guest account.
 */
export const isGuestUser = (user: { uid?: string | null; email?: string | null } | null | undefined): boolean => {
  if (!user) return false;
  if (user.email && user.email.toLowerCase() === GUEST_EMAIL.toLowerCase()) return true;
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

  if (code === 'auth/admin-restricted-operation') {
    return 'Anonymous guest sign-in is not yet enabled in the Firebase Console for this project. Please enable Anonymous under Authentication > Sign-in method.';
  }
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
  const uid = auth.currentUser?.uid;
  clearStoredGuestPass(uid);
  try {
    await fetch('/api/guest/signout', { method: 'POST' });
  } catch {
    // Ignore network error during signout cleanup
  }
  await signOut(auth);
};

/**
 * Redeem a private WiseBloom guest invitation link using Firebase Anonymous Authentication.
 */
export const redeemGuestInvite = async (inviteToken: string) => {
  const trimmed = inviteToken.trim();
  if (!trimmed) {
    throw new Error('This guest invitation link is invalid.');
  }

  // If currently signed into a non-anonymous account, verify the invite token first before switching sessions
  if (auth.currentUser && !auth.currentUser.isAnonymous) {
    const existingIdToken = await auth.currentUser.getIdToken(true);
    const preCheck = await fetch('/api/guest/validate-invite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${existingIdToken}`
      },
      body: JSON.stringify({ inviteToken: trimmed })
    });
    const preData = await preCheck.json().catch(() => ({}));
    if (!preCheck.ok || !preData.valid) {
      throw new Error(preData.error || 'This guest invitation link has been revoked or is no longer active.');
    }
    await logout();
  }

  let activeUser = auth.currentUser;
  if (!activeUser) {
    try {
      const cred = await signInAnonymously(auth);
      activeUser = cred.user;
    } catch (err: any) {
      throw new Error(getAuthErrorMessage(err));
    }
  }

  const idToken = await activeUser.getIdToken(true);
  const res = await fetch('/api/guest/redeem', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ inviteToken: trimmed })
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success || !data.guestPass) {
    throw new Error(data.error || 'This guest invitation link has been revoked or is no longer active.');
  }

  setStoredGuestPass(activeUser.uid, data.guestPass);
  return {
    user: activeUser,
    guestPass: data.guestPass as string
  };
};

export interface GuestInviteStatus {
  active: boolean;
  inviteToken: string | null;
  inviteUrl: string | null;
  version: number;
  updatedAt: string | null;
}

export const getGuestInviteStatus = async (): Promise<GuestInviteStatus> => {
  const currentUser = auth.currentUser;
  if (!currentUser || !isOwnerUser(currentUser)) {
    throw new Error('Unauthorized: Owner access required.');
  }
  const idToken = await currentUser.getIdToken(true);
  const res = await fetch('/api/admin/guest-invite', {
    headers: { 'Authorization': `Bearer ${idToken}` }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to load guest invitation link.');
  }
  return data;
};

export const rotateGuestInviteLink = async (): Promise<GuestInviteStatus> => {
  const currentUser = auth.currentUser;
  if (!currentUser || !isOwnerUser(currentUser)) {
    throw new Error('Unauthorized: Owner access required.');
  }
  const idToken = await currentUser.getIdToken(true);
  const res = await fetch('/api/admin/guest-invite/rotate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to replace guest invitation link.');
  }
  return data;
};

export const revokeGuestInviteLink = async (): Promise<GuestInviteStatus> => {
  const currentUser = auth.currentUser;
  if (!currentUser || !isOwnerUser(currentUser)) {
    throw new Error('Unauthorized: Owner access required.');
  }
  const idToken = await currentUser.getIdToken(true);
  const res = await fetch('/api/admin/guest-invite/revoke', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Failed to revoke guest invitation link.');
  }
  return data;
};

/**
 * Ensure user document exists in Firestore `/users/{uid}`.
 * Sets isPaid to true for the owner email, false by default for new accounts.
 * Anonymous invited guests are kept isolated from Firestore customer/paid records.
 */
export const ensureUserProfileDoc = async (user: User) => {
  if (!user || !user.uid) return null;
  if (user.isAnonymous) {
    return {
      email: null,
      isPaid: false,
      role: 'guest_session',
      barrierType: null,
      concerns: [],
      recommendedIngredients: []
    };
  }
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    const isOwner = isOwnerUser(user);
    const isGuest = isGuestUser(user);
    const hasFullAccess = isOwner || isGuest;

    if (!snap.exists()) {
      const initialProfile = {
        email: user.email || '',
        isPaid: hasFullAccess ? true : false,
        role: isOwner ? 'admin' : (isGuest ? 'guest' : 'customer'),
        barrierType: null,
        concerns: [],
        recommendedIngredients: [],
        favorites: [],
        routine: {},
        notes: [],
        scans: [],
        lastResetAt: null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      await setDoc(userRef, initialProfile);
      return initialProfile;
    } else {
      const data = snap.data();
      const targetRole = isOwner ? 'admin' : (isGuest ? 'guest' : data.role || 'customer');
      if (hasFullAccess && (!data.isPaid || data.role !== targetRole)) {
        await updateDoc(userRef, {
          isPaid: true,
          role: targetRole,
          updatedAt: serverTimestamp()
        });
        return { ...data, isPaid: true, role: targetRole };
      }
      return data;
    }
  } catch (error) {
    console.warn('Notice syncing user profile in Firestore:', error);
    const isOwner = isOwnerUser(user);
    const isGuest = isGuestUser(user);
    return {
      email: user.email || '',
      isPaid: isOwner || isGuest ? true : false,
      role: isOwner ? 'admin' : (isGuest ? 'guest' : 'customer'),
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

/**
 * Owner-restricted action: Resets all saved routines, favourites, recommended actives, scans and notes
 * for the complimentary WiseBloom Guest account.
 */
export const resetGuestAccountData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser || !isOwnerUser(currentUser)) {
    throw new Error('Unauthorized: Only the app owner can reset guest data.');
  }

  const idToken = await currentUser.getIdToken(true);

  // 1. Call backend owner-verified endpoint
  const res = await fetch('/api/admin/reset-guest-data', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    }
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Server failed to reset guest data.');
  }

  const result = await res.json();

  // 2. Clear any guest-scoped data from local storage
  try {
    const guestKeys = [
      'boots_skin_decoder_profile_guest',
      'boots_skin_decoder_favorites_guest',
      'boots_skin_decoder_routine_guest',
      'boots_skin_decoder_scans_guest',
      'boots_skin_decoder_notes_guest',
      'boots_skin_decoder_guest_last_reset'
    ];
    guestKeys.forEach((k) => localStorage.removeItem(k));
    if (result.guestUid) {
      localStorage.removeItem(`boots_skin_decoder_profile_${result.guestUid}`);
      localStorage.removeItem(`boots_skin_decoder_favorites_${result.guestUid}`);
      localStorage.removeItem(`boots_skin_decoder_routine_${result.guestUid}`);
      localStorage.removeItem(`boots_skin_decoder_scans_${result.guestUid}`);
      localStorage.removeItem(`boots_skin_decoder_notes_${result.guestUid}`);
    }
  } catch (e) {
    console.warn('Notice clearing local guest cache:', e);
  }

  return result;
};

export const getScansStorageKey = (user?: { uid?: string | null; email?: string | null; isAnonymous?: boolean } | null) => {
  const target = user || auth.currentUser;
  if (target?.isAnonymous && target?.uid) {
    return `boots_skin_decoder_scans_${target.uid}`;
  }
  return isGuestUser(target) ? 'boots_skin_decoder_scans_guest' : 'boots_skin_decoder_scans';
};

export const getNotesStorageKey = (user?: { uid?: string | null; email?: string | null; isAnonymous?: boolean } | null) => {
  const target = user || auth.currentUser;
  if (target?.isAnonymous && target?.uid) {
    return `boots_skin_decoder_notes_${target.uid}`;
  }
  return isGuestUser(target) ? 'boots_skin_decoder_notes_guest' : 'boots_skin_decoder_notes';
};
