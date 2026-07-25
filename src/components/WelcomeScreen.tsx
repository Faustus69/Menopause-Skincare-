/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Leaf, Camera, ShoppingBag, ChevronRight, ArrowDown } from 'lucide-react';
import { Screen } from '../types';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-full bg-[#F9F7F3] text-[#1A2622] relative overflow-hidden"
    >
      {/* Decorative background blobs to simulate watercolor */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#E2C7C1] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#C9D6C3] opacity-30 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[#E2C7C1] opacity-20 blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[#C9D6C3] opacity-30 blur-[80px] pointer-events-none"></div>

      <div className="flex-1 flex flex-col justify-center max-w-[360px] mx-auto w-full py-8 px-4 relative z-10">
        
        {/* Header */}
        <div className="mb-10 text-center flex flex-col items-center">
          <Leaf className="w-8 h-8 stroke-[1.5] text-[#556953] mb-4" />
          <h1 className="font-serif text-[36px] md:text-4xl font-medium tracking-tight leading-[1.1] text-[#1A2622] mb-3">
            The Menopause<br />Skincare Decoder
          </h1>
          <p className="font-serif italic text-[24px] text-[#CD8B80] leading-tight">
            Know Before You Buy
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3">
          
          {/* Card 1 */}
          <div className="relative">
            <div className="bg-[#F6F4EE] rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#EBE7DF] flex items-center gap-4 relative z-10">
              <div className="w-[72px] h-[72px] rounded-full bg-[#D1DEC8] flex items-center justify-center shrink-0">
                <Leaf className="w-8 h-8 stroke-[1.5] text-[#4A5D48]" />
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-[14px] uppercase tracking-[0.1em] font-bold text-[#6D8A68] mb-1">
                  MY SKIN
                </h2>
                <h3 className="font-bold text-[17px] text-[#1A2622] mb-1 leading-tight">Get reacquainted</h3>
                <p className="text-[14px] text-[#1A2622]/80 leading-snug">
                  Your skin has changed<br />Discover what it needs today
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#6D8A68] shrink-0" strokeWidth={1.5} />
            </div>
            {/* Down Arrow separator */}
            <div className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-8 h-8 bg-[#F6F4EE] rounded-full flex items-center justify-center shadow-sm border border-[#EBE7DF] z-20">
              <ArrowDown className="w-4 h-4 text-[#6D8A68]" strokeWidth={2} />
            </div>
          </div>

          <div className="h-5"></div> {/* Spacer for arrow */}

          {/* Card 2 */}
          <div className="relative">
            <div className="bg-[#FEF9F8] rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#F2E8E6] flex items-center gap-4 relative z-10">
              <div className="w-[72px] h-[72px] rounded-full bg-[#C27E77] flex items-center justify-center shrink-0">
                <Camera className="w-8 h-8 stroke-[1.5] text-white" />
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-[14px] uppercase tracking-[0.1em] font-bold text-[#C27E77] mb-1">
                  MY SCAN
                </h2>
                <h3 className="font-bold text-[17px] text-[#1A2622] mb-1 leading-tight">Decode.</h3>
                <p className="text-[14px] text-[#1A2622]/80 leading-snug">
                  Photograph an ingredients<br />list and uncover the truth—<br />not the hype
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#C27E77] shrink-0" strokeWidth={1.5} />
            </div>
            {/* Down Arrow separator */}
            <div className="absolute -bottom-[22px] left-1/2 -translate-x-1/2 w-8 h-8 bg-[#FEF9F8] rounded-full flex items-center justify-center shadow-sm border border-[#F2E8E6] z-20">
              <ArrowDown className="w-4 h-4 text-[#8C9C8A]" strokeWidth={2} />
            </div>
          </div>

          <div className="h-5"></div> {/* Spacer for arrow */}

          {/* Card 3 */}
          <div className="relative">
            <div className="bg-[#F8F9F5] rounded-[24px] p-5 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#E9EBE4] flex items-center gap-4 relative z-10">
              <div className="w-[72px] h-[72px] rounded-full bg-[#7C9075] flex items-center justify-center shrink-0">
                <ShoppingBag className="w-8 h-8 stroke-[1.5] text-white" />
              </div>
              <div className="flex-1 pt-1">
                <h2 className="text-[14px] uppercase tracking-[0.1em] font-bold text-[#7C9075] mb-1">
                  MY SHOP
                </h2>
                <h3 className="font-bold text-[17px] text-[#1A2622] mb-1 leading-tight">Trust yourself</h3>
                <p className="text-[14px] text-[#1A2622]/80 leading-snug">
                  You know what your skin<br />needs now<br />Choose with confidence
                </p>
              </div>
              <ChevronRight className="w-6 h-6 text-[#7C9075] shrink-0" strokeWidth={1.5} />
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => onNavigate('home')}
            className="w-[280px] bg-[#67795E] hover:bg-[#5A6A52] text-white py-4 px-8 rounded-full font-sans font-medium text-[15px] tracking-[0.1em] transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-3 cursor-pointer uppercase"
          >
            Let's dive in <ArrowRight className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

      </div>
    </motion.div>
  );
}

