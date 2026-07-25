/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Home, Heart, Trash2, ChevronRight, Sparkles, AlertTriangle, FileText } from 'lucide-react';
import { INGREDIENTS_DATA } from '../data';
import { Screen } from '../types';

interface FavoritesScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectIngredient: (id: string) => void;
}

export default function FavoritesScreen({
  onNavigate,
  onGoBack,
  favorites,
  onToggleFavorite,
  onSelectIngredient
}: FavoritesScreenProps) {
  // Get ingredient details for favorited IDs
  const favoritedIngredients = INGREDIENTS_DATA.filter((ing) => favorites.includes(ing.id));

  const exportSummary = () => {
    let summary = `My Saved Skincare Routine\n`;
    summary += `=========================\n\n`;
    
    if (favoritedIngredients.length === 0) {
      summary += `No ingredients saved yet.\n`;
    } else {
      const morningIngs = favoritedIngredients.filter(ing => {
        const ampm = (ing.suitabilityAMPM || '').toLowerCase();
        return ampm.includes('am') || ampm.includes('morning');
      });

      const nightIngs = favoritedIngredients.filter(ing => {
        const ampm = (ing.suitabilityAMPM || '').toLowerCase();
        return ampm.includes('pm') || ampm.includes('night') || ampm === '';
      });

      summary += `Morning Routine:\n`;
      summary += `----------------\n`;
      if (morningIngs.length > 0) {
        morningIngs.forEach(ing => {
          summary += `${ing.ingredient.toUpperCase()} (${ing.stage})\n`;
          summary += `Details: ${ing.quickTake}\n`;
          summary += `What to know: ${ing.whatToKnow || 'N/A'}\n\n`;
        });
      } else {
        summary += `No ingredients saved for morning.\n\n`;
      }

      summary += `Night Routine:\n`;
      summary += `--------------\n`;
      if (nightIngs.length > 0) {
        nightIngs.forEach(ing => {
          summary += `${ing.ingredient.toUpperCase()} (${ing.stage})\n`;
          summary += `Details: ${ing.quickTake}\n`;
          summary += `What to know: ${ing.whatToKnow || 'N/A'}\n\n`;
        });
      } else {
        summary += `No ingredients saved for night.\n\n`;
      }
    }
    
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_Saved_Routine.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-8"
    >
      {/* Header element */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={onGoBack}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            id="fav_back_btn"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">Saved Ingredients</span>
        </div>
        
        <div className="flex items-center gap-2">
          {favoritedIngredients.length > 0 && (
            <button 
              onClick={exportSummary}
              className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
              title="Export Routine"
            >
              <FileText className="w-5 h-5 text-[#DAA89B]" />
            </button>
          )}
          <button 
            onClick={() => onNavigate('home')}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            id="fav_home_btn"
            title="Home"
          >
            <Home className="w-5 h-5 text-[#DAA89B]" />
          </button>
        </div>
      </div>

      <div className="p-6 bg-[#FAF9F6] flex-1 flex flex-col justify-between">
        <div>
          {/* Header Description */}
          <div className="mb-6 select-none">
            <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
              Personalized Regiment list
            </span>
            <h2 className="text-2xl font-serif font-light text-[#1B263B] mt-0.5">
              My Saved Ingredients
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-sans">
              Quickly monitor warnings, compatibility, and application notes for ingredients of your choice.
            </p>
          </div>

          {/* Favorites List Logic */}
          <AnimatePresence mode="popLayout">
            {favoritedIngredients.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-[#E2B4BD]/35 rounded-2xl p-8 text-center shadow-3xs select-none"
                key="empty_state"
              >
                <div className="w-16 h-16 bg-[#FAF9F6] border border-[#E2B4BD]/20 rounded-full flex items-center justify-center mx-auto mb-4 text-[#DAA89B]">
                  <Heart className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h4 className="text-[15px] font-bold text-[#1B263B] font-sans">No saved items yet</h4>
                <p className="text-xs text-stone-500 mt-2 leading-relaxed font-sans max-w-xs mx-auto">
                  Click the heart icon on any active component card to build your personalized skincare library.
                </p>

                <div className="mt-6 flex flex-col gap-2.5">
                  <button
                    onClick={() => onNavigate('ingredient_az')}
                    id="fav_empty_btn_az"
                    className="w-full py-3 bg-[#1B263B] text-white font-sans font-bold rounded-xl text-xs cursor-pointer hover:bg-[#253447] transition-colors"
                  >
                    Browse A–Z Ingredients
                  </button>
                  <button
                    onClick={() => onNavigate('concern_list')}
                    id="fav_empty_btn_concern"
                    className="w-full py-3 bg-white border border-[#1B263B] text-[#1B263B] font-sans font-bold rounded-xl text-xs cursor-pointer hover:bg-stone-50 transition-colors"
                  >
                    Explore by Skin Concern
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col gap-4 select-none" key="favorites_list">
                {favoritedIngredients.map((ing) => (
                  <motion.div
                    key={ing.id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    className="bg-white rounded-2xl p-4.5 border border-[#E2B4BD]/20 shadow-3xs hover:shadow-2xs transition-all relative flex items-start gap-4 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#DAA89B] font-bold tracking-widest uppercase font-mono">
                          {ing.stage}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-light text-[#1B263B] mt-0.5 truncate pr-8">
                        {ing.ingredient}
                      </h3>
                      <p className="text-xs text-stone-500 font-sans mt-1.5 italic line-clamp-2 leading-relaxed">
                        “{ing.quickTake}”
                      </p>

                      <div className="mt-3 flex items-center gap-3">
                        {/* View Card Trigger */}
                        <button
                          onClick={() => {
                            onSelectIngredient(ing.id);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] cursor-pointer"
                        >
                          <span>Open Card</span>
                          <ChevronRight className="w-3.5 h-3.5 mt-0.5" />
                        </button>
                      </div>
                    </div>

                    {/* Quick Delete Heart icon and layout animation */}
                    <button
                      onClick={() => onToggleFavorite(ing.id)}
                      className="p-2 text-[#C5A059] hover:bg-rose-50 hover:text-[#C5A059] rounded-lg transition-colors cursor-pointer shrink-0 absolute top-4 right-4"
                      id={`fav_toggle_${ing.id}`}
                      title="Remove Favorite"
                    >
                      <Heart className="w-5 h-5 fill-[#C5A059]" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Elegant Bottom Navigation footer */}
        <div className="mt-12 pt-6 border-t border-stone-100/60 flex flex-col items-center gap-4 select-none">
          <div className="flex items-center justify-between w-full">
            {/* Previous Page Link with Arrow */}
            <button
              onClick={onGoBack}
              className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] transition-colors cursor-pointer"
              id="fav_footer_back"
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
              id="fav_back_to_top"
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
