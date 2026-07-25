/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, User, Sparkles, AlertTriangle, ShieldCheck, FileText, Sun, Moon, Info } from 'lucide-react';
import { Screen, UserProfile } from '../types';
import { INGREDIENTS_DATA } from '../data';

interface SkinProfilerScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  userProfile: UserProfile;
  onSelectIngredient: (ingId: string) => void;
}

export default function SkinProfilerScreen({ onNavigate, onGoBack, userProfile, onSelectIngredient }: SkinProfilerScreenProps) {
  
  // Step 1: Barrier Foundation (Hydrate/Soothe/Moisturise)
  let amHydrate = 'Glycerin, Panthenol or Hyaluronic Acid';
  let amMoisturise = 'Ceramides or Squalane';
  let pmRepair = 'Ceramides + Panthenol';
  let pmSeal = 'Squalane or richer moisturizer on dry areas';

  const bType = userProfile.barrierType || '';
  const isReactive = bType.includes('Inflammation Reactive');
  
  if (bType.includes('Moisture Impaired')) {
    amHydrate = 'Glycerin, Hyaluronic Acid or Niacinamide';
    amMoisturise = 'Ceramides or a lightweight lotion';
    pmRepair = 'Ceramides + Niacinamide';
    pmSeal = 'Squalane if feeling dry';
  } else if (isReactive) {
    amHydrate = 'Panthenol, Colloidal Oatmeal or Azelaic Acid';
    amMoisturise = 'Ceramides or a soothing lotion';
    pmRepair = 'Ceramides + Colloidal Oatmeal';
    pmSeal = 'Squalane or a soothing balm';
  } else if (bType.includes('Lipid Depleted')) {
    amHydrate = 'Glycerin or Panthenol';
    amMoisturise = 'Ceramides, Cholesterol or Fatty Acids';
    pmRepair = 'Ceramides + Squalane';
    pmSeal = 'Petrolatum or richer creams for overnight recovery';
  }

  // Step 2: Treatment Options
  const getAmTreatments = () => {
    const opts = new Set<string>();
    userProfile.concerns.forEach(c => {
      if (c.includes('Sagging')) { opts.add('Vitamin C'); opts.add('Peptides'); }
      if (c.includes('Pigmentation')) { opts.add('Vitamin C'); opts.add('TXA'); opts.add('Niacinamide'); }
      if (c.includes('Breakouts')) { opts.add('Niacinamide'); opts.add('Zinc PCA'); opts.add('Azelaic Acid'); }
      if (c.includes('Dryness')) { opts.add('Panthenol'); opts.add('Glycerin'); }
      if (c.includes('Redness')) { opts.add('Panthenol'); opts.add('Azelaic Acid'); }
    });
    return Array.from(opts).slice(0, 3).join(' • ') || 'Vitamin C • Peptides';
  };

  const getPmTreatments = () => {
    const opts = new Set<string>();
    userProfile.concerns.forEach(c => {
      if (c.includes('Sagging')) { opts.add('Retinol'); opts.add('Retinal'); opts.add('Peptides'); }
      if (c.includes('Pigmentation')) { opts.add('TXA'); opts.add('Azelaic Acid'); opts.add('Alpha Arbutin'); }
      if (c.includes('Breakouts')) { opts.add('Salicylic Acid'); opts.add('Azelaic Acid'); opts.add('Sulfur'); }
      if (c.includes('Dryness')) { opts.add('Ceramides'); opts.add('Squalane'); }
      if (c.includes('Redness')) { opts.add('Ceramides'); opts.add('Panthenol'); }
    });
    return Array.from(opts).slice(0, 3).join(' or ') || 'Retinal or Retinol';
  };

  const amTreatmentsStr = getAmTreatments();
  const pmTreatmentsStr = getPmTreatments();

  // Export Summary
  const exportSummary = () => {
    let summary = `My Personalized Skincare Routine\n`;
    summary += `================================\n\n`;
    summary += `Based on your barrier type and today's skin concerns, here is your suggested routine.\n\n`;
    
    summary += `Barrier Type: ${userProfile.barrierType || 'Not Assessed'}\n`;
    summary += `Today's Concerns: ${userProfile.concerns.join(' + ') || 'None'}\n\n`;

    summary += `AM Routine:\n`;
    summary += `-----------\n`;
    summary += `Step 1 — Cleanse gently or rinse\n`;
    summary += `Avoid stripping cleansers.\n\n`;
    summary += `Step 2 — Hydrate\n`;
    summary += `Look for: ${amHydrate}\n\n`;
    summary += `Step 3 — Treat\n`;
    summary += `Look for: ${amTreatmentsStr}\n\n`;
    summary += `Step 4 — Barrier moisturiser\n`;
    summary += `Look for: ${amMoisturise}\n\n`;
    summary += `Step 5 — SPF\n`;
    summary += `Sunscreen is always your final step.\n\n`;

    summary += `PM Routine:\n`;
    summary += `-----------\n`;
    summary += `Step 1 — Cleanse\n`;
    summary += `Remove makeup and SPF.\n\n`;
    summary += `Step 2 — Treatment, 2–3 nights weekly\n`;
    summary += `Use: ${pmTreatmentsStr}\n\n`;
    summary += `Step 3 — Repair\n`;
    summary += `Use: ${pmRepair}\n\n`;
    summary += `Step 4 — Seal if dry\n`;
    summary += `Use: ${pmSeal}\n\n`;

    summary += `Use With Care:\n`;
    summary += `Only use one strong active at a time. Avoid layering retinoids with exfoliating acids in the same routine, especially if your skin is dry, sensitive, or reactive.\n\n`;

    summary += `Layering Tip:\n`;
    summary += `Apply products from lightest to richest. Start with hydrating or soothing serums, then treatment ingredients, then moisturiser, then oils or balms if needed.\n\n`;

    if (isReactive) {
      summary += `Recovery Mode Activated:\n`;
      summary += `Your skin sounds reactive today. Pause retinoids, acids and strong brighteners for 48–72 hours. Focus on Panthenol, Ceramides, Glycerin, Colloidal Oatmeal and Squalane.\n`;
    }

    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'My_Skincare_Routine.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex flex-col min-h-full pb-8 bg-[#FAF9F6]"
    >
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <button onClick={onGoBack} className="p-1 text-stone-300 hover:text-white rounded-full">
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-lg text-white tracking-wide">My Skin Profile</span>
        </div>
        <button 
          onClick={exportSummary}
          className="p-2 text-stone-300 hover:text-white rounded-full transition-colors flex items-center gap-2"
          title="Export Summary"
        >
          <FileText className="w-5 h-5 text-[#DAA89B]" />
        </button>
      </div>

      <div className="p-6">
        
        {/* Profile Overview */}
        <div className="bg-white rounded-2xl p-5 border border-[#E2B4BD]/40 shadow-sm mb-8 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-[#E2B4BD]/10 rounded-full blur-xl"></div>
          <h2 className="text-xl font-serif text-[#1B263B] mb-4">Your Profile</h2>
          
          <div className="flex items-start gap-3 mb-3">
            <ShieldCheck className="w-4 h-4 text-[#C5A059] mt-0.5" />
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Barrier Type</span>
              <span className="text-sm font-semibold text-[#1B263B]">{userProfile.barrierType || 'Not Assessed Yet'}</span>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#C5A059] mt-0.5" />
            <div>
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">Today's Concerns</span>
              <span className="text-sm font-semibold text-[#1B263B]">
                {userProfile.concerns.length > 0 ? userProfile.concerns.join(' + ') : 'None selected'}
              </span>
            </div>
          </div>
        </div>

        {/* Recovery Mode Alert */}
        {isReactive && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 mb-8 shadow-sm">
            <h3 className="font-bold text-rose-800 uppercase tracking-wider text-xs mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Recovery Mode Activated
            </h3>
            <p className="text-sm text-rose-700/90 leading-relaxed font-sans">
              Your skin sounds reactive today. Pause retinoids, acids and strong brighteners for 48–72 hours. Focus on Panthenol, Ceramides, Glycerin, Colloidal Oatmeal and Squalane.
            </p>
          </div>
        )}

        {/* AM Routine */}
        <div className="mb-8">
          <h3 className="font-bold text-[#1B263B] uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4 text-[#C5A059]" />
            Your AM Routine
          </h3>
          <div className="space-y-3">
            <RoutineStep step="Step 1" title="Cleanse gently or rinse" subtitle="Avoid stripping cleansers." />
            <RoutineStep step="Step 2" title="Hydrate" subtitle={<>Look for: <span className="font-semibold text-[#1B263B]">{amHydrate}</span></>} />
            <RoutineStep step="Step 3" title="Treat" subtitle={<>Look for: <span className="font-semibold text-[#1B263B]">{amTreatmentsStr}</span></>} />
            <RoutineStep step="Step 4" title="Barrier moisturiser" subtitle={<>Look for: <span className="font-semibold text-[#1B263B]">{amMoisturise}</span></>} />
            <RoutineStep step="Step 5" title="SPF" subtitle="Always goes last." />
          </div>
        </div>

        {/* PM Routine */}
        <div className="mb-8">
          <h3 className="font-bold text-[#1B263B] uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
            <Moon className="w-4 h-4 text-indigo-400" />
            Your PM Routine
          </h3>
          <div className="space-y-3">
            <RoutineStep step="Step 1" title="Cleanse" subtitle="Remove makeup and SPF." />
            <RoutineStep step="Step 2" title="Treatment, 2–3 nights weekly" subtitle={<>Use: <span className="font-semibold text-[#1B263B]">{pmTreatmentsStr}</span></>} highlight />
            <RoutineStep step="Step 3" title="Repair" subtitle={<>Use: <span className="font-semibold text-[#1B263B]">{pmRepair}</span></>} />
            <RoutineStep step="Step 4" title="Seal if dry" subtitle={<>Use: <span className="font-semibold text-[#1B263B]">{pmSeal}</span></>} />
          </div>
        </div>

        {/* Tips */}
        <div className="bg-[#1B263B]/5 rounded-2xl p-5 border border-[#1B263B]/10">
          <div className="flex gap-3 mb-4">
            <Info className="w-5 h-5 text-[#C5A059] shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#1B263B] mb-1">Layering Rule</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Apply products from lightest to richest. Start with hydrating or soothing serums, then treatment ingredients, then moisturiser, then oils or balms if needed. In the morning, SPF always goes last.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-[#1B263B] mb-1">Use With Care</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Use only one strong active at a time. Avoid layering retinoids with exfoliating acids in the same routine, especially if your skin is dry, sensitive, or reactive.
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}

function RoutineStep({ step, title, subtitle, highlight }: { step: string, title: string, subtitle: React.ReactNode, highlight?: boolean }) {
  return (
    <div className={`bg-white p-4 rounded-xl border shadow-sm flex items-start gap-4 ${highlight ? 'border-[#C5A059]/50' : 'border-stone-200'}`}>
      <div className="shrink-0 pt-0.5">
        <span className="text-[10px] font-bold uppercase tracking-widest text-[#DAA89B]">{step}</span>
      </div>
      <div>
        <h4 className="text-sm font-bold text-[#1B263B]">{title}</h4>
        <p className="text-xs text-stone-500 mt-1 font-sans">{subtitle}</p>
      </div>
    </div>
  );
}
