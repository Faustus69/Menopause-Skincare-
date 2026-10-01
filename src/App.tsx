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
import UpgradeScreen from './components/UpgradeScreen';
import InstallAppModal from './components/InstallAppModal';
import HeaderMenu from './components/HeaderMenu';
import { Screen, UserProfile, RoutineState, RoutineSlot } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedConcern, setSelectedConcern] = useState<string>('');
  const [selectedIngredientId, setSelectedIngredientId] = useState<string>('');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, boolean>>({});
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('boots_skin_decoder_profile');
      return saved ? JSON.parse(saved) : { barrierType: null, concerns: [], recommendedIngredients: [] };
    } catch {
      return { barrierType: null, concerns: [], recommendedIngredients: [] };
    }
  });

  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [paymentSuccessToast, setPaymentSuccessToast] = useState(false);

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

      const hasProChange = updates.isPro !== undefined && updates.isPro !== prev.isPro;
      const hasPlanChange = updates.planType !== undefined && updates.planType !== prev.planType;

      if (!hasBarrierChange && !hasConcernsChange && !hasIngredientsChange && !hasProChange && !hasPlanChange) {
        return prev;
      }

      const next: UserProfile = {
        barrierType: updates.barrierType !== undefined ? updates.barrierType : prev.barrierType,
        concerns: newConcerns,
        recommendedIngredients: newIngredients,
        isPro: updates.isPro !== undefined ? updates.isPro : prev.isPro,
        planType: updates.planType !== undefined ? updates.planType : prev.planType,
        purchasedAt: updates.purchasedAt !== undefined ? updates.purchasedAt : prev.purchasedAt
      };

      try {
        localStorage.setItem('boots_skin_decoder_profile', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save profile to localStorage', err);
      }
      return next;
    });
  }, []);

  // Listen for Stripe redirect parameters (?payment=success&session_id=...)
  React.useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const paymentStatus = urlParams.get('payment');
      const sessionId = urlParams.get('session_id');
      const plan = (urlParams.get('plan') as any) || 'lifetime';

      if (paymentStatus === 'success' && sessionId) {
        handleUpdateProfile({
          isPro: true,
          planType: plan,
          purchasedAt: new Date().toISOString()
        });
        setPaymentSuccessToast(true);
        // Clean URL parameters cleanly without page refresh
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    } catch (e) {
      console.error('Error handling payment redirect:', e);
    }
  }, [handleUpdateProfile]);

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
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={(screen) => navigateTo(screen)} />;
        
      case 'home':
        return (
          <HomeScreen 
            onNavigate={(screen) => navigateTo(screen)} 
            isPro={userProfile.isPro}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
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

      case 'upgrade':
        return (
          <UpgradeScreen
            onGoBack={handleBack}
            onNavigate={(screen) => {
              if (screen === 'home') handleGoHome();
              else navigateTo(screen);
            }}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onOpenInstallModal={() => setIsInstallModalOpen(true)}
          />
        );
        
      default:
        return <HomeScreen onNavigate={(screen) => navigateTo(screen)} isPro={userProfile.isPro} onOpenInstallModal={() => setIsInstallModalOpen(true)} />;
    }
  };

  return (
    <PhoneContainer screen={currentScreen}>
      {/* Payment Success Toast Celebration */}
      {paymentSuccessToast && (
        <div className="absolute top-3 left-4 right-4 z-50 p-4 rounded-2xl bg-gradient-to-r from-emerald-800 to-teal-900 text-white shadow-xl flex items-center justify-between animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-xl">🎉</span>
            <div>
              <span className="font-serif font-bold text-sm block">Welcome to Wise Bloom Pro!</span>
              <span className="text-[11px] text-emerald-200">Full access unlocked. Thank you for your purchase.</span>
            </div>
          </div>
          <button
            onClick={() => setPaymentSuccessToast(false)}
            className="text-xs bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-lg text-white font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {currentScreen !== 'welcome' && (
        <HeaderMenu 
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          onGoBack={handleBack}
          hasBarrierQuizAnswers={Object.keys(quizAnswers).length > 0}
          isPro={userProfile.isPro}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
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

      {/* Mobile App Install Modal */}
      <InstallAppModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </PhoneContainer>
  );
}
