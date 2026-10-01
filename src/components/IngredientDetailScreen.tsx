/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Home, Award, Scale, HelpCircle, Heart, 
  Sparkles, CheckCircle2, AlertTriangle, XOctagon, UserCheck,
  Beaker, Lightbulb, FlaskConical, ExternalLink, BookOpen, ChevronDown, ChevronUp, GraduationCap
} from 'lucide-react';
import { INGREDIENTS_DATA } from '../data';
import { Screen, IngredientRecord } from '../types';
import { getClinicalEvidence } from '../clinicalEvidence';

interface IngredientDetailScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  favorites?: string[];
  onToggleFavorite?: (id: string) => void;
  selectedIngredientId: string;
}

export default function IngredientDetailScreen({ 
  onNavigate, 
  onGoBack,
  favorites = [],
  onToggleFavorite,
  selectedIngredientId 
}: IngredientDetailScreenProps) {
  // Find correct ingredient
  const ingredient: IngredientRecord | undefined = INGREDIENTS_DATA.find(
    ing => ing.id === selectedIngredientId
  );

  const isFavorited = favorites.includes(selectedIngredientId);
  const [showAdditionalStudies, setShowAdditionalStudies] = useState(false);
  const clinicalEvidence = ingredient ? getClinicalEvidence(ingredient.id, ingredient) : null;

  if (!ingredient) {
    return (
      <div className="p-6 text-center">
        <h3 className="text-lg font-bold text-red-500 font-sans">Error</h3>
        <p className="text-xs text-stone-500 mt-2 font-sans font-medium">Ingredient details not found.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="mt-4 px-4 py-2 bg-[#1E2A38] text-white rounded-lg text-xs cursor-pointer font-sans"
        >
          Return Home
        </button>
      </div>
    );
  }

  let boxCount = 0;
  const getBoxStyle = () => {
    const isGreen = boxCount % 2 === 0;
    boxCount++;
    return isGreen 
      ? "bg-[#F4FAF7] border-2 border-black rounded-[20px] p-5 shadow-sm select-text" 
      : "bg-[#FCFBF9] border-2 border-black rounded-[20px] p-5 shadow-sm select-text";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-10"
    >
      {/* Header element */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 select-none font-sans">
        <div className="flex items-center">
          <span className="font-serif font-semibold text-base tracking-wide text-white">Decoder Card</span>
        </div>
      </div>

      <div className="p-6 bg-[#FAF9F6]">
        {/* Ingredient Header Label */}
        <div className="mb-6 select-text flex justify-between items-start gap-4">
          <div className="flex-1">
            <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
              Active Compound Analysis
            </span>
            <h2 className="text-3xl font-serif font-light text-[#1B263B] mt-0.5 min-w-0 break-words">
              {ingredient.ingredient}
            </h2>
            <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 bg-[#E2B4BD]/20 rounded-full border border-[#E2B4BD]/35 text-xs text-[#1B263B] font-sans font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]"></span>
              Stage: {ingredient.stage}
            </div>
          </div>
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(ingredient.id)}
              className="px-3 py-2 bg-white hover:bg-stone-50 border border-stone-200/60 shadow-xs rounded-2xl cursor-pointer text-[#C5A059] transition-transform active:scale-95 flex flex-col items-center justify-center gap-0.5 shrink-0 self-start"
              id="detail_fav_btn"
              title={isFavorited ? "Remove from Favorites" : "Save to Favorites"}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-400'}`} />
              <span className={`text-[10px] font-sans font-bold leading-none ${isFavorited ? 'text-[#C5A059]' : 'text-stone-500'}`}>
                {isFavorited ? 'Saved' : 'Save'}
              </span>
            </button>
          )}
        </div>

        {/* Layout with even spacing using flex/gap */}
        <div className="flex flex-col gap-5 select-text">
          {/* 1. Quick Take Highlight Box */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-black shrink-0" />
              <span>Quick Take</span>
            </div>
            <p className="text-sm font-sans text-black font-bold leading-relaxed italic">
              “{ingredient.quickTake}”
            </p>
          </div>

          {/* 2. Verdict Box (Worth the Spend / Save) */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <Scale className="w-5 h-5 text-black shrink-0" />
              <span>Shopping Verdict</span>
            </div>
            <p className="text-sm font-sans text-black font-bold leading-relaxed">
              {ingredient.worthTheSpend}
            </p>
            {ingredient.worthTheSpendDetail && (
              <p className="text-sm font-sans text-black font-bold leading-relaxed mt-2 border-t border-black/10 pt-2">
                {ingredient.worthTheSpendDetail}
              </p>
            )}
          </div>

          {/* 3. Clinical Effectiveness Range Card */}
          {ingredient.effectivenessRange && (
            <div className={getBoxStyle()}>
              <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
                <Beaker className="w-5 h-5 text-black shrink-0" />
                <span>Clinical Effectiveness Range</span>
              </div>
              <p className="text-sm font-sans text-black font-bold leading-relaxed">
                {ingredient.effectivenessRange}
              </p>
              <p className="text-sm font-sans text-black font-bold leading-relaxed mt-2 border-t border-black/10 pt-2">
                To protect your routine from "claims-washing", purchase formulations containing concentrations within this clinically validated range.
              </p>
            </div>
          )}

          {/* 4. What it is */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <HelpCircle className="w-5 h-5 text-black shrink-0" />
              <span>What it is</span>
            </div>
            <p className="text-sm font-sans text-black font-bold leading-relaxed">
              {ingredient.whatItIs}
            </p>
          </div>

          {/* 5. Best For */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-black shrink-0" />
              <span>Best For</span>
            </div>
            <p className="text-sm font-sans text-black font-bold leading-relaxed">
              {ingredient.bestFor}
            </p>
          </div>

          {/* 6. Why Menopausal Skin Needs It */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <Heart className="w-5 h-5 text-black shrink-0" />
              <span>Why Menopausal Skin May Need It</span>
            </div>
            <p className="text-sm font-sans text-black font-bold leading-relaxed">
              {ingredient.whyMenopausalSkinMayNeedIt}
            </p>
          </div>

          {/* 7. Works Well With */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <Sparkles className="w-5 h-5 text-black shrink-0" />
              <span>Works Well With (Synergy)</span>
            </div>
            <p className="text-sm font-sans text-black font-bold leading-relaxed">
              {ingredient.worksWellWith}
            </p>
          </div>

          {/* 8. What to Know / Top Tip */}
          {ingredient.whatToKnow && (
            <div className={getBoxStyle()}>
              <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
                <Lightbulb className="w-5 h-5 text-black shrink-0" />
                <span>What to Know (Top Tip)</span>
              </div>
              <p className="text-sm font-sans text-black font-bold leading-relaxed">
                {ingredient.whatToKnow}
              </p>
            </div>
          )}

          {/* 9. Caution */}
          {ingredient.caution && (
            <div className={getBoxStyle()}>
              <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
                <AlertTriangle className="w-5 h-5 text-black shrink-0" />
                <span>Application Caution</span>
              </div>
              <p className="text-sm font-sans text-black font-bold leading-relaxed">
                {ingredient.caution}
              </p>
            </div>
          )}

          {/* 10. Avoid */}
          {ingredient.avoid && ingredient.avoid.trim().toLowerCase() !== ingredient.caution?.trim().toLowerCase() && (
            <div className={getBoxStyle()}>
              <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
                <XOctagon className="w-5 h-5 text-black shrink-0" />
                <span>Avoid Layering With</span>
              </div>
              <p className="text-sm font-sans text-black font-bold leading-relaxed">
                {ingredient.avoid}
              </p>
            </div>
          )}

          {/* 11. Beginner Friendly */}
          <div className={getBoxStyle()}>
            <div className="flex items-center gap-2 mb-3 text-black text-sm font-sans font-bold uppercase tracking-wider">
              <UserCheck className="w-5 h-5 text-black shrink-0" />
              <span>Beginner Friendly?</span>
            </div>
            <div className="text-sm font-sans text-black font-bold leading-relaxed">
              <p className="font-bold">{ingredient.beginnerFriendly ? 'Yes' : 'No / Intermediate'}</p>
              {ingredient.beginnerFriendlyNotes && 
               ingredient.beginnerFriendlyNotes.trim().toLowerCase() !== 'yes' && 
               ingredient.beginnerFriendlyNotes.trim().toLowerCase() !== 'no' && (
                <p className="mt-2 border-t border-black/10 pt-2 font-bold leading-normal">
                  {ingredient.beginnerFriendlyNotes}
                </p>
              )}
            </div>
          </div>

          {/* 12. Clinical Evidence & Dermatological Studies Section */}
          <div className={getBoxStyle()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-black text-sm font-sans font-bold uppercase tracking-wider">
                <FlaskConical className="w-5 h-5 text-black shrink-0" />
                <span>Clinical Evidence</span>
              </div>
              <span className="text-[10px] font-sans font-bold px-2.5 py-1 rounded-full bg-[#1B263B] text-white">
                {clinicalEvidence?.evidenceLevel || ingredient.evidenceLevel}
              </span>
            </div>

            {/* Scientific Consensus Summary */}
            <p className="text-sm font-sans text-black font-semibold leading-relaxed">
              {clinicalEvidence?.consensusSummary}
            </p>

            {/* Dermatological Guidance Callout */}
            {clinicalEvidence?.dermatologicalTakeaway && (
              <div className="mt-3 p-3 bg-white/80 rounded-xl border border-black/10 text-xs font-sans text-black leading-relaxed">
                <span className="font-bold text-[#1B263B] block mb-0.5">🩺 Dermatologist Takeaway:</span>
                {clinicalEvidence.dermatologicalTakeaway}
              </div>
            )}

            {/* Featured Dermatological Study Card */}
            {clinicalEvidence?.primaryStudy && (
              <div className="mt-4 p-4 bg-white rounded-xl border-2 border-black/15 shadow-2xs">
                <div className="flex items-center gap-1.5 text-[11px] font-sans font-bold uppercase tracking-wider text-[#C5A059] mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Key Dermatological Study</span>
                </div>

                <h4 className="font-serif text-sm font-bold text-[#1B263B] leading-snug">
                  "{clinicalEvidence.primaryStudy.title}"
                </h4>

                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] font-sans text-stone-500">
                  <span className="font-semibold text-stone-700">{clinicalEvidence.primaryStudy.journal}</span>
                  {clinicalEvidence.primaryStudy.year && <span>• {clinicalEvidence.primaryStudy.year}</span>}
                  {clinicalEvidence.primaryStudy.authors && (
                    <span className="truncate max-w-[200px]">• {clinicalEvidence.primaryStudy.authors}</span>
                  )}
                </div>

                {clinicalEvidence.primaryStudy.studyType && (
                  <div className="mt-2 inline-block px-2 py-0.5 rounded bg-stone-100 text-stone-700 text-[10px] font-sans font-semibold border border-stone-200">
                    {clinicalEvidence.primaryStudy.studyType}
                  </div>
                )}

                {/* Key Outcome Highlight */}
                {clinicalEvidence.primaryStudy.keyOutcome && (
                  <div className="mt-2.5 p-2 bg-[#F4FAF7] border border-[#1B263B]/20 rounded-lg text-xs font-sans text-black leading-relaxed">
                    <strong className="text-[#1B263B]">Key Outcome: </strong>
                    {clinicalEvidence.primaryStudy.keyOutcome}
                  </div>
                )}

                <p className="mt-2 text-xs font-sans text-stone-700 leading-relaxed">
                  {clinicalEvidence.primaryStudy.summary}
                </p>

                {/* Link to clinical study / PubMed */}
                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-sans font-medium text-stone-500">
                    {clinicalEvidence.primaryStudy.pmid ? `PubMed ID: ${clinicalEvidence.primaryStudy.pmid}` : 'Indexed Medical Literature'}
                  </span>
                  <a
                    href={clinicalEvidence.primaryStudy.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1B263B] hover:bg-[#2C3E50] text-white rounded-lg text-xs font-sans font-semibold transition-transform active:scale-95 shadow-2xs"
                  >
                    <span>Read Study Reference</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Additional Studies Toggle (if available) */}
            {clinicalEvidence?.additionalStudies && clinicalEvidence.additionalStudies.length > 0 && (
              <div className="mt-3">
                <button
                  type="button"
                  onClick={() => setShowAdditionalStudies(!showAdditionalStudies)}
                  className="w-full flex items-center justify-between py-2 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Additional Supporting Studies ({clinicalEvidence.additionalStudies.length})
                  </span>
                  {showAdditionalStudies ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdditionalStudies && (
                  <div className="mt-2 flex flex-col gap-2.5 pt-1">
                    {clinicalEvidence.additionalStudies.map((study, idx) => (
                      <div key={idx} className="p-3 bg-white/90 rounded-lg border border-black/10 text-xs font-sans">
                        <div className="font-bold text-[#1B263B] leading-snug">"{study.title}"</div>
                        <div className="text-[10.5px] text-stone-500 mt-0.5">
                          {study.journal} ({study.year}) • {study.authors}
                        </div>
                        <p className="mt-1.5 text-stone-700 text-[11px] leading-relaxed">
                          {study.summary}
                        </p>
                        <div className="mt-2 text-right">
                          <a
                            href={study.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1B263B] hover:text-[#C5A059] underline"
                          >
                            <span>View PubMed Abstract</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Core directory return shortcuts */}
          <div className="mt-4 flex gap-3 select-none">
            <button
              onClick={() => onNavigate('concern_list')}
              className="flex-1 py-3 border-2 border-[#1B263B] bg-white text-[#1B263B] font-bold font-sans rounded-xl text-center text-xs cursor-pointer active:scale-98 transition-transform animate-none hover:bg-stone-50"
            >
              Browse Concerns
            </button>
            <button
              onClick={() => onNavigate('ingredient_az')}
              className="flex-1 py-3 border-2 border-[#1B263B] bg-white text-[#1B263B] font-bold font-sans rounded-xl text-center text-xs cursor-pointer active:scale-98 transition-transform animate-none hover:bg-stone-50"
            >
              Browse A–Z Grid
            </button>
          </div>

          {/* Elegant Bottom Navigation footer */}
          <div className="mt-8 pt-6 border-t border-stone-200/60 flex flex-col items-center gap-4 select-none">
            <p className="text-[10px] text-stone-400 font-sans tracking-wide">
              The Menopause Skincare Decoder • Est. 2026
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
