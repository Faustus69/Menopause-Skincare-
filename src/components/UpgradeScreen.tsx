/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Check, Sparkles, ShieldCheck, Star, Lock, Heart, 
  FlaskConical, Camera, SunMoon, FileText, ExternalLink, HelpCircle
} from 'lucide-react';
import { Screen, UserProfile } from '../types';

interface UpgradeScreenProps {
  onGoBack: () => void;
  onNavigate: (screen: Screen) => void;
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenInstallModal?: () => void;
}

export default function UpgradeScreen({
  onGoBack,
  onNavigate,
  userProfile,
  onUpdateProfile,
  onOpenInstallModal
}: UpgradeScreenProps) {
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'annual' | 'monthly'>('lifetime');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const isAlreadyPro = userProfile.isPro;

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          origin: window.location.origin
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to initiate checkout session');
      }

      if (data.mode === 'simulation' || data.checkoutUrl?.includes('session_id=sim_')) {
        // Simulated checkout for seamless testing
        onUpdateProfile({
          isPro: true,
          planType: selectedPlan,
          purchasedAt: new Date().toISOString()
        });
        setIsSuccess(true);
      } else if (data.checkoutUrl) {
        // Live Stripe Checkout redirect
        window.location.href = data.checkoutUrl;
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err?.message || 'Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateInstantUnlock = () => {
    onUpdateProfile({
      isPro: true,
      planType: selectedPlan,
      purchasedAt: new Date().toISOString()
    });
    setIsSuccess(true);
  };

  const handleResetToFree = () => {
    onUpdateProfile({
      isPro: false,
      planType: 'free',
      purchasedAt: undefined
    });
    setIsSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35 }}
      className="flex flex-col min-h-full pb-12 bg-[#FAF9F6] text-[#1B263B]"
    >
      {/* Top Header */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-stone-200">
        <button
          onClick={onGoBack}
          className="flex items-center gap-1.5 text-xs font-sans font-bold text-stone-600 hover:text-[#1B263B] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <span className="text-xs font-serif font-bold text-[#1B263B]">
          Wise Bloom Pro
        </span>

        <div className="w-10"></div>
      </div>

      <div className="px-6 py-6 max-w-lg mx-auto w-full">
        {/* Pro Status Banner if already subscribed */}
        {isAlreadyPro ? (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1B263B] to-[#2C3E50] text-white shadow-xl mb-6 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-300 fill-amber-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold">Wise Bloom Pro Active</h2>
            <p className="text-xs text-stone-300 font-sans max-w-xs leading-relaxed">
              You have full, unrestricted access to all clinical studies, AI scanners, routine builders, and PDF export tools.
            </p>
            <div className="flex gap-2.5 mt-2">
              <button
                onClick={() => onNavigate('home')}
                className="px-5 py-2.5 bg-white text-[#1B263B] font-sans font-bold text-xs rounded-xl shadow-xs hover:bg-stone-100 transition-all cursor-pointer"
              >
                Go to Home
              </button>
              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-sans font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Install App to Phone
                </button>
              )}
            </div>
            <button
              onClick={handleResetToFree}
              className="text-[10px] text-stone-400 underline mt-2 hover:text-stone-200 cursor-pointer"
            >
              (Dev: Reset to Free status)
            </button>
          </div>
        ) : null}

        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-[#C5A059] text-[10px] font-sans font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Complete Skincare Confidence</span>
          </div>

          <h1 className="text-3xl font-serif font-bold text-[#1B263B] leading-tight">
            Unlock Full Access to <br />
            <span className="italic text-[#C5A059]">Wise Bloom Pro</span>
          </h1>

          <p className="text-xs font-sans text-stone-600 mt-2.5 leading-relaxed max-w-sm mx-auto">
            Scientifically backed skincare guidance formulated specifically for perimenopausal and menopausal skin.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="flex flex-col gap-3.5 mb-8">
          {/* Lifetime Card (Featured) */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPlan === 'lifetime'
                ? 'border-[#C5A059] bg-white shadow-lg ring-2 ring-[#C5A059]/20'
                : 'border-stone-200 bg-white/70 hover:border-stone-300'
            }`}
          >
            <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full bg-[#C5A059] text-white text-[9.5px] font-sans font-bold tracking-wider uppercase shadow-xs">
              Best Value • Pay Once
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'lifetime' ? 'border-[#C5A059] bg-[#C5A059] text-white' : 'border-stone-300'
                }`}>
                  {selectedPlan === 'lifetime' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1B263B]">
                    Lifetime Access Pass
                  </h3>
                  <span className="text-[11px] font-sans text-stone-500 block">
                    One-time payment • Never pay again
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold font-serif text-[#1B263B]">£9.99</div>
                <span className="text-[10px] text-emerald-800 font-sans font-semibold">Save 85%</span>
              </div>
            </div>
          </div>

          {/* Annual Card */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPlan === 'annual'
                ? 'border-[#1B263B] bg-white shadow-lg ring-2 ring-[#1B263B]/20'
                : 'border-stone-200 bg-white/70 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'annual' ? 'border-[#1B263B] bg-[#1B263B] text-white' : 'border-stone-300'
                }`}>
                  {selectedPlan === 'annual' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1B263B]">
                    Annual Membership
                  </h3>
                  <span className="text-[11px] font-sans text-stone-500 block">
                    Billed annually • £2.08 / month
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold font-serif text-[#1B263B]">£24.99</div>
                <span className="text-[10px] text-stone-400 font-sans">per year</span>
              </div>
            </div>
          </div>

          {/* Monthly Card */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer ${
              selectedPlan === 'monthly'
                ? 'border-[#1B263B] bg-white shadow-lg ring-2 ring-[#1B263B]/20'
                : 'border-stone-200 bg-white/70 hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                  selectedPlan === 'monthly' ? 'border-[#1B263B] bg-[#1B263B] text-white' : 'border-stone-300'
                }`}>
                  {selectedPlan === 'monthly' && <Check className="w-3 h-3" />}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1B263B]">
                    Monthly Membership
                  </h3>
                  <span className="text-[11px] font-sans text-stone-500 block">
                    Cancel anytime with 1 click
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xl font-bold font-serif text-[#1B263B]">£3.99</div>
                <span className="text-[10px] text-stone-400 font-sans">per month</span>
              </div>
            </div>
          </div>
        </div>

        {/* What You Get Checklist */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-2xs mb-8">
          <h4 className="text-xs font-sans font-bold uppercase tracking-wider text-[#1B263B] mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            What is included in Wise Bloom Pro
          </h4>

          <div className="flex flex-col gap-3 text-xs font-sans">
            <div className="flex items-start gap-3">
              <FlaskConical className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1B263B]">50+ Clinical Evidence Study Dossiers:</strong>
                <span className="text-stone-600 block mt-0.5">Direct PubMed links, peer-reviewed dermatological trials, and quantified outcome metrics for every active.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Camera className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1B263B]">AI Product Label Scanner:</strong>
                <span className="text-stone-600 block mt-0.5">Snap a photo of any bottle in Boots, SpaceNK, or Superdrug to instantly spot barrier disruptors.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <SunMoon className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1B263B]">AM/PM Skincare Layering Builder:</strong>
                <span className="text-stone-600 block mt-0.5">Custom active routine sequencer with conflict prevention (retinoids, acids, vitamin C).</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Heart className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1B263B]">Emergency Recovery Mode:</strong>
                <span className="text-stone-600 block mt-0.5">Instantly pauses strong actives when skin feels stingy, tight, or inflamed.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#1B263B]">PDF & Dermatologist Printable Reports:</strong>
                <span className="text-stone-600 block mt-0.5">Export beautiful summary printouts to show your GP or dermatologist.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-8 flex flex-col gap-3">
          <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-emerald-200/60 text-xs font-sans">
            <div className="flex items-center gap-1 text-amber-500 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="italic text-stone-700 leading-relaxed">
              "Finally, an app that actually understands menopausal skin without trying to sell me 10 useless creams. The clinical study references gave me real peace of mind."
            </p>
            <span className="block mt-2 font-bold text-[#1B263B] text-[11px]">
              — Sarah M., 52, Surrey
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-stone-200 text-xs font-sans">
            <div className="flex items-center gap-1 text-amber-500 mb-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="italic text-stone-700 leading-relaxed">
              "The ingredient scanner saved me from ruining my skin barrier with an exfoliating toner I didn't realise was too harsh for mature skin. Paid for itself immediately."
            </p>
            <span className="block mt-2 font-bold text-[#1B263B] text-[11px]">
              — Clare T., 49, Edinburgh
            </span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-sans">
            {error}
          </div>
        )}

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full py-4 bg-[#1B263B] hover:bg-[#2C3E50] text-white font-sans font-bold text-sm rounded-2xl shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <span>Connecting to Secure Checkout...</span>
          ) : (
            <>
              <Lock className="w-4 h-4 text-[#C5A059]" />
              <span>
                Get Wise Bloom Pro — {selectedPlan === 'lifetime' ? '£9.99 Once' : selectedPlan === 'annual' ? '£24.99/yr' : '£3.99/mo'}
              </span>
            </>
          )}
        </button>

        {/* Simulation / Instant Dev Unlock */}
        <div className="mt-4 pt-4 border-t border-stone-200 text-center">
          <button
            onClick={handleSimulateInstantUnlock}
            className="text-[11px] font-sans text-stone-500 hover:text-[#1B263B] underline cursor-pointer"
          >
            ⚡ Test / Demo Mode: Instantly Unlock Pro for Testing &rarr;
          </button>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-[10.5px] font-sans text-stone-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>30-Day Guarantee</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-stone-600" />
            <span>256-Bit SSL Stripe</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-700" />
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
