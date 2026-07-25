/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ChevronRight, HelpCircle, Shield, AlertCircle, RefreshCw } from 'lucide-react';
import { QUIZ_SECTIONS, QuizSection, QuizQuestion } from '../data';
import { Screen, IngredientRecord } from '../types';

interface BarrierQuizScreenProps {
  onNavigate: (screen: Screen) => void;
  onSetResults: (answers: Record<string, boolean>) => void;
  onGoBack: () => void;
}

export default function BarrierQuizScreen({ onNavigate, onSetResults, onGoBack }: BarrierQuizScreenProps) {
  // Flatten all questions into a single indexed list
  const allQuestions: { sectionId: string; sectionTitle: string; q: QuizQuestion }[] = [];
  
  QUIZ_SECTIONS.forEach((section) => {
    // Only parse sections with questions
    if (section.questions.length > 0) {
      section.questions.forEach((question) => {
        allQuestions.push({
          sectionId: section.id,
          sectionTitle: section.title,
          q: question
        });
      });
    }
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const handleAnswer = (val: boolean) => {
    const currentQ = allQuestions[currentIndex];
    const newAnswers = { ...answers, [currentQ.q.id]: val };
    setAnswers(newAnswers);

    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex((p) => p + 1);
    } else {
      // Finished all questions! Set results and navigate to results screen
      onSetResults(newAnswers);
      onNavigate('barrier_results');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((p) => p - 1);
    } else {
      onGoBack();
    }
  };

  const currentQ = allQuestions[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / allQuestions.length) * 100);

  // Section theme coloring
  const getSectionStyles = (sectionId: string) => {
    switch (sectionId) {
      case 'type_a': // Moisture
        return {
          bgLight: 'bg-[#E2B4BD]/10',
          border: 'border-[#E2B4BD]/30',
          badgeText: 'text-[#C5A059]',
          barColor: 'bg-[#C5A059]'
        };
      case 'type_b': // Inflammation
        return {
          bgLight: 'bg-rose-50',
          border: 'border-rose-200',
          badgeText: 'text-rose-700',
          barColor: 'bg-rose-500'
        };
      case 'type_c': // Lipids
        return {
          bgLight: 'bg-[#FAF9F6]',
          border: 'border-[#1B263B]/20',
          badgeText: 'text-[#1B263B]',
          barColor: 'bg-[#1B263B]'
        };
      default:
        return {
          bgLight: 'bg-stone-50',
          border: 'border-stone-200',
          badgeText: 'text-stone-700',
          barColor: 'bg-stone-400'
        };
    }
  };

  const currentStyles = getSectionStyles(currentQ.sectionId);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="flex flex-col min-h-full pb-8 select-none bg-[#FAF9F6]"
    >
      {/* Dynamic Header bar */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 font-sans">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">Skin Barrier Profiler</span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        {/* Progress & Breadcrumbs */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest font-sans">
              Discovering Your Profile
            </span>
            <span className="text-xs text-[#1B263B] font-bold font-mono">
              {currentIndex + 1} / {allQuestions.length}
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden mb-6">
            <div 
              className={`h-full transition-all duration-300 ${currentStyles.barColor}`}
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Section Information Banner */}
          <div className={`p-4 rounded-xl border ${currentStyles.bgLight} ${currentStyles.border} transition-colors duration-300 mb-8`}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#C5A059]" />
              <span className={`text-[11px] font-bold uppercase tracking-wider font-sans ${currentStyles.badgeText}`}>
                {currentQ.sectionTitle} Assessment
              </span>
            </div>
          </div>
        </div>

        {/* The Question Card */}
        <div className="flex-1 flex flex-col justify-center py-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ.q.id}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.25 }}
              className="bg-white p-7 rounded-[24px] border border-stone-200 shadow-md text-center max-w-sm mx-auto w-full flex flex-col justify-center min-h-[220px]"
            >
              <div className="text-stone-300 mb-3 flex justify-center">
                <HelpCircle className="w-10 h-10 text-[#C5A059]" />
              </div>
              <p className="text-lg font-serif italic text-[#1B263B] leading-relaxed select-text px-1">
                "{currentQ.q.text}"
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Huge, Touch-safe Controls */}
        <div className="mt-8 flex flex-col gap-3 max-w-sm mx-auto w-full">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAnswer(true)}
            className="w-full bg-[#1B263B] hover:bg-[#253447] text-white py-4 px-6 rounded-xl font-sans font-bold text-sm tracking-widest uppercase transition-colors shadow-md cursor-pointer text-center"
          >
            YES, MOST OF THE TIME
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => handleAnswer(false)}
            className="w-full bg-white hover:bg-stone-50 text-[#1B263B] py-4 px-6 rounded-xl font-sans font-bold text-sm tracking-widest uppercase transition-colors border-2 border-[#1B263B] cursor-pointer text-center"
          >
            NOT REALLY / NO
          </motion.button>
          
          <div className="text-center mt-3">
            <span className="text-[10px] text-stone-400 font-medium font-sans italic">
              "Choose the profile that describes your skin most of the time"
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
