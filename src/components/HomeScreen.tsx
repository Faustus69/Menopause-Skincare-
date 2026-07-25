/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, BookOpen, Search, ArrowRight, ArrowLeft, HelpCircle, Heart, Camera } from 'lucide-react';
import { Screen } from '../types';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col min-h-full px-6 py-8 justify-between relative overflow-hidden bg-[#F9F7F3]"
    >
      {/* Decorative background blobs to simulate watercolor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#E2C7C1] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9D6C3] opacity-30 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#E2C7C1] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#C9D6C3] opacity-30 blur-[80px] pointer-events-none"></div>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center py-6 text-center select-none z-10 relative">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="flex justify-center mb-4"
        >
          <div className="inline-flex p-3 bg-stone-50 border border-amber-200/50 rounded-full shadow-sm text-[#556953]">
            <Sparkles className="w-8 h-8 stroke-[1.5]" />
          </div>
        </motion.div>

        <h1 
          id="app_home_title"
          className="text-4xl font-serif font-medium tracking-tight text-[#1A2622] leading-tight mt-1"
        >
          The Menopause <br />
          <span className="text-[#6D8A68] italic text-4xl block mt-1">Skincare Decoder</span>
        </h1>
        
        <p className="text-xs font-bold text-[#CD8B80] mt-3.5 uppercase tracking-widest font-sans">
          Understand ingredients with confidence
        </p>

        {/* Decorative divider line */}
        <div className="w-16 h-[2px] bg-[#6D8A68]/40 mx-auto mt-6 mb-8 rounded-full"></div>

        {/* Options buttons */}
        <div className="flex flex-col gap-4 max-w-sm mx-auto w-full">
          {/* Action Button 1: How to use */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('how_to_use')}
            id="home_btn_how_to_use"
            className="w-full bg-[#F9F7F3] hover:bg-[#F0EEEA] p-5 rounded-2xl flex items-center justify-between shadow-sm border-[3px] border-[#CD8B80] transition-colors cursor-pointer group text-left relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border-2 border-[#CD8B80] rounded-xl text-black">
                <HelpCircle className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[15px] font-bold text-[#6D8A68] font-sans">
                  How to Use the Skincare Decoder
                </span>
                <span className="block text-xs text-[#1A2622]/60 font-sans mt-0.5 font-light">
                  Understand the 3-step midlife barrier method
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6D8A68] transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Action Button: Smart Label Decoder */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('product_analyzer')}
            id="home_btn_product_analyzer"
            className="w-full bg-[#F9F7F3] hover:bg-[#F0EEEA] p-5 rounded-2xl flex items-center justify-between shadow-sm border-[3px] border-[#CD8B80] transition-colors cursor-pointer group text-left relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border-2 border-[#CD8B80] rounded-xl text-black">
                <Camera className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[15px] font-bold text-[#6D8A68] font-sans flex items-center gap-2">
                  <span>Scan & Decode Labels</span>
                  <span className="px-1.5 py-0.5 bg-[#C5A059] text-white rounded text-[8px] font-bold tracking-wider font-sans uppercase animate-pulse">AI</span>
                </span>
                <span className="block text-xs text-[#1A2622]/60 font-sans mt-0.5 font-light">
                  Snap or upload a photo of ingredients
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6D8A68] transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Action Button 2: Skin Concern */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('concern_list')}
            id="home_btn_concern"
            className="w-full bg-[#F9F7F3] hover:bg-[#F0EEEA] p-5 rounded-2xl flex items-center justify-between shadow-sm border-[3px] border-[#CD8B80] transition-colors cursor-pointer group text-left relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border-2 border-[#CD8B80] rounded-xl text-black">
                <Search className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[15px] font-bold text-[#6D8A68] font-sans">
                  Search by Skin Concern
                </span>
                <span className="block text-xs text-[#1A2622]/60 font-sans mt-0.5 font-light">
                  Dryness, wrinkles, redness & more
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6D8A68] transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Action Button 3: Ingredient A-Z */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('ingredient_az')}
            id="home_btn_az"
            className="w-full bg-[#F9F7F3] hover:bg-[#F0EEEA] p-5 rounded-2xl flex items-center justify-between shadow-sm border-[3px] border-[#CD8B80] transition-colors cursor-pointer group text-left relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border-2 border-[#CD8B80] rounded-xl text-black">
                <BookOpen className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[15px] font-bold text-[#6D8A68] font-sans">
                  Search by Ingredients A–Z
                </span>
                <span className="block text-xs text-[#1A2622]/60 font-sans mt-0.5 font-light">
                  Browse active ingredients list
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6D8A68] transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Action Button 4: Favorites */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('favorites')}
            id="home_btn_favorites"
            className="w-full bg-[#F9F7F3] hover:bg-[#F0EEEA] p-5 rounded-2xl flex items-center justify-between shadow-sm border-[3px] border-[#CD8B80] transition-colors cursor-pointer group text-left relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border-2 border-[#CD8B80] rounded-xl text-black">
                <Heart className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[15px] font-bold text-[#6D8A68] font-sans">
                  My Saved Ingredients
                </span>
                <span className="block text-xs text-[#1A2622]/60 font-sans mt-0.5 font-light">
                  View bookmarked ingredients & tips
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6D8A68] transition-transform group-hover:translate-x-1" />
          </motion.button>

          {/* Action Button 0: Skin Profiler */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('skin_profiler')}
            id="home_btn_skin_profiler"
            className="w-full bg-[#F9F7F3] hover:bg-[#F0EEEA] p-5 rounded-2xl flex items-center justify-between shadow-sm border-[3px] border-[#CD8B80] transition-colors cursor-pointer group text-left relative z-10"
          >
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-white border-2 border-[#CD8B80] rounded-xl text-black">
                <Sparkles className="w-5.5 h-5.5 stroke-[2]" />
              </div>
              <div>
                <span className="block text-[15px] font-bold text-[#6D8A68] font-sans">
                  My Skin Profiler
                </span>
                <span className="block text-xs text-[#1A2622]/60 font-sans mt-0.5 font-light">
                  Build your custom routine
                </span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-[#6D8A68] transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>
      </div>

      {/* Gentle educational safety disclaimer (Bottom of home screen only) */}
      <div 
        id="home_disclaimer_note"
        className="mt-6 p-4 bg-white/60 rounded-2xl border border-[#EBE7DF] text-center z-10 shadow-3xs relative"
      >
        <p className="text-[10px] text-[#1A2622]/60 leading-relaxed font-sans">
          This guide is for skincare education only. Patch test new products and seek professional advice for diagnosed skin conditions.
        </p>
      </div>

      {/* Previous Page Button */}
      <div className="mt-6 flex justify-center z-10 relative pb-2">
        <button
          onClick={() => onNavigate('welcome')}
          className="inline-flex items-center gap-2 text-[#6D8A68] hover:text-[#556953] transition-colors py-2 px-4 rounded-full hover:bg-black/5 font-sans font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Previous Page
        </button>
      </div>
    </motion.div>
  );
}

