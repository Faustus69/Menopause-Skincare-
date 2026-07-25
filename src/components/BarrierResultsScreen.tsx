/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowLeft, RefreshCw, ChevronRight, Home, Flame, Droplet, Layers, Sparkles, Heart } from 'lucide-react';
import { QUIZ_SECTIONS, INGREDIENTS_DATA, QuizSection } from '../data';
import { Screen, IngredientRecord } from '../types';

interface BarrierResultsScreenProps {
  onNavigate: (screen: Screen) => void;
  answers: Record<string, boolean>;
  onSelectIngredient: (id: string) => void;
  onResetQuiz: () => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  
  onUpdateProfile?: (updates: any) => void;
}

export default function BarrierResultsScreen({ 
  onNavigate, 
  answers, 
  onSelectIngredient, 
  onResetQuiz,
  favorites = [],
  onToggleFavorite,
  onUpdateProfile
}: BarrierResultsScreenProps) {
  
  // 1. Calculate section scores (yes-counts out of 4)
  const scores = QUIZ_SECTIONS.reduce((acc, section) => {
    if (section.questions.length === 0) return acc;
    const yesCount = section.questions.filter(q => answers[q.id] === true).length;
    acc[section.id] = yesCount;
    return acc;
  }, {} as Record<string, number>);

  // 2. Identify all matched categories (3 or more Yes answers)
  const matchedSectionIds = Object.keys(scores).filter(id => scores[id] >= 3);

  // 3. Establish primary profile based on critical clinical skincare priority
  // Priority: 1. Inflammation (B), 2. Lipid Depleted (C), 3. Moisture Impaired (A), 4. Healthy (D)
  let primarySectionId = 'type_d';
  if (matchedSectionIds.includes('type_b')) {
    primarySectionId = 'type_b';
  } else if (matchedSectionIds.includes('type_c')) {
    primarySectionId = 'type_c';
  } else if (matchedSectionIds.includes('type_a')) {
    primarySectionId = 'type_a';
  }

  // Find the matching configuration
  const primarySection = QUIZ_SECTIONS.find(s => s.id === primarySectionId) || QUIZ_SECTIONS[3];

  // Secondary matched sections if any
  const otherMatchedIds = matchedSectionIds.filter(id => id !== primarySectionId);
  const otherMatchedSections = QUIZ_SECTIONS.filter(s => otherMatchedIds.includes(s.id));

  React.useEffect(() => {
    if (onUpdateProfile) {
      onUpdateProfile({
        barrierType: primarySection.profileName,
        recommendedIngredients: primarySection.foundationIngredients
      });
    }
  }, [primarySection.profileName, primarySection.foundationIngredients, onUpdateProfile]);


  // State to support toggling between primary and other matched profiles in results view
  const [activeSectionId, setActiveSectionId] = useState<string>(primarySectionId);
  const activeSection = QUIZ_SECTIONS.find(s => s.id === activeSectionId) || primarySection;

  // Retrieve suggested ingredients details from the INGREDIENTS_DATA table based on data.ts config
  const getSuggestedIngredients = (section: QuizSection): IngredientRecord[] => {
    return INGREDIENTS_DATA.filter((ing) => 
      section.foundationIngredients.includes(ing.id)
    );
  };

  const suggestedIngredients = getSuggestedIngredients(activeSection);

  // Helper icons for profiles
  const getProfileIcon = (id: string) => {
    switch (id) {
      case 'type_a':
        return <Droplet className="w-8 h-8 text-sky-500" />;
      case 'type_b':
        return <Flame className="w-8 h-8 text-rose-500" />;
      case 'type_c':
        return <Layers className="w-8 h-8 text-[#C5A059]" />;
      default:
        return <ShieldCheck className="w-8 h-8 text-emerald-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full pb-10 bg-[#FAF9F6] select-none"
    >
      {/* Header bar */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 font-sans">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('concern_list')}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Choose Skin Concern"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <button
            onClick={() => onNavigate('concern_list')}
            className="font-serif font-semibold text-base tracking-wide text-white bg-transparent border-none p-0 cursor-pointer hover:text-[#DAA89B] transition-colors text-left"
            title="Choose Skin Concern"
          >
            Your Barrier Profile
          </button>
        </div>
        <button 
          onClick={() => onNavigate('home')}
          className="p-1 text-[#DAA89B] hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {/* Intro Tag */}
        <div className="text-center mb-6">
          <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
            Diagnostic Analysis Completed
          </span>
          <h2 className="text-2xl font-serif font-light text-[#1B263B] mt-0.5">
            Your Barrier Profile
          </h2>
        </div>

        {/* Evaluation Scores Breakdown */}
        <div className="bg-white p-4 rounded-xl border border-stone-200/60 mb-6 shadow-3xs">
          <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest mb-3 font-sans">
            Profile Scores (Requires 3+ For Positive Match)
          </span>
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-medium font-sans">Type A (Moisture Impaired):</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${scores['type_a'] >= 3 ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'bg-stone-100 text-stone-500'}`}>
                {scores['type_a']} / 4
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-medium font-sans">Type B (Inflammation-Reactive):</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${scores['type_b'] >= 3 ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-stone-100 text-stone-500'}`}>
                {scores['type_b']} / 4
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-stone-600 font-medium font-sans">Type C (Lipid Depleted):</span>
              <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${scores['type_c'] >= 3 ? 'bg-amber-50 text-[#C5A059] border border-amber-100' : 'bg-stone-100 text-stone-500'}`}>
                {scores['type_c']} / 4
              </span>
            </div>
          </div>
        </div>

        {/* Multi-match Segment Toggler */}
        {matchedSectionIds.length > 1 && (
          <div className="mb-6">
            <span className="block text-[9px] text-[#DAA89B] font-bold uppercase tracking-widest mb-2 font-sans">
              Multiple Types Matched! Select Profile to Review:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {QUIZ_SECTIONS.slice(0, 3).map((sec) => {
                const isMatched = scores[sec.id] >= 3;
                if (!isMatched) return null;
                const isActive = activeSectionId === sec.id;
                
                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`py-2 px-1 text-[10px] font-bold font-sans rounded-lg border text-center transition-all cursor-pointer ${
                      isActive 
                        ? 'bg-[#1B263B] text-white border-[#1B263B] shadow-sm'
                        : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {sec.id === 'type_a' ? 'Dehydrated' : sec.id === 'type_b' ? 'Reactive' : 'Lipid Depleted'}
                    {primarySectionId === sec.id && (
                      <span className="block text-[7px] text-[#DAA89B] uppercase font-bold tracking-tight mt-0.5">
                        Primary
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Primary Selected Profile Detail Card */}
        <div className="bg-[#1B263B] text-stone-100 p-6 rounded-[24px] shadow-md border border-[#1B263B]/10 mb-6 select-text">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-white/10 rounded-2xl">
              {getProfileIcon(activeSection.id)}
            </div>
            <div>
              {primarySectionId === activeSection.id && activeSection.id !== 'type_d' && (
                <span className="inline-block text-[8px] bg-[#DAA89B]/20 text-[#DAA89B] border border-[#DAA89B]/30 font-bold px-1.5 py-0.5 rounded mb-1 font-sans tracking-widest uppercase">
                  Primary Recommendation
                </span>
              )}
              <h3 className="text-xl font-serif text-white font-semibold leading-tight">
                {activeSection.profileName}
              </h3>
            </div>
          </div>

          <div>
            <span className="block text-[9px] text-[#DAA89B] font-bold tracking-widest uppercase mb-1 font-sans">
              What This Actually Means:
            </span>
            <p className="text-sm font-sans text-stone-200 leading-relaxed italic mb-4">
              “{activeSection.description}”
            </p>

            <span className="block text-[9px] text-[#DAA89B] font-bold tracking-widest uppercase mb-1 font-sans">
              How it works in midlife / menopause:
            </span>
            <p className="text-xs font-sans text-stone-300 leading-relaxed">
              {activeSection.howItWorks}
            </p>
          </div>
        </div>

        {/* Foundation Ingredients List */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4.5 h-4.5 text-[#C5A059]" />
            <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
              Your Foundation Ingredients
            </span>
          </div>

          <p className="text-xs text-stone-500 leading-relaxed mb-3 font-sans font-medium">
            These active compounds are scientifically chosen to target and rebuild your specific profile barrier type:
          </p>

          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/50 text-[#1B263B] text-[11px] leading-relaxed font-sans mb-4 flex items-start gap-2.5 select-text">
            <span className="text-sm leading-none shrink-0 pointer-events-none">💡</span>
            <div>
              <strong className="font-semibold block text-[#C5A059] mb-0.5">Decoder System Guide:</strong>
              Tap on any recommended ingredient card below to read its in-depth science, and click the <strong className="font-semibold">❤️ Heart icon</strong> to save it in your favorites list. This starts your customized midlife skincare baseline!
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {suggestedIngredients.length > 0 ? (
              suggestedIngredients.map((ing) => {
                const isFav = favorites.includes(ing.id);
                return (
                  <div
                    key={ing.id}
                    onClick={() => onSelectIngredient(ing.id)}
                    className="w-full bg-white hover:bg-stone-50 p-4 rounded-xl flex items-center justify-between border border-stone-200/80 shadow-3xs cursor-pointer group text-left transition-colors relative"
                  >
                    <div className="flex-1 pr-3">
                      <span className="block text-sm font-serif font-semibold text-[#1B263B] group-hover:text-[#C5A059] transition-colors">
                        {ing.ingredient}
                      </span>
                      <span className="block text-xs text-stone-500 line-clamp-1 mt-0.5 font-sans">
                        {ing.quickTake}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0">
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(ing.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-rose-50 transition-colors cursor-pointer text-[#DAA89B] hover:text-rose-500 active:scale-90"
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : "text-stone-400"}`} />
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-[#C5A059] group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback just rendering text names if list is empty
              <div className="bg-white p-4 rounded-xl border border-stone-200 text-center text-xs text-stone-500 font-sans italic">
                {activeSection.foundationIngredientsText}
              </div>
            )}
          </div>
        </div>

        {/* Guided Step 3 Pathway */}
        <div className="bg-white border border-[#E2B4BD]/65 p-5 rounded-2xl select-none mt-2 shadow-3xs mb-4">
          <span className="text-[9px] text-[#DAA89B] font-bold tracking-widest uppercase block mb-1 font-sans">
            Methodology Continuation
          </span>
          <h4 className="text-sm font-serif font-bold text-[#1B263B] leading-snug">
            Next: Step 3 — Choose Your Midlife Skin Concern
          </h4>
          <p className="text-[11px] text-stone-500 font-sans mt-1 leading-relaxed">
            With your baseline foundation ingredients selected and saved, proceed to Step 3 of the decoder system to address skin concern challenges (like wrinkles, sagging, pigmentation, or dry patches).
          </p>
          
          <button
            onClick={() => onNavigate('concern_list')}
            className="w-full mt-3.5 py-3 bg-[#1B263B] hover:bg-[#253447] text-white font-bold font-sans rounded-xl text-xs text-center tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-97"
          >
            <span>What is my Skin Concern?</span>
            <ArrowLeft className="w-3.5 h-3.5 text-[#DAA89B] rotate-180" />
          </button>
        </div>

        {/* Actions button */}
        <div className="flex gap-3 mt-8 select-none">
          <button
            onClick={onResetQuiz}
            className="flex-1 py-3.5 border-2 border-[#1B263B] bg-white text-[#1B263B] font-bold font-sans rounded-xl text-center text-xs cursor-pointer active:scale-97 transition-transform flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retake Quiz
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="flex-1 py-3.5 bg-[#1B263B] text-white font-bold font-sans rounded-xl text-center text-xs cursor-pointer active:scale-97 transition-transform shadow-md"
          >
            Go to App Home
          </button>
        </div>

        {/* Elegant Bottom Navigation footer */}
        <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col items-center gap-4 select-none">
          <div className="flex items-center justify-between w-full">
            {/* Previous Page Link with Arrow */}
            <button
              onClick={() => onNavigate('concern_list')}
              className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#DAA89B]" />
              <span>Choose Your Skin Concern (Step 3)</span>
            </button>

            {/* Back to Top Anchor */}
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-y-auto');
                if (container) {
                  container.scrollTo({ top: 0, behavior: 'smooth' });
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-xs font-sans font-bold text-[#C5A059] hover:text-[#1B263B] transition-colors cursor-pointer"
              title="Back to Top"
            >
              <span>Back to Top</span>
              <span className="text-sm font-semibold">↑</span>
            </button>
          </div>
          <p className="text-[10px] text-stone-400 font-sans tracking-wide">
            The Menopause Skincare Decoder • Est. 2026
          </p>
        </div>
      </div>
    </motion.div>
  );
}
