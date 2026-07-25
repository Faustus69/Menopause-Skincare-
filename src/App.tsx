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
import HeaderMenu from './components/HeaderMenu';
import { Screen, UserProfile } from './types';

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

      const next = {
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
      {currentScreen !== 'welcome' && (
        <HeaderMenu 
          currentScreen={currentScreen}
          onNavigate={navigateTo}
          hasBarrierQuizAnswers={Object.keys(quizAnswers).length > 0}
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
