/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Home, 
  HelpCircle, 
  ChevronRight, 
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Sparkle
} from 'lucide-react';
import { Screen } from '../types';

interface HowToUseScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
}

type TabId = 'philosophy' | 'step1' | 'steps2_6';

export default function HowToUseScreen({ onNavigate, onGoBack }: HowToUseScreenProps) {
  const [activeTab, setActiveTab] = useState<TabId>('philosophy');

  // Reset scroll container to top whenever active tab changes
  React.useEffect(() => {
    const container = document.querySelector('.overflow-y-auto');
    if (container) {
      container.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [activeTab]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-12 bg-[#FAF9F6] select-none"
    >
      {/* Header bar */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 font-sans">
        <div className="flex items-center gap-3">
          <button 
            onClick={onGoBack}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">How to Use</span>
        </div>
        <button 
          onClick={() => onNavigate('home')}
          className="p-1 text-[#DAA89B] hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
          title="Home"
        >
          <Home className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 max-w-xl mx-auto w-full flex-1 flex flex-col">
        {/* Intro Title */}
        <div className="text-center mb-5">
          <span className="text-[10px] text-[#C5A059] font-bold tracking-widest uppercase font-sans">
            User Guide & Methodology
          </span>
          <h2 className="text-2xl font-serif font-light text-[#1B263B] mt-1 pr-1">
            Skincare Decoder Method
          </h2>
          <div className="w-12 h-0.5 bg-[#C5A059]/40 mx-auto mt-2.5 rounded-full"></div>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-stone-150 p-1 rounded-xl mb-6 select-none font-sans text-[11px] font-bold border border-stone-200">
          {[
            { id: 'philosophy', label: '1. Skin Barrier' },
            { id: 'step1', label: '2. Step 1: Profile' },
            { id: 'steps2_6', label: '3. Steps 2-6: Routine' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 text-center py-2.5 rounded-lg transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#1B263B] text-white shadow-3xs' 
                    : 'text-stone-500 hover:text-[#1B263B]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents Area */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'philosophy' && (
              <motion.div
                key="tab_philosophy"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* The Core Explanation */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-3xs select-text">
                  <div className="flex items-start gap-4 mb-3">
                    <div className="p-2 bg-[#E2B4BD]/20 rounded-xl text-[#C5A059] shrink-0">
                      <Info className="w-5 h-5 pointer-events-none" />
                    </div>
                    <p className="text-sm text-stone-700 leading-relaxed font-sans font-medium">
                      Most skincare guides focus only on complaints such as dryness, wrinkles, dark spots, or hot flushes.
                    </p>
                  </div>
                  
                  <p className="text-sm text-stone-600 leading-relaxed font-sans mb-4 pl-11">
                    But two women with identical concerns may require completely different active ingredients.
                  </p>

                  <div className="bg-[#FAF9F6] p-4 rounded-xl border border-stone-100 pl-4 border-l-4 border-l-[#DAA89B]">
                    <span className="block text-[10px] text-[#DAA89B] font-bold uppercase tracking-wider mb-1">
                      Our Core Philosophy
                    </span>
                    <p className="text-sm font-serif italic text-[#1B263B] leading-relaxed">
                      "The missing link is barrier resilience."
                    </p>
                  </div>
                </div>

                {/* Barrier Definition */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-3xs select-text">
                  <h3 className="text-base font-serif font-semibold text-[#1B263B] mb-3">
                    What is your Skin Barrier?
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed font-sans mb-4">
                    Your skin barrier is your shield. It retains vital moisture, defends against irritants, and determines how well your skin tolerates active ingredients like Retinol or chemical exfoliants.
                  </p>
                  <p className="text-xs text-stone-500 bg-[#FAF9F6] p-4 rounded-xl border border-stone-100 leading-relaxed font-sans">
                    Declining estrogen during menopause causes skin to hold less hydration and produce fewer natural lipids, meaning a barrier can become highly compromised even if you make no changes to your products.
                  </p>
                </div>

                {/* Vehicle Concept */}
                <div className="bg-[#1B263B] text-stone-100 p-6 rounded-[24px] shadow-sm select-text">
                  <span className="text-[9px] text-[#DAA89B] font-bold tracking-widest uppercase block mb-1 font-sans">
                    Methodology Analogy
                  </span>
                  <blockquote className="text-sm font-serif text-white leading-relaxed italic mb-3">
                    “Think of your skin concern as the destination and your barrier profile as the vehicle that gets you there.”
                  </blockquote>
                  <p className="text-xs text-stone-300 leading-relaxed font-sans">
                    If you try to drive an impaired vehicle with aggressive exfoliants, your skin will irritate and flare. Understanding your barrier resilience profile tells you which background hydration baseline must come first.
                  </p>
                </div>

                {/* Transition Button to Tab 2 */}
                <button
                  onClick={() => setActiveTab('step1')}
                  className="w-full py-3.5 bg-white border border-[#E2B4BD] text-[#1B263B] font-bold font-sans rounded-xl text-xs flex items-center justify-center gap-2 tracking-wider uppercase transition-transform cursor-pointer shadow-3xs hover:text-[#C5A059]"
                >
                  <span>Step 1: Identify Your Profile</span>
                  <ArrowRight className="w-4 h-4 text-[#DAA89B]" />
                </button>
              </motion.div>
            )}

            {activeTab === 'step1' && (
              <motion.div
                key="tab_step1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* STEP 1 Card */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-3xs">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-[#C5A059]/10 text-[#C5A059] font-bold px-2 py-0.5 rounded-md font-sans">
                      Step 1
                    </span>
                    <span className="text-sm font-serif font-bold text-[#1B263B]">
                      Identify Your Barrier Profile
                    </span>
                  </div>
                  
                  <p className="text-xs text-stone-600 leading-relaxed font-sans mb-4 select-text">
                    Use our clinical diagnostical Skin Barrier Quiz to determine which of the four main profiles matches your skin today:
                  </p>

                  {/* Profile Types Grid */}
                  <div className="grid grid-cols-2 gap-2.5 mb-6 select-text">
                    {[
                      { title: 'Healthy Barrier', subtitle: 'Resilient/receptive' },
                      { title: 'Dehydrated Barrier', subtitle: 'Moisture Impaired' },
                      { title: 'Lipid Barrier', subtitle: 'Sebum Depleted' },
                      { title: 'Inflamed Barrier', subtitle: 'Reactive/Sensitized' }
                    ].map((profile) => (
                      <div key={profile.title} className="bg-[#FAF9F6] p-3 rounded-xl border border-stone-150 text-center select-none">
                        <span className="block text-xs font-bold text-[#1B263B]">{profile.title}</span>
                        <span className="block text-[10px] text-stone-400 font-sans mt-0.5">{profile.subtitle}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-xs text-stone-500 italic leading-relaxed mb-6 font-sans select-text">
                    Your barrier profile is not fixed. It changes based on hormonal fluctuations, ingredients, seasons, and environment. Re-assessing it lets you pivot your routine dynamically as your skin heals.
                  </p>

                  {/* Direct Action Selector to start Quiz */}
                  <div className="bg-[#FAF9F6] border-2 border-dashed border-[#DAA89B]/40 p-5 rounded-2xl select-none mb-1 text-center">
                    <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase block mb-1">
                      Start Your Evaluation
                    </span>
                    <h4 className="text-sm font-serif font-bold text-[#1B263B] leading-snug">
                      Ready to check your barrier resilience?
                    </h4>
                    <p className="text-[10.5px] text-stone-400 mt-1 mb-4 max-w-xs mx-auto">
                      Takes 2 minutes. Determines your essential baseline foundation actives.
                    </p>

                    <button
                      onClick={() => onNavigate('barrier_quiz')}
                      className="w-full bg-[#1B263B] hover:bg-[#253447] text-white py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 font-sans font-bold text-xs tracking-wider uppercase shadow transition-colors cursor-pointer"
                    >
                      Take the Barrier Quiz <ArrowRight className="w-4 h-4 text-[#DAA89B]" />
                    </button>
                  </div>
                </div>

                {/* Transition Button to Tab 3 */}
                <button
                  onClick={() => setActiveTab('steps2_6')}
                  className="w-full py-3.5 bg-white border border-[#E2B4BD] text-[#1B263B] font-bold font-sans rounded-xl text-xs flex items-center justify-center gap-2 tracking-wider uppercase transition-transform cursor-pointer shadow-3xs hover:text-[#C5A059]"
                >
                  <span>Steps 2-6: Complete Routine</span>
                  <ArrowRight className="w-4 h-4 text-[#DAA89B]" />
                </button>
              </motion.div>
            )}

            {activeTab === 'steps2_6' && (
              <motion.div
                key="tab_steps2_6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* STEP 2 Card */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-3xs select-text">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-[#C5A059]/10 text-[#C5A059] font-bold px-2 py-0.5 rounded-md font-sans">
                      Step 2
                    </span>
                    <span className="text-sm font-serif font-bold text-[#1B263B]">
                      Build Your Foundation
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
                    Each barrier profile recommends specific <strong className="text-[#1B263B] font-semibold">"Foundation Ingredients"</strong> (like Ceramide, Glycerin, or Centella).
                  </p>
                  <p className="text-xs text-stone-500 font-sans leading-relaxed">
                    These active ingredients calm redness, replenish barrier lipids, and trap deep moisture, preparing the skin surface so that stronger target actives can perform without trigger outbreaks.
                  </p>
                </div>

                {/* STEP 3 Card */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-3xs select-text">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs bg-[#C5A059]/10 text-[#C5A059] font-bold px-2 py-0.5 rounded-md font-sans">
                      Step 3
                    </span>
                    <span className="text-sm font-serif font-bold text-[#1B263B]">
                      Choose Your Skin Concern
                    </span>
                  </div>
                  
                  <p className="text-xs text-stone-600 leading-relaxed font-sans mb-3">
                    Once your barrier baseline is selected and added to your favorites, target your top concern:
                  </p>

                  <ul className="grid grid-cols-2 gap-2 mb-4">
                    {[
                      'Sagging & Wrinkles',
                      'Pigmentation & Spotting',
                      'Dryness & Flaking',
                      'Hormonal Breakouts & Sensitivity'
                    ].map((concern) => (
                      <li key={concern} className="bg-[#FAF9F6] p-2.5 rounded-lg border border-stone-150 text-[10.5px] font-sans font-medium text-stone-700 flex items-center gap-1.5 leading-tight">
                        <span className="w-1.5 h-1.5 bg-[#C5A059] rounded-full shrink-0"></span>
                        {concern}
                      </li>
                    ))}
                  </ul>

                  <p className="text-xs text-stone-600 leading-relaxed font-sans">
                    Selecting your concern recommend a calibrated set of active concentrates (like Vitamin C, Peptides, or Azelaic Acid) that work safely with your skin's healing speed.
                  </p>

                  <button
                    onClick={() => onNavigate('concern_list')}
                    className="w-full mt-3.5 py-3 border border-[#E2B4BD] text-[#1B263B] hover:text-[#C5A059] hover:bg-stone-50 text-xs font-bold font-sans tracking-wide rounded-xl cursor-pointer transition-colors text-center"
                  >
                    Go choose concern &rarr;
                  </button>
                </div>

                {/* Stepper Checklist Segment */}
                <div className="bg-white p-6 rounded-[24px] border border-stone-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-4.5 h-4.5 text-[#C5A059]" />
                    <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-[#C5A059]">
                      Our Decoder Methodology Map
                    </span>
                  </div>

                  {/* Stepper Grid Visualizer */}
                  <div className="relative pl-6 border-l border-[#C5A059]/35 space-y-7 ml-3 py-1 selection:bg-transparent">
                    {/* Node 1 */}
                    <div className="relative">
                      <button 
                        onClick={() => onNavigate('barrier_quiz')}
                        className="absolute -left-[35px] top-0.5 w-6 h-6 bg-[#C5A059] text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 cursor-pointer shadow-3xs"
                        title="Take Quiz"
                      >
                        1
                      </button>
                      <div onClick={() => onNavigate('barrier_quiz')} className="cursor-pointer group">
                        <span className="block text-[10px] uppercase tracking-widest font-sans font-bold text-[#DAA89B] group-hover:underline">
                          STEP 1
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1B263B] group-hover:text-[#C5A059] transition-colors leading-snug">
                          Take the Barrier Quiz
                        </span>
                      </div>
                    </div>

                    {/* Node 2 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0.5 w-6 h-6 bg-[#1B263B]/90 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center">
                        2
                      </span>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest font-sans font-bold text-[#1B263B]/40">
                          STEP 2
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1B263B]">
                          Identify Your Barrier Profile
                        </span>
                      </div>
                    </div>

                    {/* Node 3 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0.5 w-6 h-6 bg-[#1B263B]/90 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center">
                        3
                      </span>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest font-sans font-bold text-[#1B263B]/40">
                          STEP 3
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1B263B] leading-tight block">
                          Save Recommended Baseline Foundation Actives
                        </span>
                      </div>
                    </div>

                    {/* Node 4 */}
                    <div className="relative">
                      <button 
                        onClick={() => onNavigate('concern_list')}
                        className="absolute -left-[35px] top-0.5 w-6 h-6 bg-[#C5A059] text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 cursor-pointer shadow-3xs"
                        title="Select Concern"
                      >
                        4
                      </button>
                      <div onClick={() => onNavigate('concern_list')} className="cursor-pointer group">
                        <span className="block text-[10px] uppercase tracking-widest font-sans font-bold text-[#DAA89B] group-hover:underline">
                          STEP 4
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1B263B] group-hover:text-[#C5A059] transition-colors">
                          Identify Your Skin Concern
                        </span>
                      </div>
                    </div>

                    {/* Node 5 */}
                    <div className="relative">
                      <button 
                        onClick={() => onNavigate('ingredient_az')}
                        className="absolute -left-[35px] top-0.5 w-6 h-6 bg-[#C5A059] text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center hover:scale-105 transition-transform active:scale-95 cursor-pointer shadow-3xs"
                        title="Browse Directory"
                      >
                        5
                      </button>
                      <div onClick={() => onNavigate('ingredient_az')} className="cursor-pointer group">
                        <span className="block text-[10px] uppercase tracking-widest font-sans font-bold text-[#DAA89B] group-hover:underline">
                          STEP 5
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1B263B] group-hover:text-[#C5A059] transition-colors leading-tight block">
                          Browse skin concern ingredients in Directory
                        </span>
                      </div>
                    </div>

                    {/* Node 6 */}
                    <div className="relative">
                      <span className="absolute -left-[35px] top-0.5 w-6 h-6 bg-[#1B263B]/90 text-white text-[10px] font-bold font-mono rounded-full flex items-center justify-center">
                        6
                      </span>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest font-sans font-bold text-[#1B263B]/40">
                          STEP 6
                        </span>
                        <span className="text-xs font-serif font-bold text-[#1B263B]">
                          Mix-and-Match dynamically in your Favorites!
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Slogan */}
                  <div className="mt-8 pt-5 border-t border-stone-200/60 text-center text-xs font-serif italic font-bold text-[#1B263B] tracking-wide uppercase">
                    "Barrier First • Concern Second • Results Faster"
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Global Action back Home */}
        <div className="mt-8">
          <button
            onClick={() => onNavigate('home')}
            className="w-full bg-[#1B263B] hover:bg-[#253447] text-white text-xs font-bold font-sans tracking-widest uppercase py-4 rounded-xl cursor-pointer shadow-xs transition-all active:scale-[0.99] text-center"
          >
            Go back to Home dashboard
          </button>
        </div>

        {/* Elegant Bottom Navigation footer */}
        <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col items-center gap-4 select-none">
          <div className="flex items-center justify-between w-full">
            {/* Previous Page Link with Arrow */}
            <button
              onClick={onGoBack}
              className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#DAA89B]" />
              <span>Back to Previous Screen</span>
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
