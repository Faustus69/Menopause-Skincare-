/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Home, ChevronLeft, ChevronRight, BookOpen, Award, Sparkles, Scale, Info, Heart } from 'lucide-react';
import { INGREDIENTS_DATA } from '../data';
import { Screen, IngredientRecord } from '../types';

interface ConcernResultsScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  selectedConcern: string;
  onSelectIngredient: (ingredientId: string) => void;
  favorites?: string[];
  onToggleFavorite,
  
  onUpdateProfile?: (updates: any) => void;
}

export default function ConcernResultsScreen({ 
  onNavigate, 
  onGoBack,
  selectedConcern, 
  onSelectIngredient,
  favorites = [],
  onToggleFavorite,
  onUpdateProfile
}: ConcernResultsScreenProps) {
  // Filter ingredients that match the selected concern
  const filteredIngredients = React.useMemo(() => {
    return INGREDIENTS_DATA.filter(ing => 
      ing.concern.includes(selectedConcern)
    );
  }, [selectedConcern]);

  // Keep track of the active sliding ingredient card index
  const [activeIndex, setActiveIndex] = useState(0);

  // Safety resets if the concern changes
  useEffect(() => {
    setActiveIndex(0);
  }, [selectedConcern]);

  useEffect(() => {
    if (onUpdateProfile && selectedConcern && filteredIngredients.length > 0) {
      onUpdateProfile({
        concerns: [selectedConcern],
        recommendedIngredients: filteredIngredients.map(i => i.id)
      });
    }
  }, [selectedConcern, onUpdateProfile, filteredIngredients]);

  const handleNext = () => {
    if (filteredIngredients.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % filteredIngredients.length);
  };

  const handlePrev = () => {
    if (filteredIngredients.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + filteredIngredients.length) % filteredIngredients.length);
  };

  const currentIngredient: IngredientRecord | undefined = filteredIngredients[activeIndex];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-8"
    >
      {/* Header Bar */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={onGoBack}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">Active Actives</span>
        </div>
        
        <button 
          onClick={() => onNavigate('home')}
          className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Home"
        >
          <Home className="w-5 h-5 text-[#DAA89B]" />
        </button>
      </div>

      <div className="px-6 pt-6 pb-2">
        {/* Selected Concern Display */}
        <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
          Recommended Safe Actives For:
        </span>
        <h2 className="text-2xl font-serif font-light text-[#1B263B] leading-tight mt-0.5">
          {selectedConcern}
        </h2>
        <p className="text-xs text-stone-500 mt-1.5 pr-6 font-sans mb-3">
          These actives are scientifically confirmed to assist with skin challenges in mature and menopausal skin.
        </p>

        <div className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-200/50 text-[#1B263B] text-[10.5px] leading-relaxed font-sans mb-1 flex items-start gap-2 select-text">
          <span className="text-sm leading-none shrink-0 pointer-events-none">💡</span>
          <div>
            Save any actives that appeal to you to your <strong className="font-semibold text-[#DAA89B]">❤️ Favorites</strong> lists! This will enrich your baseline foundation routine.
          </div>
        </div>
      </div>

      {filteredIngredients.length === 0 ? (
        <div className="flex-1 p-6 text-center text-stone-500 text-sm font-sans">
          No ingredients matched your query.
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-6">
          
          {/* CAROUSEL CARD AREA (With Next / Previous Navigations) */}
          <div className="px-6 flex flex-col gap-3">
            <div className="flex justify-between items-center text-xs text-[#1B263B] font-sans font-semibold">
              <span className="text-[#DAA89B] text-[10px] uppercase tracking-wider font-bold">Interactive Deck Viewer:</span>
              <span className="bg-[#E2B4BD]/20 text-[#1B263B] px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                {activeIndex + 1} of {filteredIngredients.length} actives
              </span>
            </div>

            {/* Main Interactive Flip Card Container */}
            <div className="relative">
              {/* Previous Button inside/on card left */}
              {filteredIngredients.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-[-14px] top-1/2 -translate-y-1/2 bg-white text-[#1B263B] p-2 rounded-full shadow-md hover:bg-stone-50 z-20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center border border-stone-200 cursor-pointer"
                  title="Previous Ingredient"
                >
                  <ChevronLeft className="w-5 h-5 text-[#C5A059] stroke-[2.5]" />
                </button>
              )}

              {/* Next Button inside/on card right */}
              {filteredIngredients.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-[-14px] top-1/2 -translate-y-1/2 bg-white text-[#1B263B] p-2 rounded-full shadow-md hover:bg-stone-50 z-20 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center border border-stone-200 cursor-pointer"
                  title="Next Ingredient"
                >
                  <ChevronRight className="w-5 h-5 text-[#C5A059] stroke-[2.5]" />
                </button>
              )}

              {/* Card wrapper */}
              <AnimatePresence mode="wait">
                {currentIngredient && (
                  <motion.div
                    key={currentIngredient.id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.25 }}
                    onClick={() => {
                      onSelectIngredient(currentIngredient.id);
                      onNavigate('ingredient_detail');
                    }}
                    className="w-full bg-white rounded-[24px] border-2 border-[#1B263B] p-6 shadow-md hover:shadow-lg cursor-pointer transition-all select-none overflow-hidden relative"
                  >
                    {/* Gold Leaf Corner Accent */}
                    <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-[#DAA89B]/20 to-transparent pointer-events-none rounded-tr-2xl"></div>

                    {/* Ingredient Title Banner */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#FAF9F6] border border-[#E2B4BD]/30 rounded-lg text-[#C5A059]">
                          <BookOpen className="w-4 h-4 stroke-[2]" />
                        </div>
                        <h3 className="text-xl font-serif text-[#1B263B]">
                          {currentIngredient.ingredient}
                        </h3>
                      </div>
                      
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(currentIngredient.id);
                          }}
                          className="p-1.5 rounded-full hover:bg-rose-50 text-[#DAA89B] hover:text-rose-500 transition-colors cursor-pointer active:scale-90"
                          title={favorites.includes(currentIngredient.id) ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart className={`w-4 h-4 ${favorites.includes(currentIngredient.id) ? "fill-rose-500 text-rose-500" : "text-stone-400"}`} />
                        </button>
                      )}
                    </div>

                    {/* Quick Take Quote */}
                    <div className="p-3.5 bg-[#FAF9F6] border-l-[3px] border-[#DAA89B] rounded-r-lg mb-4 text-[#1B263B] text-[13px] leading-relaxed italic font-serif">
                      “{currentIngredient.quickTake}”
                    </div>

                    <div className="flex flex-col gap-3 mt-1 text-[#1B263B]">
                      {/* Evidence Level Indicator */}
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-[#C5A059] shrink-0" />
                        <div>
                          <span className="block text-[9px] text-[#DAA89B] font-bold uppercase tracking-wider font-sans leading-none">
                            Evidence Level
                          </span>
                          <span className="text-[13px] font-semibold font-sans mt-0.5 block">
                            {currentIngredient.evidenceLevel}
                          </span>
                        </div>
                      </div>

                      {/* Worth the Spend Bar */}
                      <div className="flex items-center gap-2.5">
                        <Scale className="w-4 h-4 text-[#DAA89B] shrink-0" />
                        <div>
                          <span className="block text-[9px] text-[#DAA89B] font-bold uppercase tracking-wider font-sans leading-none">
                            Worth the spend?
                          </span>
                          <span className="text-[13px] text-[#C5A059] font-bold font-sans mt-0.5 block">
                            {currentIngredient.worthTheSpend}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Button Details Callout */}
                    <div id="full_details_btn" className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-[#C5A059] font-bold font-sans">
                      <span>Actionable Profile Details</span>
                      <span className="px-3.5 py-1.5 bg-[#1B263B] text-white hover:bg-slate-800 active:scale-95 transition-all rounded-xl text-[11px] uppercase tracking-wider">
                        decoder view &rarr;
                      </span>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* COMPREHENSIVE LIST OF ALL INGREDIENTS FOR THIS CONCERN */}
          <div className="px-6 py-2 border-t border-[#E2B4BD]/30">
            <h4 className="text-[10px] text-[#DAA89B] font-bold tracking-wider uppercase font-sans mb-3 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#C5A059]" /> Core recommended ingredients directory:
            </h4>
            
            <div className="flex flex-col gap-3">
              {filteredIngredients.map((ing, i) => {
                const isActive = activeIndex === i;
                const isFav = favorites.includes(ing.id);
                return (
                  <div
                    key={ing.id}
                    onClick={() => {
                      onSelectIngredient(ing.id);
                      onNavigate('ingredient_detail');
                    }}
                    className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between cursor-pointer ${
                      isActive 
                      ? 'bg-[#1B263B] border-[#1B263B] text-white shadow-sm' 
                      : 'bg-white border-[#E2B4BD]/40 hover:bg-[#FAF9F6] text-[#1B263B]'
                    }`}
                  >
                    <div className="flex-1 pr-4">
                      <span className={`text-sm font-bold font-sans block ${isActive ? 'text-white' : 'text-[#1B263B]'}`}>
                        {ing.ingredient}
                      </span>
                      <span className={`text-[11px] mt-0.5 line-clamp-1 font-sans block ${isActive ? 'text-stone-300' : 'text-stone-500'}`}>
                        {ing.quickTake}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2.5">
                      {isActive && (
                        <span className="text-[9px] bg-white text-[#1B263B] px-2.5 py-0.5 rounded-full font-bold font-sans uppercase tracking-wider scale-90 select-none">
                          Active Card
                        </span>
                      )}
                      
                      {onToggleFavorite && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(ing.id);
                          }}
                          className={`p-1.5 rounded-full hover:bg-[#FAF9F6]/20 transition-colors cursor-pointer active:scale-90 ${
                            isActive ? 'text-[#DAA89B]' : 'text-stone-400 hover:text-rose-500'
                          }`}
                          title={isFav ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Heart className={`w-4 h-4 ${isFav ? "fill-rose-500 text-rose-500" : (isActive ? "text-stone-300" : "text-stone-400")}`} />
                        </button>
                      )}

                      <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#DAA89B]' : 'text-stone-400'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Elegant Bottom Navigation footer */}
          <div className="px-6 mt-8 pt-6 border-t border-stone-200/60 flex flex-col items-center gap-4 select-none pb-6">
            <div className="flex items-center justify-between w-full">
              {/* Previous Page Link with Arrow */}
              <button
                onClick={onGoBack}
                className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 text-[#DAA89B]" />
                <span>Previous Page</span>
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
      )}
    </motion.div>
  );
}
