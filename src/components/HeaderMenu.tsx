/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, X, Home, ShieldCheck, Sparkles, BookOpen, Heart, Camera, FileText, Info, Leaf
} from 'lucide-react';
import { Screen } from '../types';

interface HeaderMenuProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  hasBarrierQuizAnswers: boolean;
}

export default function HeaderMenu({ currentScreen, onNavigate, hasBarrierQuizAnswers }: HeaderMenuProps) {
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
        
        {/* Logo Block inside the Header */}
        <div 
          onClick={() => handleLinkClick('home')}
          className="flex items-center gap-2.5 cursor-pointer active:scale-98 transition-transform"
          id="global_logo_block"
        >
          {/* Logo Circle */}
          <div className="h-9 w-9 rounded-full bg-secondary font-serif flex items-center justify-center text-[13px] font-bold tracking-tight shadow-2xs shrink-0 select-none">
            <Leaf className="w-5 h-5 stroke-[1.5] text-[#556953] fill-[#556953]" />
          </div>
          {/* Logo Text Block */}
          <div className="flex flex-col select-none">
            <span className="font-serif text-sm font-bold tracking-tight text-primary leading-tight">
              Skincare Decoder
            </span>
            <span className="text-[9px] uppercase tracking-[0.18em] text-muted-foreground leading-none mt-0.5">
              Wise Bloom
            </span>
          </div>
        </div>

        {/* Favourites Shortcut + Hamburger Menu Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Heart Favourites Button from Design System (Section 9) */}
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
