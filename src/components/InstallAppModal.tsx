/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share, PlusSquare, Smartphone, CheckCircle, ArrowDown, Sparkles, Download } from 'lucide-react';

interface InstallAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InstallAppModal({ isOpen, onClose }: InstallAppModalProps) {
  const [platform, setPlatform] = useState<'ios' | 'android' | 'desktop'>('ios');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detect operating system
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(userAgent)) {
      setPlatform('ios');
    } else if (/android/.test(userAgent)) {
      setPlatform('android');
    } else {
      setPlatform('desktop');
    }

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    // Listen for native Android install prompt
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setPlatform('android');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        onClose();
      }
      setDeferredPrompt(null);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-md bg-[#FAF9F6] rounded-3xl shadow-2xl border border-stone-200 overflow-hidden text-[#1B263B]"
        >
          {/* Header Banner */}
          <div className="relative p-6 bg-[#1B263B] text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-stone-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white p-2 shadow-md flex items-center justify-center border border-amber-300/40">
                <Sparkles className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <span className="text-[10px] font-sans font-bold tracking-widest text-[#DAA89B] uppercase block">
                  Standalone Mobile App
                </span>
                <h3 className="text-xl font-serif font-bold text-white leading-tight">
                  Install Wise Bloom
                </h3>
              </div>
            </div>
            <p className="text-xs text-stone-300 font-sans mt-2.5 leading-relaxed">
              Install directly to your device home screen for lightning-fast access, full-screen view, and offline routine support.
            </p>
          </div>

          {/* Platform Selector Tabs */}
          <div className="flex border-b border-stone-200 bg-white">
            <button
              onClick={() => setPlatform('ios')}
              className={`flex-1 py-3 text-xs font-sans font-bold text-center transition-colors cursor-pointer border-b-2 ${
                platform === 'ios'
                  ? 'border-[#1B263B] text-[#1B263B]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              iPhone / iPad
            </button>
            <button
              onClick={() => setPlatform('android')}
              className={`flex-1 py-3 text-xs font-sans font-bold text-center transition-colors cursor-pointer border-b-2 ${
                platform === 'android'
                  ? 'border-[#1B263B] text-[#1B263B]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Android
            </button>
            <button
              onClick={() => setPlatform('desktop')}
              className={`flex-1 py-3 text-xs font-sans font-bold text-center transition-colors cursor-pointer border-b-2 ${
                platform === 'desktop'
                  ? 'border-[#1B263B] text-[#1B263B]'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              PC / Mac
            </button>
          </div>

          {/* Instructions Content */}
          <div className="p-6">
            {isInstalled ? (
              <div className="text-center py-6 flex flex-col items-center gap-3">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
                <h4 className="font-serif font-bold text-lg">App is Already Installed!</h4>
                <p className="text-xs text-stone-600">
                  Wise Bloom is running in standalone app mode on your home screen.
                </p>
              </div>
            ) : platform === 'ios' ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-[#1B263B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div className="text-xs leading-relaxed font-sans">
                    <span className="font-bold text-[#1B263B]">Open in Safari</span> and tap the <strong className="inline-flex items-center gap-1 text-[#1B263B] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200"><Share className="w-3.5 h-3.5" /> Share</strong> button at the bottom of your screen.
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-[#1B263B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div className="text-xs leading-relaxed font-sans">
                    Scroll down and tap <strong className="inline-flex items-center gap-1 text-[#1B263B] bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200"><PlusSquare className="w-3.5 h-3.5" /> Add to Home Screen</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-white border border-stone-200">
                  <div className="w-7 h-7 rounded-full bg-[#1B263B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div className="text-xs leading-relaxed font-sans">
                    Tap <strong className="text-[#1B263B]">Add</strong> in the top-right corner. The Wise Bloom icon will appear on your iPhone screen!
                  </div>
                </div>
              </div>
            ) : platform === 'android' ? (
              <div className="flex flex-col gap-4">
                {deferredPrompt ? (
                  <button
                    onClick={handleInstallClick}
                    className="w-full py-3.5 bg-[#1B263B] hover:bg-[#2C3E50] text-white font-sans font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Install App to Home Screen
                  </button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200 text-xs font-sans">
                      <div className="w-6 h-6 rounded-full bg-[#1B263B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        1
                      </div>
                      <div>
                        In Chrome, tap the <strong>three dots menu (⋮)</strong> in the top right.
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-2xl bg-white border border-stone-200 text-xs font-sans">
                      <div className="w-6 h-6 rounded-full bg-[#1B263B] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        2
                      </div>
                      <div>
                        Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3 text-xs font-sans text-stone-600">
                <p>
                  To install on your PC or Mac using Google Chrome or Microsoft Edge:
                </p>
                <div className="p-3 bg-white rounded-xl border border-stone-200 flex items-center gap-2">
                  <Download className="w-4 h-4 text-[#C5A059]" />
                  <span>Click the <strong>Install icon (⊕)</strong> in your browser's address bar.</span>
                </div>
              </div>
            )}

            {/* Bottom Benefit Banner */}
            <div className="mt-5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center gap-2.5 text-[11px] font-sans text-[#1B263B]">
              <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Full screen app experience with no URL bars or browser clutter.</span>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-5 py-3 text-xs font-sans font-bold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-xl transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
