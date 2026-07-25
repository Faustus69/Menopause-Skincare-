/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Home, Droplet, Sparkles, Sun, ShieldCheck, Zap, HeartCrack } from 'lucide-react';
import { SKIN_CONCERNS } from '../data';
import { Screen } from '../types';

interface ConcernScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  onSelectConcern: (concernTitle: string) => void;
}

export default function ConcernScreen({ onNavigate, onGoBack, onSelectConcern }: ConcernScreenProps) {
  // Map icons to concerns for gorgeous, high-fidelity visual context
  const getConcernIcon = (id: string) => {
    switch (id) {
      case 'dryness_barrier':
        return <Droplet className="w-5 h-5 text-sky-600" />;
      case 'wrinkles_lines':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'pigmentation_brightening':
        return <Sun className="w-5 h-5 text-yellow-600" />;
      case 'loss_firmness':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'hormonal_breakouts':
        return <Zap className="w-5 h-5 text-indigo-500" />;
      case 'sensitivity_redness':
        return <HeartCrack className="w-5 h-5 text-rose-500" />;
      default:
        return <Droplet className="w-5 h-5 text-stone-500" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full"
    >
      {/* Search Header Bar with Android-like action controls */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 select-none">
        <div className="flex items-center gap-3">
          <button 
            onClick={onGoBack}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">Skin Concerns</span>
        </div>
        
        <button 
          onClick={() => onNavigate('home')}
          className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Home"
        >
          <Home className="w-5 h-5 text-[#DAA89B]" />
        </button>
      </div>

      {/* Main Lists of concerns */}
      <div className="flex-1 p-6 flex flex-col gap-5 bg-[#FAF9F6]">
        <div className="mb-2">
          <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">Focus area</span>
          <h2 className="text-xl font-bold text-[#1B263B] font-serif mt-0.5">
            What is your skin concern today?
          </h2>
          <p className="text-xs text-stone-500 mt-1 font-sans">
            Tap on any skin condition to reveal ingredients clinically proved for menopausal skin.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {SKIN_CONCERNS.map((item, index) => (
            <motion.button
              key={item.id}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.06, duration: 0.4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onSelectConcern(item.title);
                onNavigate('concern_results');
              }}
              className="w-full bg-white hover:bg-[#FAF9F6] border border-[#E2B4BD]/40 p-5 rounded-2xl flex items-start gap-4 shadow-sm transition-all text-left cursor-pointer group"
            >
              {/* Rounded soft-toned colored base for concern icon */}
              <div className="p-3 bg-[#FAF9F6] border border-stone-100 rounded-xl group-hover:bg-white transition-colors leading-none shrink-0 shadow-3xs">
                {getConcernIcon(item.id)}
              </div>
              
              <div className="flex-1 pr-2">
                <span className="block text-[15px] font-bold text-[#1B263B] font-sans group-hover:text-[#C5A059] transition-colors">
                  {item.title}
                </span>
                <span className="block text-xs text-stone-500 leading-relaxed font-sans font-medium mt-1">
                  {item.description}
                </span>
              </div>
              <span className="text-[#DAA89B] font-bold self-center text-sm font-sans pl-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
            </motion.button>
          ))}
        </div>

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
