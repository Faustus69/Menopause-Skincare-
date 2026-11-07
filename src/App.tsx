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
import { auth, logout, ensureUserProfileDoc, isOwnerUser } from './firebase';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});

  // Firebase Auth & Customer Access State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userAccount, setUserAccount] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const isRefreshingRef = React.useRef(false);

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
      let serverResult: any = null;
      try {
        const res = await fetch('/api/auth/verify-session', {
          headers: { 'Authorization': `Bearer ${idToken}` }
        });
        serverResult = await res.json();
      } catch (e) {
        console.warn('Session check warning:', e);
      }

      const isOwner = isOwnerUser(auth.currentUser);
      const isPaid = isOwner || profileDoc?.isPaid === true || serverResult?.user?.isPaid === true;

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
  }, []);

  // Auto-refresh when user switches back to the app window/tab after clicking verification link
  React.useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && auth.currentUser) {
        refreshUserAccount().catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [refreshUserAccount]);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profileDoc = await ensureUserProfileDoc(user);
          setUserAccount(profileDoc);
        } catch (e) {
          console.error('Error syncing user account doc:', e);
        }
      } else {
        setUserAccount(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const isOwner = isOwnerUser(currentUser);
  // Server-verified owner access & database-verified customer access:
  // The app owner has full access verified by their Firebase UID.
  // Customers require verified isPaid === true in Firestore.
  const isAccountPaid = Boolean(isOwner || userAccount?.isPaid === true);

  // When user is authenticated and verified paid (or owner), advance past pending/auth screen
  React.useEffect(() => {
    if (currentUser && isAccountPaid) {
      if (currentScreen === 'access_pending' || currentScreen === 'auth') {
        setCurrentScreen('home');
      }
    }
  }, [currentUser, isAccountPaid, currentScreen]);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('boots_skin_decoder_profile');
      return saved ? JSON.parse(saved) : { barrierType: null, concerns: [], recommendedIngredients: [] };
    } catch {
      return { barrierType: null, concerns: [], recommendedIngredients: [] };
    }
  });

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
        localStorage.setItem('boots_skin_decoder_profile', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save profile to localStorage', err);
      }
      return next;
    });
  }, []);

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

  const handleUpdateRoutine = (ingredientId: string, slot: RoutineSlot) => {
    setRoutine((prev) => {
      const updated = { ...prev };
      if (slot === 'none') {
        delete updated[ingredientId];
      } else {
        updated[ingredientId] = slot;
      }
      try {
        localStorage.setItem('boots_skin_decoder_routine', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save routine to localStorage', err);
      }
      return updated;
    });
  };

  const handleClearRoutine = () => {
    setRoutine({});
    try {
      localStorage.removeItem('boots_skin_decoder_routine');
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
        localStorage.setItem('boots_skin_decoder_favorites', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save favorites to localStorage', err);
      }
      return updated;
    });
  };
  
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
    // 1. Welcome Screen is accessible to everyone
    if (currentScreen === 'welcome') {
      return (
        <WelcomeScreen 
          onNavigate={(screen) => navigateTo(screen)} 
          user={currentUser}
          onSignInClick={() => navigateTo('auth')}
        />
      );
    }

    // 2. Authentication Screen (Sign In / Register / Reset Password)
    if (currentScreen === 'auth') {
      return (
        <AuthScreen 
          onSuccess={() => {
            if (isAccountPaid) {
              navigateTo('home');
            } else {
              navigateTo('access_pending');
            }
          }}
          onBackToWelcome={() => navigateTo('welcome')}
        />
      );
    }

    // 3. Gatekeeper check: Unauthenticated users are directed to the Auth screen
    if (!currentUser) {
      return (
        <AuthScreen 
          onSuccess={() => {
            if (isAccountPaid) {
              navigateTo('home');
            } else {
              navigateTo('access_pending');
            }
          }}
          onBackToWelcome={() => navigateTo('welcome')}
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
      {currentScreen !== 'welcome' && currentScreen !== 'auth' && currentScreen !== 'access_pending' && (
        <HeaderMenu 
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onGoBack={handleBack}
          hasBarrierQuizAnswers={Object.keys(quizAnswers).length > 0}
          user={currentUser}
          onSignOut={async () => {
            await logout();
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
