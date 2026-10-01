/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Home, ShieldCheck, Sparkles, BookOpen, Heart, Camera, FileText, Info, Leaf, SunMoon, ChevronLeft,
  Smartphone, Star, Download
} from 'lucide-react';
import { Screen } from '../types';

interface HeaderMenuProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onGoBack?: () => void;
  hasBarrierQuizAnswers: boolean;
  isPro?: boolean;
  onOpenInstallModal?: () => void;
}

export default function HeaderMenu({ 
  currentScreen, 
  onNavigate, 
  onGoBack, 
  hasBarrierQuizAnswers,
  isPro = false,
  onOpenInstallModal
}: HeaderMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  // High-level navigation links defined under the Design System guideline
  const navItems = [
    { 
      id: 'welcome', 
      label: 'Welcome', 
      screen: 'welcome' as Screen, 
      icon: Info,
      isActive: currentScreen === 'welcome'
    },
    { 
      id: 'home', 
      label: 'Home', 
      screen: 'home' as Screen, 
      icon: Home,
      isActive: currentScreen === 'home'
    },
    { 
      id: 'barriers', 
      label: 'Skin Barriers', 
      screen: 'barrier_quiz' as Screen, // Point 2: Always goes to the main quiz/barrier page, not the last results
      icon: ShieldCheck,
      isActive: ['barrier_quiz', 'barrier_results'].includes(currentScreen)
    },
    { 
      id: 'concerns', 
      label: 'Skin Concerns', 
      screen: 'concern_list' as Screen, 
      icon: Sparkles,
      isActive: ['concern_list', 'concern_results'].includes(currentScreen)
    },
    { 
      id: 'az', 
      label: 'A-Z Ingredients', 
      screen: 'ingredient_az' as Screen, 
      icon: BookOpen,
      isActive: ['ingredient_az', 'ingredient_detail'].includes(currentScreen)
    },
    { 
      id: 'favorites', 
      label: 'Favourites', 
      screen: 'favorites' as Screen, 
      icon: Heart,
      isActive: currentScreen === 'favorites'
    },
    { 
      id: 'routine_builder', 
      label: 'Routine Builder', 
      screen: 'routine_builder' as Screen, 
      icon: SunMoon,
      isActive: currentScreen === 'routine_builder'
    },
    
    { 
      id: 'saved_scans', 
      label: 'Saved Scans', 
      screen: 'saved_scans' as Screen, 
      icon: FileText,
      isActive: currentScreen === 'saved_scans'
    },
    {
      id: 'scanner', 
      label: 'Scanner', 
      screen: 'product_analyzer' as Screen, 
      icon: Camera,
      isActive: currentScreen === 'product_analyzer'
    },
    { 
      id: 'notes', 
      label: 'Notes', 
      screen: 'notes' as Screen, 
      icon: FileText,
      isActive: currentScreen === 'notes'
    },
  ];

  const handleLinkClick = (screen: Screen) => {
    onNavigate(screen);
    setIsOpen(false);
  };

  return (
    <div 
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border/60 shrink-0"
      id="global_header_wrapper"
    >
      <div className="h-16 px-4 flex items-center justify-between select-none">
        
        {/* Left Side: Small back link with < + Brand Logo */}
        <div className="flex items-center gap-2">
          {/* Back button on all pages except welcome - enlarged for mobile readability */}
          <button
            onClick={onGoBack || (() => onNavigate('home'))}
            className="flex items-center gap-1 text-primary hover:text-primary/80 active:scale-95 transition-all px-3.5 py-2 -ml-1 rounded-xl cursor-pointer font-sans text-base font-bold bg-secondary/90 hover:bg-secondary border border-border/60 shadow-2xs"
            title="Go Back"
            id="global_top_back_link"
          >
            <ChevronLeft className="w-6 h-6 stroke-[3]" />
            <span className="text-sm sm:text-base font-bold tracking-tight">Back</span>
          </button>

          {/* Logo Block inside the Header */}
          <div 
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2 cursor-pointer active:scale-98 transition-transform"
            id="global_logo_block"
          >
            {/* Logo Circle */}
            <div className="h-8 w-8 rounded-full bg-secondary font-serif flex items-center justify-center text-[13px] font-bold tracking-tight shadow-2xs shrink-0 select-none">
              <Leaf className="w-4 h-4 stroke-[1.5] text-[#556953] fill-[#556953]" />
            </div>
            {/* Logo Text Block */}
            <div className="flex flex-col select-none hidden xs:flex">
              <span className="font-serif text-xs font-bold tracking-tight text-primary leading-tight">
                Skincare Decoder
              </span>
              <span className="text-[8px] uppercase tracking-[0.18em] text-muted-foreground leading-none mt-0.5">
                Wise Bloom
              </span>
            </div>
          </div>
        </div>

        {/* Favourites Shortcut + Pro Badge + Hamburger Menu Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Pro Status or Upgrade Button */}
          {isPro ? (
            <div 
              onClick={() => handleLinkClick('upgrade')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs cursor-pointer hover:bg-amber-200 transition-colors"
              title="Wise Bloom Pro Member"
            >
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Pro</span>
            </div>
          ) : (
            <button
              onClick={() => handleLinkClick('upgrade')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#1B263B] text-white hover:bg-[#2C3E50] shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Upgrade to Pro"
            >
              <Sparkles className="w-3 h-3 text-[#C5A059]" />
              <span className="text-[10px] font-sans font-bold uppercase tracking-wider">Pro £9.99</span>
            </button>
          )}

          {/* Quick Heart Favourites Button from Design System (Section 9) - hidden on ingredient_az */}
          {currentScreen !== 'ingredient_az' && (
            <button
              onClick={() => handleLinkClick('favorites')}
              className={`p-2 rounded-full transition-all duration-300 active:scale-90 cursor-pointer ${
                currentScreen === 'favorites'
                  ? 'bg-primary text-white'
                  : 'bg-secondary text-primary hover:bg-primary/10'
              }`}
              title="View Saved Favourites"
            >
              <Heart className={`w-4 h-4 ${currentScreen === 'favorites' ? 'fill-white' : ''}`} />
            </button>
          )}

          {/* Hamburger Trigger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="h-9 w-9 rounded-full bg-secondary text-primary flex items-center justify-center hover:bg-secondary-foreground/10 active:scale-95 transition-all cursor-pointer shadow-3xs"
            id="mobile_hamburger_trigger"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden border-t border-border/40 bg-background"
            id="mobile_menu_panel"
          >
            <div className="px-4 py-3 pb-5 flex flex-col gap-1.5 bg-background shadow-lg">
              
              {/* Pro Membership Banner */}
              <div 
                onClick={() => handleLinkClick('upgrade')}
                className={`p-3 rounded-2xl mb-2 flex items-center justify-between cursor-pointer transition-all ${
                  isPro 
                    ? 'bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-300' 
                    : 'bg-[#1B263B] text-white hover:bg-[#2C3E50]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isPro ? 'bg-amber-400/30 text-amber-700' : 'bg-white/10 text-[#C5A059]'
                  }`}>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <span className={`text-xs font-serif font-bold block ${isPro ? 'text-amber-950' : 'text-white'}`}>
                      {isPro ? 'Wise Bloom Pro Member ★' : 'Unlock Wise Bloom Pro'}
                    </span>
                    <span className={`text-[10px] font-sans ${isPro ? 'text-amber-800' : 'text-stone-300'}`}>
                      {isPro ? 'Full clinical studies & scanner active' : 'Lifetime pass £9.99 • No subscriptions'}
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-sans font-bold px-2.5 py-1 rounded-lg ${
                  isPro ? 'bg-white text-amber-900 border border-amber-200' : 'bg-[#C5A059] text-white'
                }`}>
                  {isPro ? 'Manage' : 'Get Pass'}
                </span>
              </div>

              {/* Install App button if mobile / standalone prompt available */}
              {onOpenInstallModal && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenInstallModal();
                  }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-[#1B263B] text-xs font-sans font-bold transition-all mb-1 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Download className="w-4 h-4 text-[#C5A059]" />
                    <span>Install App to Home Screen</span>
                  </div>
                  <span className="text-[10px] text-stone-500 uppercase tracking-wider">Free</span>
                </button>
              )}

              <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground font-sans font-bold px-3 mb-1 select-none">
                Navigation
              </span>
              
              {navItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.screen)}
                    className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-left text-sm font-medium transition-all cursor-pointer active:scale-98 ${
                      item.isActive
                        ? 'bg-secondary text-primary border-l-3 border-primary font-bold shadow-3xs'
                        : 'text-foreground hover:bg-secondary/40 hover:text-primary'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${item.isActive ? 'text-primary stroke-[2.2]' : 'text-muted-foreground'}`} />
                    <span className="font-sans text-[13px]">{item.label}</span>
                  </button>
                );
              })}
            
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
