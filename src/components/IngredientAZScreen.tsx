/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home, BookOpen, ChevronRight } from 'lucide-react';
import { INGREDIENTS_DATA } from '../data';
import { Screen } from '../types';

interface IngredientAZScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  onSelectIngredient: (ingredientId: string) => void;
}

export default function IngredientAZScreen({ onNavigate, onGoBack, onSelectIngredient }: IngredientAZScreenProps) {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  // Complete A-Z list
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  // Collect letters that actually have ingredients
  const lettersWithData = Array.from(
    new Set(INGREDIENTS_DATA.map(ing => ing.ingredient.charAt(0).toUpperCase()))
  );

  // Filter list based on selected letter
  const filteredIngredients = selectedLetter
    ? INGREDIENTS_DATA.filter(ing => ing.ingredient.charAt(0).toUpperCase() === selectedLetter)
    : INGREDIENTS_DATA; // fallback to all if null

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
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">Active Directory</span>
        </div>
        
        <button 
          onClick={() => onNavigate('home')}
          className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Home"
        >
          <Home className="w-5 h-5 text-[#DAA89B]" />
        </button>
      </div>

      {/* Main Alphabet keypad */}
      <div className="px-6 pt-6 bg-[#FAF9F6]">
        <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
          Quick-Tap Finder:
        </span>
        <h3 className="text-2xl font-serif font-light text-[#1B263B] mt-0.5">
          Browse ingredients A to Z
        </h3>
        <p className="text-xs text-stone-500 mt-1 font-sans">
          Letters with golden rings <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DAA89B]/40 border border-[#C5A059]/50 mx-0.5"></span> contain active menopausal skincare ingredients.
        </p>

        {/* The Grid layout */}
        <div className="grid grid-cols-7 gap-2 mt-4 select-none">
          {alphabet.map((letter) => {
            const hasData = lettersWithData.includes(letter);
            const isSelected = selectedLetter === letter;

            return (
              <motion.button
                key={letter}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedLetter(isSelected ? null : letter)}
                className={`py-2 text-[13px] font-bold rounded-lg border flex flex-col items-center justify-center relative cursor-pointer font-sans transition-all h-[42px] ${
                  isSelected
                    ? 'bg-[#1B263B] border-[#1B263B] text-white shadow-xs'
                    : hasData
                    ? 'bg-white border-[#C5A059] text-[#1B263B] shadow-2xs font-semibold ring-2 ring-[#DAA89B]/30'
                    : 'bg-[#FAF9F6] border-stone-200/50 text-[#9EADB2]/70 cursor-not-allowed'
                }`}
              >
                <span>{letter}</span>
                {/* Tiny indicator tag on letters with actual data if not currently selected */}
                {!isSelected && hasData && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[#C5A059]"></span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Clear filter shortcut if a letter is active */}
        {selectedLetter && (
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => setSelectedLetter(null)}
              className="text-xs font-semibold text-[#C5A059] hover:text-[#1B263B] transition-all cursor-pointer font-sans bg-white px-3 py-1 rounded-full border border-[#E2B4BD]/30 shadow-3xs"
            >
              Clear Filter (Show All) &times;
            </button>
          </div>
        )}
      </div>

      {/* Grid List under alphabet keypad */}
      <div className="px-6 mt-6 pt-5 border-t border-[#E2B4BD]/30 flex-1 bg-[#FAF9F6]">
        <h4 className="text-[10px] text-[#DAA89B] font-bold tracking-wider uppercase font-sans mb-3.5">
          {selectedLetter ? `Active Ingredients starting with "${selectedLetter}"` : 'All Available Skincare Ingredients:'}
        </h4>

        {filteredIngredients.length === 0 ? (
          <div className="bg-amber-50/50 border border-amber-200/25 p-5 rounded-xl text-center">
            <p className="text-xs text-stone-500 leading-relaxed font-sans">
              There are no ingredients registered beginning with <strong className="text-[#1B263B]">"{selectedLetter}"</strong> in Version 1.
            </p>
            <p className="text-xs text-[#C5A059] font-medium font-sans mt-2">
              Tip: Tap letters C, H, N, P, R, or V for active records.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filteredIngredients.map((ing) => (
              <motion.button
                key={ing.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onSelectIngredient(ing.id);
                  onNavigate('ingredient_detail');
                }}
                className="w-full bg-white border border-[#E2B4BD]/30 hover:border-[#1B263B]/60 p-4 rounded-xl flex items-center justify-between shadow-3xs transition-all cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#FAF9F6] rounded-lg text-[#C5A059] border border-stone-100">
                    <BookOpen className="w-4 h-4 stroke-[2]" />
                  </div>
                  <div>
                    <span className="block text-sm font-bold text-[#1B263B] font-sans group-hover:text-[#C5A059] transition-colors leading-none">
                      {ing.ingredient}
                    </span>
                    <span className="block text-[11px] text-stone-500 mt-1.5 font-sans leading-none">
                      Focus: {ing.concern.slice(0, 1).join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[#C5A059] font-bold font-sans tracking-wide bg-[#FAF9F6] border border-[#E2B4BD]/20 px-2 py-0.5 rounded-md">
                    {ing.evidenceLevel.split(' / ')[0]}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#DAA89B] group-hover:text-[#1B263B] transition-colors" />
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Elegant Bottom Navigation footer */}
        <div className="mt-8 pt-6 border-t border-stone-100/60 flex flex-col items-center gap-4 select-none pb-6">
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
    </motion.div>
  );
}
