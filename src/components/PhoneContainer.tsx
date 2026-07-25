/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Wifi, Battery, Signal } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  screen?: string;
}

export default function PhoneContainer({ children, screen }: PhoneContainerProps) {
  const [time, setTime] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // safety for 0
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Set inner container scroll position to top whenever active screen changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
    window.scrollTo({ top: 0, behavior: 'instant' as any });
  }, [screen]);

  return (
    <div className="min-h-screen w-full bg-stone-100 flex items-center justify-center py-6 px-4 md:py-10">
      {/* Outer Phone Shell (Only styled as physical phone on medium and up screens) */}
      <div 
        id="android_phone_container"
        className="w-full max-w-full md:max-w-[412px] md:h-[840px] bg-[hsl(var(--background))] md:rounded-[40px] md:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] md:border-[12px] md:border-[hsl(var(--primary))] relative flex flex-col overflow-hidden select-none"
      >
        {/* Physical Camera Notch Pin on top border for desktop */}
        <div className="hidden md:block absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-[hsl(var(--primary))] rounded-b-xl z-50">
          <div className="w-2.5 h-2.5 bg-[#141C2B] rounded-full mx-auto mt-0.5 border border-neutral-700/60 font-sans"></div>
        </div>

        {/* Android system top status bar */}
        <div 
          id="android_status_bar"
          className="bg-[hsl(var(--primary))] text-stone-200 px-6 pt-3 pb-2 flex justify-between items-center text-xs font-mono tracking-wider z-20 shrink-0 select-none"
        >
          {/* Active Time */}
          <span className="font-semibold text-[11px] font-sans text-stone-100">{time || '12:00 PM'}</span>
          
          {/* Punch hole container padding on mobile to clear header if needed */}
          <div className="w-4 h-4 rounded-full bg-transparent md:hidden"></div>

          {/* System Icons */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <Signal className="w-3.5 h-3.5 stroke-[2]" />
            <Wifi className="w-3.5 h-3.5 stroke-[2]" />
            <div className="flex items-center gap-0.5">
              <span className="text-[9px] font-sans font-medium text-stone-300">92%</span>
              <Battery className="w-3.5 h-3.5 stroke-[2] fill-stone-100" />
            </div>
          </div>
        </div>

        {/* Dynamic inner screen contents */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto overflow-x-hidden bg-[hsl(var(--background))] text-[hsl(var(--foreground))] flex flex-col relative select-text"
        >
          <div className="flex-1 flex flex-col">
            {children}
          </div>

          {/* Elegant Footer with contact email */}
          {screen !== 'welcome' && (
            <footer className="mt-8 py-10 px-6 bg-[hsl(var(--cream))] border-t border-[hsl(var(--border))]/60 text-center flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] text-[hsl(var(--muted-foreground))] uppercase tracking-[0.18em] font-sans font-bold">
                Wise Bloom Skincare Decoder
              </span>
              <div className="mt-3 flex flex-col items-center gap-1">
                <a 
                  href="mailto:contact@wisebloom.co.uk" 
                  className="text-sm font-serif font-semibold text-[hsl(var(--primary))] hover:text-[hsl(var(--accent))] transition-colors underline decoration-dotted underline-offset-4 cursor-pointer"
                >
                  Contact Us
                </a>
                <span className="text-xs text-[hsl(var(--muted-foreground))] font-sans mt-0.5 font-medium select-all">
                  contact@wisebloom.co.uk
                </span>
              </div>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))]/70 mt-4 leading-relaxed max-w-xs font-sans">
                Dedicated to helping midlife women decode active ingredients with clinical confidence.
              </p>
            </footer>
          )}
        </div>

        {/* Android Native Home Bar Handle (Simulated bottom navigation pill on desktop) */}
        <div className="hidden md:flex justify-center items-center py-3 bg-[hsl(var(--background))] border-t border-[hsl(var(--border))]/40 z-20 shrink-0">
          <div className="w-28 h-1 bg-[hsl(var(--primary))]/30 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
