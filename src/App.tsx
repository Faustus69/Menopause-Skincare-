/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import PhoneContainer from './components/PhoneContainer';
import HomeScreen from './components/HomeScreen';
import ConcernScreen from './components/ConcernScreen';
import ConcernResultsScreen from './components/ConcernResultsScreen';
import IngredientAZScreen from './components/IngredientAZScreen';
import IngredientDetailScreen from './components/IngredientDetailScreen';
import BarrierQuizScreen from './components/BarrierQuizScreen';
import BarrierResultsScreen from './components/BarrierResultsScreen';
import HowToUseScreen from './components/HowToUseScreen';
import FavoritesScreen from './components/FavoritesScreen';
import ProductAnalyzerScreen from './components/ProductAnalyzerScreen';
import NotesScreen from './components/NotesScreen';
import SavedScansScreen from './components/SavedScansScreen';
import SkinProfilerScreen from './components/SkinProfilerScreen';
import WelcomeScreen from './components/WelcomeScreen';
import RoutineBuilderScreen from './components/RoutineBuilderScreen';
import HeaderMenu from './components/HeaderMenu';
import AuthScreen from './components/AuthScreen';
import AccessPendingScreen from './components/AccessPendingScreen';
import { Screen, UserProfile, RoutineState, RoutineSlot } from './types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  auth, 
  logout, 
  ensureUserProfileDoc, 
  isOwnerUser, 
  isGuestUser, 
  resetGuestAccountData,
  redeemGuestInvite,
  getStoredGuestPass,
  clearStoredGuestPass
} from './firebase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});

  // Firebase Auth & Customer Access State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isServerVerifiedGuest, setIsServerVerifiedGuest] = useState(false);

  const pendingInviteTokenRef = React.useRef<string | null>(
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('invite') : null
  );
  const isRedeemingInviteRef = React.useRef<boolean>(false);
  const [inviteProcessing, setInviteProcessing] = useState<boolean>(() => Boolean(pendingInviteTokenRef.current));
  const [inviteError, setInviteError] = useState<string | null>(null);

  const isRefreshingRef = React.useRef(false);

  const lastGuestVerifyAtRef = React.useRef<number>(0);

  const verifyServerSession = React.useCallback(async (user: User, idToken?: string) => {
    try {
      let token = idToken || (await user.getIdToken());
      const guestPass = getStoredGuestPass(user.uid);
      let res = await fetch('/api/auth/verify-session', {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(guestPass ? { 'X-Guest-Pass': guestPass } : {})
        }
      });
      if (res.status === 401 && !idToken) {
        token = await user.getIdToken(true);
        res = await fetch('/api/auth/verify-session', {
          headers: {
            'Authorization': `Bearer ${token}`,
            ...(guestPass ? { 'X-Guest-Pass': guestPass } : {})
          }
        });
      }
      if (!res.ok) return null;
      return await res.json();
    } catch (e) {
      console.warn('Session check warning:', e);
      return null;
    }
  }, []);

  const refreshUserAccount = React.useCallback(async () => {
    if (!auth.currentUser || isRefreshingRef.current) return null;
    isRefreshingRef.current = true;
    try {
      // 1. Force reload user profile from Google Firebase Auth servers
      await auth.currentUser.reload();
      // 2. Force refresh security token to obtain latest email_verified claim
      const idToken = await auth.currentUser.getIdToken(true);
      
      // 3. Create a new user snapshot to guarantee React re-renders with updated emailVerified
      const clonedUser = Object.assign(Object.create(Object.getPrototypeOf(auth.currentUser)), auth.currentUser);
      setCurrentUser(clonedUser);

      // 4. Fetch the latest user profile from Firestore
      const profileDoc = await ensureUserProfileDoc(auth.currentUser);
      setUserAccount(profileDoc);

      // 5. Query /api/auth/verify-session on our server
      const serverResult = await verifyServerSession(auth.currentUser, idToken);
      const verifiedGuest = Boolean(serverResult?.user?.isInvitedGuest && serverResult?.user?.isPaid);
      setIsServerVerifiedGuest(verifiedGuest);
      if (auth.currentUser.isAnonymous && serverResult && !verifiedGuest) {
        clearStoredGuestPass(auth.currentUser.uid);
      }

      const isOwner = isOwnerUser(auth.currentUser);
      const isLegacyGuest = isGuestUser(auth.currentUser);
      const isPaid = Boolean(
        isOwner ||
        isLegacyGuest ||
        verifiedGuest ||
        (!auth.currentUser.isAnonymous && (profileDoc?.isPaid === true || serverResult?.user?.isPaid === true))
      );

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      return {
        emailVerified: Boolean(auth.currentUser.emailVerified),
        isPaid,
        email: auth.currentUser.email,
        timestamp: timeStr
      };
    } catch (err) {
      console.warn('Error refreshing user status:', err);
      return null;
    } finally {
      isRefreshingRef.current = false;
    }
  }, [verifyServerSession]);

  const recheckGuestAccess = React.useCallback(async () => {
    const user = auth.currentUser;
    if (!user || !user.isAnonymous || isRedeemingInviteRef.current) return;
    const now = Date.now();
    if (now - lastGuestVerifyAtRef.current < 3000) return;
    lastGuestVerifyAtRef.current = now;

    const serverResult = await verifyServerSession(user);
    if (!serverResult) return;

    const verifiedGuest = Boolean(serverResult?.user?.isInvitedGuest && serverResult?.user?.isPaid);
    setIsServerVerifiedGuest(verifiedGuest);
    if (!verifiedGuest) {
      clearStoredGuestPass(user.uid);
    }
  }, [verifyServerSession]);

  // Auto-refresh when user switches back to the app window/tab
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && auth.currentUser) {
        if (auth.currentUser.isAnonymous) {
          recheckGuestAccess().catch(() => {});
        } else {
          refreshUserAccount().catch(() => {});
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [refreshUserAccount, recheckGuestAccess]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profileDoc = await ensureUserProfileDoc(user);
          setUserAccount(profileDoc);
          if (!isRedeemingInviteRef.current) {
            const serverResult = await verifyServerSession(user);
            const verifiedGuest = Boolean(serverResult?.user?.isInvitedGuest && serverResult?.user?.isPaid);
            setIsServerVerifiedGuest(verifiedGuest);
            if (user.isAnonymous && serverResult && !verifiedGuest && !pendingInviteTokenRef.current) {
              clearStoredGuestPass(user.uid);
            }
          }
        } catch (e) {
          console.error('Error syncing user account doc:', e);
        }
      } else {
        setUserAccount(null);
        setIsServerVerifiedGuest(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, [verifyServerSession]);

  const isOwner = isOwnerUser(currentUser);
  const isGuest = isGuestUser(currentUser) || isServerVerifiedGuest;
  // Server-verified owner access, invited guest access, legacy guest access, & database-verified customer access:
  const isAccountPaid = Boolean(
    isOwner ||
    isGuestUser(currentUser) ||
    isServerVerifiedGuest ||
    (!currentUser?.isAnonymous && userAccount?.isPaid === true)
  );

  // Process one-click guest invitation links (?invite=...) once Firebase Auth initializes
  React.useEffect(() => {
    if (authLoading || !pendingInviteTokenRef.current || isRedeemingInviteRef.current) return;

    const inviteToken = pendingInviteTokenRef.current;

    // Preserve existing Owner or Paid Customer sessions without switching them to guest
    if (currentUser && (isOwnerUser(currentUser) || (!currentUser.isAnonymous && userAccount?.isPaid === true))) {
      pendingInviteTokenRef.current = null;
      try {
        const url = new URL(window.location.href);
        url.searchParams.delete('invite');
        window.history.replaceState({}, '', url.pathname + url.search + url.hash);
      } catch {
        // Ignore URL history errors
      }
      setCurrentScreen('home');
      setHistory(['home']);
      setInviteProcessing(false);
      return;
    }

    isRedeemingInviteRef.current = true;
    (async () => {
      try {
        const res = await redeemGuestInvite(inviteToken);
        pendingInviteTokenRef.current = null;
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('invite');
          window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        } catch {
          // Ignore URL history errors
        }
        setCurrentUser(res.user);
        setIsServerVerifiedGuest(true);
        setInviteError(null);
        setCurrentScreen('home');
        setHistory(['home']);
      } catch (err: any) {
        pendingInviteTokenRef.current = null;
        try {
          const url = new URL(window.location.href);
          url.searchParams.delete('invite');
          window.history.replaceState({}, '', url.pathname + url.search + url.hash);
        } catch {
          // Ignore URL history errors
        }
        setIsServerVerifiedGuest(false);
        setInviteError(err?.message || 'This guest invitation link is invalid or has been revoked.');
        if (auth.currentUser?.isAnonymous) {
          await logout().catch(() => {});
        }
        setCurrentScreen('auth');
      } finally {
        isRedeemingInviteRef.current = false;
        setInviteProcessing(false);
      }
    })();
  }, [authLoading, currentUser, userAccount]);

  // When user is authenticated and verified paid, owner, or guest, advance past pending/auth screen
  React.useEffect(() => {
    if (currentUser && isAccountPaid) {
      if (currentScreen === 'access_pending' || currentScreen === 'auth') {
        setCurrentScreen('home');
      }
    }
  }, [currentUser, isAccountPaid, currentScreen]);

  const getProfileStorageKey = React.useCallback((u?: User | null) => {
    if (u?.isAnonymous && u?.uid) return `boots_skin_decoder_profile_${u.uid}`;
    return isGuestUser(u) ? 'boots_skin_decoder_profile_guest' : 'boots_skin_decoder_profile';
  }, []);

  const getFavoritesStorageKey = React.useCallback((u?: User | null) => {
    if (u?.isAnonymous && u?.uid) return `boots_skin_decoder_favorites_${u.uid}`;
    return isGuestUser(u) ? 'boots_skin_decoder_favorites_guest' : 'boots_skin_decoder_favorites';
  }, []);

  const getRoutineStorageKey = React.useCallback((u?: User | null) => {
    if (u?.isAnonymous && u?.uid) return `boots_skin_decoder_routine_${u.uid}`;
    return isGuestUser(u) ? 'boots_skin_decoder_routine_guest' : 'boots_skin_decoder_routine';
  }, []);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('boots_skin_decoder_profile');
      return saved ? JSON.parse(saved) : { barrierType: null, concerns: [], recommendedIngredients: [] };
    } catch {
      return { barrierType: null, concerns: [], recommendedIngredients: [] };
    }
  });

  // Favorites State with localStorage persistence for safe, durable user sessions
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('boots_skin_decoder_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Routine State with localStorage persistence
  const [routine, setRoutine] = useState<RoutineState>(() => {
    try {
      const saved = localStorage.getItem('boots_skin_decoder_routine');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Synchronize data for active user (and auto-purge guest data if server flagged a reset)
  React.useEffect(() => {
    const profKey = getProfileStorageKey(currentUser);
    const favKey = getFavoritesStorageKey(currentUser);
    const routKey = getRoutineStorageKey(currentUser);

    if (isGuestUser(currentUser) && userAccount?.lastResetAt) {
      const localReset = localStorage.getItem('boots_skin_decoder_guest_last_reset');
      if (localReset !== userAccount.lastResetAt) {
        localStorage.removeItem(profKey);
        localStorage.removeItem(favKey);
        localStorage.removeItem(routKey);
        localStorage.removeItem('boots_skin_decoder_scans_guest');
        localStorage.removeItem('boots_skin_decoder_notes_guest');
        localStorage.setItem('boots_skin_decoder_guest_last_reset', userAccount.lastResetAt);
      }
    }

    try {
      const p = localStorage.getItem(profKey);
      setUserProfile(p ? JSON.parse(p) : { barrierType: null, concerns: [], recommendedIngredients: [] });
    } catch {
      setUserProfile({ barrierType: null, concerns: [], recommendedIngredients: [] });
    }

    try {
      const f = localStorage.getItem(favKey);
      setFavorites(f ? JSON.parse(f) : []);
    } catch {
      setFavorites([]);
    }

    try {
      const r = localStorage.getItem(routKey);
      setRoutine(r ? JSON.parse(r) : {});
    } catch {
      setRoutine({});
    }
  }, [currentUser, userAccount?.lastResetAt, getProfileStorageKey, getFavoritesStorageKey, getRoutineStorageKey]);

  const handleUpdateProfile = React.useCallback((updates: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const hasBarrierChange = updates.barrierType !== undefined && updates.barrierType !== prev.barrierType;

      const newConcerns = updates.concerns
        ? Array.from(new Set([...prev.concerns, ...updates.concerns]))
        : prev.concerns;
      const hasConcernsChange = updates.concerns !== undefined && (
        newConcerns.length !== prev.concerns.length ||
        newConcerns.some((c, i) => c !== prev.concerns[i])
      );

      const newIngredients = updates.recommendedIngredients
        ? Array.from(new Set([...prev.recommendedIngredients, ...updates.recommendedIngredients]))
        : prev.recommendedIngredients;
      const hasIngredientsChange = updates.recommendedIngredients !== undefined && (
        newIngredients.length !== prev.recommendedIngredients.length ||
        newIngredients.some((ing, i) => ing !== prev.recommendedIngredients[i])
      );

      if (!hasBarrierChange && !hasConcernsChange && !hasIngredientsChange) {
        return prev;
      }

      const next: UserProfile = {
        barrierType: updates.barrierType !== undefined ? updates.barrierType : prev.barrierType,
        concerns: newConcerns,
        recommendedIngredients: newIngredients
      };

      try {
        localStorage.setItem(getProfileStorageKey(currentUser), JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save profile to localStorage', err);
      }
      return next;
    });
  }, [currentUser, getProfileStorageKey]);

  const handleUpdateRoutine = (ingredientId: string, slot: RoutineSlot) => {
    setRoutine((prev) => {
      const updated = { ...prev };
      if (slot === 'none') {
        delete updated[ingredientId];
      } else {
        updated[ingredientId] = slot;
      }
      try {
        localStorage.setItem(getRoutineStorageKey(currentUser), JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save routine to localStorage', err);
      }
      return updated;
    });
  };

  const handleClearRoutine = () => {
    setRoutine({});
    try {
      localStorage.removeItem(getRoutineStorageKey(currentUser));
    } catch (err) {
      console.error('Failed to clear routine in localStorage', err);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => {
      let updated;
      if (prev.includes(id)) {
        updated = prev.filter((item) => item !== id);
      } else {
        updated = [...prev, id];
      }
      try {
        localStorage.setItem(getFavoritesStorageKey(currentUser), JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save favorites to localStorage', err);
      }
      return updated;
    });
  };

  const handleResetGuestData = React.useCallback(async () => {
    await resetGuestAccountData();
    // If the active user right now happens to be the guest, immediately clear state in memory
    if (isGuestUser(currentUser)) {
      setUserProfile({ barrierType: null, concerns: [], recommendedIngredients: [] });
      setFavorites([]);
      setRoutine({});
    }
  }, [currentUser]);
  
  // Custom back-stack history array to simulate true Android system back behaviour
  const [history, setHistory] = useState<Screen[]>(['welcome']);

  const navigateTo = (screen: Screen) => {
    setCurrentScreen(screen);
    setHistory((prev) => [...prev, screen]);
  };

  const handleBack = () => {
    if (history.length <= 1) {
      setCurrentScreen('home');
      setHistory(['home']);
      return;
    }
    const newHistory = [...history];
    newHistory.pop(); // remove current
    const previousScreen = newHistory[newHistory.length - 1];
    setHistory(newHistory);
    setCurrentScreen(previousScreen || 'home');
  };

  const handleGoHome = () => {
    setCurrentScreen('home');
    setHistory(['home']);
  };

  // Safe router rendering the accurate views inside the simulated Android phone frame
  const renderScreen = () => {
    // 0. Processing private guest invitation link
    if (inviteProcessing) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#F9F7F3] text-[#1A2622] px-6 text-center">
          <div className="w-12 h-12 rounded-full bg-[#D1DEC8] flex items-center justify-center mb-4 animate-pulse">
            <span className="font-serif text-lg font-bold text-[#4A5D48]">W</span>
          </div>
          <h2 className="font-serif text-xl font-medium text-[#1A2622] mb-1">
            Opening Your Guest Pass
          </h2>
          <p className="text-xs text-[#556953]">
            Verifying your private WiseBloom invitation...
          </p>
        </div>
      );
    }

    // 1. Welcome Screen is accessible to everyone
    if (currentScreen === 'welcome') {
      return (
        <WelcomeScreen 
          onNavigate={(screen) => navigateTo(screen)} 
          user={currentUser?.isAnonymous && !isAccountPaid ? null : currentUser}
          onSignInClick={() => navigateTo('auth')}
        />
      );
    }

    // 2. Authentication Screen (Sign In / Register / Reset Password)
    if (currentScreen === 'auth') {
      return (
        <AuthScreen 
          onSuccess={() => {
            setInviteError(null);
            if (isAccountPaid) {
              navigateTo('home');
            } else {
              navigateTo('access_pending');
            }
          }}
          onBackToWelcome={() => navigateTo('welcome')}
          initialNotice={inviteError}
        />
      );
    }

    // 3. Gatekeeper check: Unauthenticated users (or unverified anonymous sessions) are directed to the Auth screen
    if (!currentUser || (currentUser.isAnonymous && !isAccountPaid)) {
      return (
        <AuthScreen 
          onSuccess={() => {
            setInviteError(null);
            if (isAccountPaid) {
              navigateTo('home');
            } else {
              navigateTo('access_pending');
            }
          }}
          onBackToWelcome={() => navigateTo('welcome')}
          initialNotice={
            inviteError ||
            (currentUser?.isAnonymous && !authLoading
              ? 'Your guest invitation link is no longer active. Please ask WiseBloom for a new link or sign in with your account.'
              : null)
          }
        />
      );
    }

    // 4. Access Pending Screen: Registered customers whose payment is not yet verified
    if (!isAccountPaid) {
      return (
        <AccessPendingScreen 
          user={currentUser}
          onRefreshStatus={refreshUserAccount}
        />
      );
    }

    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            onNavigate={(screen) => navigateTo(screen)} 
          />
        );
        
      case 'concern_list':
        return (
          <ConcernScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            onSelectConcern={(concern) => setSelectedConcern(concern)}
          />
        );
        
      case 'concern_results':
        return (
          <ConcernResultsScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            selectedConcern={selectedConcern}
            onSelectIngredient={(ingId) => setSelectedIngredientId(ingId)}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onUpdateProfile={handleUpdateProfile}
          />
        );
        
      case 'ingredient_az':
        return (
          <IngredientAZScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            onSelectIngredient={(ingId) => {
              setSelectedIngredientId(ingId);
              navigateTo('ingredient_detail');
            }}
          />
        );
        
      case 'ingredient_detail':
        return (
          <IngredientDetailScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            selectedIngredientId={selectedIngredientId}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );

      case 'barrier_quiz':
        return (
          <BarrierQuizScreen
            onNavigate={(screen) => navigateTo(screen)}
            onSetResults={(ans) => setQuizAnswers(ans)}
            onGoBack={handleBack}
          />
        );

      case 'barrier_results':
        return (
          <BarrierResultsScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            answers={quizAnswers}
            onSelectIngredient={(ingId) => {
              setSelectedIngredientId(ingId);
              navigateTo('ingredient_detail');
            }}
            onResetQuiz={() => {
              setQuizAnswers({});
              navigateTo('barrier_quiz');
            }}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onUpdateProfile={handleUpdateProfile}
          />
        );

      case 'how_to_use':
        return (
          <HowToUseScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
          />
        );
        
      case 'favorites':
        return (
          <FavoritesScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectIngredient={(ingId) => {
              setSelectedIngredientId(ingId);
              navigateTo('ingredient_detail');
            }}
          />
        );

      case 'routine_builder':
        return (
          <RoutineBuilderScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            favorites={favorites}
            routine={routine}
            onUpdateRoutine={handleUpdateRoutine}
            onClearRoutine={handleClearRoutine}
            onToggleFavorite={handleToggleFavorite}
            onSelectIngredient={(ingId) => {
              setSelectedIngredientId(ingId);
              navigateTo('ingredient_detail');
            }}
          />
        );
        
      case 'skin_profiler':
        return (
          <SkinProfilerScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            userProfile={userProfile}
            onSelectIngredient={(ingId) => {
              setSelectedIngredientId(ingId);
              navigateTo('ingredient_detail');
            }}
          />
        );
        
      case 'product_analyzer':
        return (
          <ProductAnalyzerScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
            favorites={favorites}
            routine={routine}
            onUpdateRoutine={handleUpdateRoutine}
            onToggleFavorite={handleToggleFavorite}
            onSelectIngredient={(ingId) => {
              setSelectedIngredientId(ingId);
              navigateTo('ingredient_detail');
            }}
            userProfile={userProfile}
          />
        );

      
      case 'saved_scans':
        return <SavedScansScreen onNavigate={setCurrentScreen} />;
      case 'notes':
        return (
          <NotesScreen
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            onGoBack={handleBack}
          />
        );

      default:
        return <HomeScreen onNavigate={(screen) => navigateTo(screen)} />;
    }
  };

  return (
    <PhoneContainer screen={currentScreen}>
      {!inviteProcessing && currentScreen !== 'welcome' && currentScreen !== 'auth' && currentScreen !== 'access_pending' && !(currentUser?.isAnonymous && !isAccountPaid) && (
        <HeaderMenu 
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onGoBack={handleBack}
          hasBarrierQuizAnswers={Object.keys(quizAnswers).length > 0}
          user={currentUser}
          isOwner={isOwner}
          onResetGuestData={handleResetGuestData}
          onSignOut={async () => {
            await logout();
            setIsServerVerifiedGuest(false);
            navigateTo('welcome');
          }}
          onSignInClick={() => navigateTo('auth')}
        />
      )}
      <div className="flex-1 relative overflow-hidden flex flex-col">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentScreen}
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full flex-1 flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </PhoneContainer>
  );
}
