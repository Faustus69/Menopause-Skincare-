/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Home, Sun, Moon, Sparkles, Plus, Check, Trash2, 
  AlertTriangle, FileText, Info, ShieldCheck, Heart, ChevronRight, SunMoon,
  Copy, Download, Printer, ExternalLink, FileDown
} from 'lucide-react';
import { INGREDIENTS_DATA } from '../data';
import { Screen, IngredientRecord } from '../types';

export type RoutineSlot = 'am' | 'pm' | 'both';

export interface RoutineState {
  [ingredientId: string]: RoutineSlot;
}

interface RoutineBuilderScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  favorites: string[];
  routine: RoutineState;
  onUpdateRoutine: (ingredientId: string, slot: RoutineSlot | 'none') => void;
  onClearRoutine?: () => void;
  onToggleFavorite: (id: string) => void;
  onSelectIngredient: (id: string) => void;
}

export default function RoutineBuilderScreen({
  onNavigate,
  onGoBack,
  favorites,
  routine,
  onUpdateRoutine,
  onClearRoutine,
  onToggleFavorite,
  onSelectIngredient
}: RoutineBuilderScreenProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'am' | 'pm'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addModalCategory, setAddModalCategory] = useState<'all' | 'barrier_cream' | 'moisture_seal' | 'hydrator' | 'active'>('all');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showClearModal, setShowClearModal] = useState(false);
  const [exportViewMode, setExportViewMode] = useState<'doc' | 'text'>('doc');
  const [copiedToast, setCopiedToast] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printNotice, setPrintNotice] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);

  const handleClearAll = () => {
    if (onClearRoutine) {
      onClearRoutine();
    } else {
      Object.keys(routine).forEach((id) => onUpdateRoutine(id, 'none'));
    }
    setShowClearModal(false);
  };

  // Helper to determine if an ingredient belongs to the mandatory 'Moisture Seal / Balm' category
  // (squalane/squalene, petrolatum, plant oils, butters, occlusives)
  const isMoistureSealIngredient = (ing: IngredientRecord): boolean => {
    if (ing.role === 'Occlusive') return true;
    const text = `${ing.ingredient} ${ing.id} ${ing.bestFor || ''} ${ing.whatItIs || ''}`.toLowerCase();
    return /squalane|squalene|petrolatum|vaseline|shea butter|shea|argan oil|marula oil|rosehip|jojoba|plant oil|facial oil|balm|ointment|dimethicone|occlusive/i.test(text);
  };

  // Helper to determine if an ingredient belongs to Hydrate & Soothe step
  const isHydrateSootheIngredient = (ing: IngredientRecord): boolean => {
    const text = `${ing.ingredient} ${ing.id}`.toLowerCase();
    if (/panthenol|glycerin|hyaluronic|centella|allantoin|beta_glucan|aloe|sodium_pca|ectoin|madecassoside/i.test(text)) return true;
    return ing.role === 'Hydrator' || ing.role === 'Soothing';
  };

  // Helper to determine if an ingredient belongs to the mandatory 'Barrier Cream' category
  // (ceramides, fatty acids, cholesterol, lipid complexes)
  const isBarrierCreamIngredient = (ing: IngredientRecord): boolean => {
    if (isMoistureSealIngredient(ing)) return false;
    if (isHydrateSootheIngredient(ing)) return false;
    if (ing.role === 'Barrier Repair') return true;
    const text = `${ing.ingredient} ${ing.id} ${ing.bestFor || ''} ${ing.whatItIs || ''}`.toLowerCase();
    return /ceramide|fatty acid|linoleic|cholesterol|lipid|barrier cream|stratum corneum/i.test(text);
  };

  // Helper to determine if an ingredient is a target active
  const isTargetActiveIngredient = (ing: IngredientRecord): boolean => {
    return ing.role === 'Retinoid' || ing.role === 'Exfoliant' || ing.role === 'Breakout Support' || ing.role === 'Brightener' || (ing.role === 'Antioxidant' && !isHydrateSootheIngredient(ing));
  };

  // Helper to sort ingredients by physiological layering order:
  // Water Hydrators & Soothers -> Treatment Actives & Brighteners -> Barrier Repair -> Occlusives
  const getRoleOrder = (role?: string) => {
    switch (role) {
      case 'Hydrator': return 1;
      case 'Soothing': return 2;
      case 'Antioxidant': return 3;
      case 'Brightener': return 4;
      case 'Retinoid': return 5;
      case 'Exfoliant': return 6;
      case 'Breakout Support': return 7;
      case 'Barrier Repair': return 8;
      case 'Occlusive': return 9;
      default: return 10;
    }
  };

  // Get all favorited ingredients or ingredients currently assigned to routine
  const routineIngredientIds = Array.from(
    new Set([...favorites, ...Object.keys(routine).filter((id) => routine[id])])
  );

  const routineIngredients = INGREDIENTS_DATA.filter((ing) => routineIngredientIds.includes(ing.id));

  // Categorized and sorted by layering order
  const amIngredients = routineIngredients
    .filter((ing) => routine[ing.id] === 'am' || routine[ing.id] === 'both')
    .sort((a, b) => getRoleOrder(a.role) - getRoleOrder(b.role));

  const pmIngredients = routineIngredients
    .filter((ing) => routine[ing.id] === 'pm' || routine[ing.id] === 'both')
    .sort((a, b) => getRoleOrder(a.role) - getRoleOrder(b.role));

  // Categorized PM ingredients by physiological evening steps
  const pmHydrateSoothe = pmIngredients.filter(isHydrateSootheIngredient);
  const pmActives = pmIngredients.filter(isTargetActiveIngredient);
  const pmBarrierCream = pmIngredients.filter(isBarrierCreamIngredient);
  const pmMoistureSeal = pmIngredients.filter(isMoistureSealIngredient);
  const pmOther = pmIngredients.filter(ing => 
    !isHydrateSootheIngredient(ing) && 
    !isTargetActiveIngredient(ing) && 
    !isBarrierCreamIngredient(ing) && 
    !isMoistureSealIngredient(ing)
  );

  // Categorized AM ingredients
  const amHydrateSoothe = amIngredients.filter(isHydrateSootheIngredient);
  const amProtectBrighten = amIngredients.filter(ing => ing.role === 'Antioxidant' || ing.role === 'Brightener');
  const amBarrierMoisturiser = amIngredients.filter(isBarrierCreamIngredient);
  const amMoistureSeal = amIngredients.filter(isMoistureSealIngredient);
  const amOther = amIngredients.filter(ing => 
    !isHydrateSootheIngredient(ing) && 
    !(ing.role === 'Antioxidant' || ing.role === 'Brightener') && 
    !isBarrierCreamIngredient(ing) && 
    !isMoistureSealIngredient(ing)
  );

  // Check for conflicts in PM (e.g. retinoids + exfoliating acids)
  const pmHasRetinoids = pmIngredients.some(ing => 
    ing.ingredient.toLowerCase().includes('retin') || ing.ingredient.toLowerCase().includes('bakuchiol')
  );
  const pmHasAcids = pmIngredients.some(ing => 
    ing.ingredient.toLowerCase().includes('acid') || ing.ingredient.toLowerCase().includes('salicylic') || ing.ingredient.toLowerCase().includes('glycolic') || ing.ingredient.toLowerCase().includes('lactic')
  );
  const hasRetinoidAcidConflict = pmHasRetinoids && pmHasAcids;

  // Generate clean, formatted simple text list for export & clipboard
  const generateRoutineText = (): string => {
    let text = `MY DAILY SKINCARE ROUTINE\n`;
    text += `The Menopause Skincare Decoder\n`;
    text += `====================================================\n\n`;

    text += `CORE MENOPAUSAL LAYERING RULES:\n`;
    text += `• Lightest to Richest: Apply water-based serums and hydrators first, followed by treatment actives, then barrier moisturiser, and seal with oils/balms if needed. SPF always goes last in the morning.\n`;
    text += `• Active Discipline: Use only one strong active treatment per evening. Avoid combining retinoids with exfoliating acids on the same night.\n`;
    text += `• Recovery Priority: If skin stings, tingles, or flushes, pause strong actives and switch to barrier-repair hydrators (Ceramides, Panthenol, Glycerin, Squalane).\n\n`;

    text += `☀️ MORNING PROTOCOL (AM)\n`;
    text += `----------------------------------------------------\n`;
    text += `Recommended Step Order:\n`;
    text += `1. Cleanse: Gentle rinse or non-stripping hydrating cleanser\n`;
    text += `2. Hydrate & Soothe: Water-based humectants (Glycerin, Panthenol, Hyaluronic Acid)\n`;
    text += `3. Protect / Brighten: Antioxidant serum (Vitamin C, Niacinamide)\n`;
    text += `4. Barrier Moisturiser: Nourishing lipid cream (Ceramides, Squalane)\n`;
    text += `5. Sunscreen (SPF): Broad-spectrum daily protection (essential morning step)\n\n`;

    if (amIngredients.length === 0) {
      text += `Assigned Morning Ingredients: None assigned yet.\n\n`;
    } else {
      text += `Assigned Morning Ingredients (${amIngredients.length}):\n`;
      amIngredients.forEach((ing, index) => {
        text += `${index + 1}. ${ing.ingredient} [Role: ${ing.role || 'Active'}] (${ing.stage})\n`;
        text += `   • Quick take: ${ing.quickTake}\n`;
        if (ing.whatToKnow) text += `   • Guidance: ${ing.whatToKnow}\n`;
        text += `\n`;
      });
    }

    text += `🌙 EVENING PROTOCOL (PM) — 5-STEP PROTOCOL\n`;
    text += `----------------------------------------------------\n`;
    text += `Recommended Step Order:\n`;
    text += `1. Cleanse: Thorough gentle cleanse (removes SPF, makeup & daytime debris)\n`;
    text += `2. Hydrate & Soothe: Water-based hydrator (Glycerin, Panthenol, Centella)\n`;
    text += `3. Target Active: One treatment active only (Retinol, Peptides, or Acids, 1–3x weekly)\n`;
    text += `4. Barrier Cream: Ceramides + Fatty Acids & Cholesterol (restores lipid barrier)\n`;
    text += `5. Moisture Seal / Balm: Squalane, petrolatum, or nourishing plant oils (locks in moisture & halts TEWL)\n\n`;

    text += `Assigned Evening Regimen by Category:\n`;
    text += `• Step 1 (Cleanse): Gentle non-stripping cleanser\n`;
    text += `• Step 2 (Hydrate & Soothe): ${pmHydrateSoothe.length > 0 ? pmHydrateSoothe.map(i => i.ingredient).join(', ') : 'None assigned'}\n`;
    text += `• Step 3 (Target Active): ${pmActives.length > 0 ? pmActives.map(i => i.ingredient).join(', ') : 'None assigned'}\n`;
    text += `• Step 4 (Barrier Cream): ${pmBarrierCream.length > 0 ? pmBarrierCream.map(i => i.ingredient).join(', ') : 'None assigned'}\n`;
    text += `• Step 5 (Moisture Seal / Balm): ${pmMoistureSeal.length > 0 ? pmMoistureSeal.map(i => i.ingredient).join(', ') : 'None assigned'}\n\n`;

    if (pmIngredients.length > 0) {
      text += `Detailed Evening Ingredients (${pmIngredients.length}):\n`;
      pmIngredients.forEach((ing, index) => {
        text += `${index + 1}. ${ing.ingredient} [Role: ${ing.role || 'Active'}] (${ing.stage})\n`;
        text += `   • Quick take: ${ing.quickTake}\n`;
        if (ing.whatToKnow) text += `   • Guidance: ${ing.whatToKnow}\n`;
        text += `\n`;
      });
    }

    if (hasRetinoidAcidConflict) {
      text += `⚠️ PM SAFETY CONFLICT ADVISORY:\n`;
      text += `Your evening protocol contains both Retinoids and Exfoliating Acids. Alternate them on separate evenings to prevent skin barrier breakdown.\n\n`;
    }

    text += `Generated on ${new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}\n`;
    text += `The Menopause Skincare Decoder • Designed for Menopausal Barrier Support\n`;

    return text;
  };

  // Copy routine text to clipboard with graceful fallback
  const handleCopyToClipboard = async () => {
    const text = generateRoutineText();
    let success = false;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        success = true;
      }
    } catch (err) {
      console.warn('navigator.clipboard.writeText failed, attempting fallback', err);
    }

    if (!success) {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.setAttribute('readonly', '');
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        success = document.execCommand('copy');
        document.body.removeChild(textarea);
      } catch (fallbackErr) {
        console.error('Fallback clipboard copy failed:', fallbackErr);
      }
    }

    if (success) {
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3500);
    }
  };

  // Download text file
  const handleDownloadTextFile = () => {
    const text = generateRoutineText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `My_Skincare_Routine_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate full print-ready HTML with elegant typography, checkboxes, and auto-print
  const generatePrintableHTML = (): string => {
    const todayStr = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>My Skincare Routine - The Menopause Skincare Decoder</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { margin: 12mm 15mm; size: auto; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
      color: #1c1917;
      background: #ffffff;
      margin: 0;
      padding: 24px;
      line-height: 1.5;
      font-size: 13px;
    }
    .no-print-bar {
      background: #556953;
      color: #ffffff;
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
    }
    .no-print-bar h2 { margin: 0 0 2px 0; font-size: 14px; font-weight: 700; }
    .no-print-bar p { margin: 0; font-size: 12px; opacity: 0.9; }
    .print-btn {
      background: #ffffff;
      color: #556953;
      font-weight: 700;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 13px;
      white-space: nowrap;
    }
    .print-btn:hover { background: #f5f5f4; }
    .header {
      border-bottom: 2px solid #556953;
      padding-bottom: 12px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .app-title { font-size: 20px; font-weight: 800; color: #1F2A3D; margin: 0; }
    .app-sub { font-size: 12px; color: #556953; font-weight: 600; margin-top: 2px; }
    .date-meta { font-size: 11px; color: #78716c; text-align: right; }
    .rules-box {
      background: #fafaf9;
      border: 1px solid #e7e5e4;
      border-left: 4px solid #556953;
      padding: 10px 14px;
      margin-bottom: 20px;
      border-radius: 4px;
    }
    .rules-box h3 { margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #556953; }
    .rules-box p { margin: 2px 0; font-size: 11.5px; color: #44403c; }
    .routine-col-title {
      font-size: 14px;
      font-weight: 700;
      color: #1F2A3D;
      border-bottom: 1.5px solid #d6d3d1;
      padding-bottom: 4px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .step-card {
      border: 1px solid #e7e5e4;
      border-radius: 6px;
      padding: 9px 12px;
      margin-bottom: 8px;
      page-break-inside: avoid;
    }
    .step-header { display: flex; align-items: baseline; gap: 8px; }
    .step-badge {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      background: #556953;
      color: white;
      text-align: center;
      border-radius: 50%;
      font-size: 11px;
      font-weight: bold;
      flex-shrink: 0;
    }
    .step-name { font-weight: 700; font-size: 13px; color: #1c1917; }
    .step-checkbox { margin-left: auto; width: 14px; height: 14px; border: 1.5px solid #a8a29e; border-radius: 3px; display: inline-block; }
    .step-desc { font-size: 11.5px; color: #57534e; margin-top: 3px; margin-left: 28px; }
    .ing-pills { margin-top: 4px; margin-left: 28px; display: flex; flex-wrap: wrap; gap: 4px; }
    .ing-pill {
      background: #f5f5f4;
      border: 1px solid #d6d3d1;
      border-radius: 4px;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 600;
      color: #1c1917;
    }
    .mandatory-badge {
      background: #8C2D19;
      color: #ffffff;
      font-size: 8.5px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-left: 6px;
      vertical-align: middle;
    }
    .missing-warning {
      margin-top: 6px;
      margin-left: 28px;
      font-size: 11px;
      color: #8C2D19;
      font-weight: 600;
      background: #FDF2F0;
      padding: 6px 10px;
      border-radius: 6px;
      border: 1px solid #F2E8E6;
    }
    .alert-box {
      background: #fffbeb;
      border: 1px solid #fef3c7;
      border-left: 4px solid #d97706;
      padding: 8px 12px;
      margin: 16px 0;
      border-radius: 4px;
      font-size: 11.5px;
      color: #92400e;
    }
    .notes-box {
      margin-top: 24px;
      border: 1px dashed #a8a29e;
      border-radius: 6px;
      padding: 12px;
      min-height: 50px;
      font-size: 11px;
      color: #78716c;
      page-break-inside: avoid;
    }
    @media print {
      .no-print-bar { display: none !important; }
      body { padding: 0 !important; }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div>
      <h2>Ready to Print Skincare Routine</h2>
      <p>Click "Print / Save as PDF" or press Ctrl+P / Cmd+P in your browser.</p>
    </div>
    <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
  </div>

  <div class="header">
    <div>
      <h1 class="app-title">The Menopause Skincare Decoder</h1>
      <div class="app-sub">Personal Skincare Regimen & Menopausal Layering Protocol</div>
    </div>
    <div class="date-meta">
      <div>Generated: ${todayStr}</div>
      <div>Barrier-First Formulation Protocol</div>
    </div>
  </div>

  <div class="rules-box">
    <h3>Core Menopausal Skin Layering Principles</h3>
    <p>• <strong>Lightest to Richest:</strong> Apply water-based serums first, followed by treatment actives, then barrier moisturiser, and seal with oils/balms if needed. SPF is always the final morning step.</p>
    <p>• <strong>Active Discipline:</strong> Use only 1 strong active treatment per evening. Avoid combining retinoids with exfoliating acids on the same night.</p>
    <p>• <strong>Recovery Priority:</strong> If skin feels tight, hot, stingy, or flushed, pause strong actives and switch to barrier-repair hydrators (Ceramides, Panthenol, Glycerin, Squalane).</p>
  </div>

  <div class="routine-col-title">☀️ MORNING PROTOCOL (AM)</div>
  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">1</span>
      <span class="step-name">Gentle Cleanse</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Lukewarm water rinse or gentle, non-foaming hydrating milk cleanser. Avoid harsh surfactants.</div>
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">2</span>
      <span class="step-name">Hydrate & Soothe</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Water-based humectants (Glycerin, Hyaluronic Acid, Panthenol) to replenish intracellular hydration.</div>
    ${amIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').length > 0 ? `
      <div class="ing-pills">
        ${amIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">3</span>
      <span class="step-name">Protect & Brighten</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Antioxidants (Vitamin C, Niacinamide) to defend against free radical oxidative stress and dullness.</div>
    ${amIngredients.filter(i => i.role === 'Antioxidant' || i.role === 'Brightener').length > 0 ? `
      <div class="ing-pills">
        ${amIngredients.filter(i => i.role === 'Antioxidant' || i.role === 'Brightener').map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">4</span>
      <span class="step-name">Barrier Moisturiser</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Lipid-replenishing cream (Ceramides, Fatty Acids, Cholesterol) to reinforce the menopausal stratum corneum.</div>
    ${amIngredients.filter(i => i.role === 'Barrier Repair').length > 0 ? `
      <div class="ing-pills">
        ${amIngredients.filter(i => i.role === 'Barrier Repair').map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">5</span>
      <span class="step-name">Sunscreen (Broad Spectrum SPF 30+)</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Essential daily barrier defence. Prevents pigment acceleration and collagen loss during estrogen decline.</div>
  </div>

  <div class="routine-col-title" style="margin-top: 28px;">🌙 EVENING PROTOCOL (PM) — 5-STEP PROTOCOL</div>
  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">1</span>
      <span class="step-name">Cleanse</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Gentle thorough cleanse to dissolve SPF, daytime pollutants, and impurities without lipid stripping.</div>
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">2</span>
      <span class="step-name">Hydrate & Soothe</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Calming humectants and soothers (Panthenol, Centella, Allantoin, Glycerin) on clean skin.</div>
    ${pmIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').length > 0 ? `
      <div class="ing-pills">
        ${pmIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">3</span>
      <span class="step-name">Target Treatment Active</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">One active treatment step only (Retinol or Actives, 1–3x weekly). Never combine strong acids and retinoids together.</div>
    ${pmIngredients.filter(i => i.role === 'Retinoid' || i.role === 'Exfoliant' || i.role === 'Breakout Support').length > 0 ? `
      <div class="ing-pills">
        ${pmIngredients.filter(i => i.role === 'Retinoid' || i.role === 'Exfoliant' || i.role === 'Breakout Support').map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">4</span>
      <span class="step-name">Barrier Cream (Ceramides / Fatty Acids)</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Ceramides + Cholesterol + Fatty Acids to replenish lost intercellular lipids and restore the thinning stratum corneum during cellular repair.</div>
    ${pmBarrierCream.length > 0 ? `
      <div class="ing-pills">
        ${pmBarrierCream.map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  <div class="step-card">
    <div class="step-header">
      <span class="step-badge">5</span>
      <span class="step-name">Moisture Seal / Balm (Squalene / Petrolatum / Oils)</span>
      <span class="step-checkbox"></span>
    </div>
    <div class="step-desc">Squalane, occlusive balm, petrolatum, or plant oils to lock in preceding hydration and halt overnight trans-epidermal water loss (TEWL).</div>
    ${pmMoistureSeal.length > 0 ? `
      <div class="ing-pills">
        ${pmMoistureSeal.map(i => `<span class="ing-pill">✓ ${i.ingredient}</span>`).join('')}
      </div>` : ''}
  </div>

  ${hasRetinoidAcidConflict ? `
    <div class="alert-box">
      ⚠️ <strong>Safety Conflict Advisory:</strong> You have both Retinoids and Exfoliating Acids in your PM routine. Alternate them on separate evenings to safeguard your barrier.
    </div>
  ` : ''}

  <div class="notes-box">
    <strong>Personal & Clinician Notes:</strong>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        try { window.print(); } catch(e) {}
      }, 500);
    });
  </script>
</body>
</html>`;
  };

  // Download formatted printable HTML file
  const handleDownloadPrintableHTML = () => {
    const html = generatePrintableHTML();
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Printable_Skincare_Routine_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Print routine: opens in a clean top-level window/tab with print ready, or downloads formatted .html
  const handlePrint = () => {
    setIsPrinting(true);
    setPrintNotice(null);

    const htmlContent = generatePrintableHTML();
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    let openedInNewTab = false;
    try {
      const printWindow = window.open(blobUrl, '_blank');
      if (printWindow && !printWindow.closed) {
        openedInNewTab = true;
      }
    } catch (e) {
      console.warn('window.open was restricted by iframe', e);
    }

    if (openedInNewTab) {
      setPrintNotice('Printable routine opened in a new tab with print ready!');
      setIsPrinting(false);
      return;
    }

    // If iframe/browser popup blocker intercepted window.open, trigger instant download of the printable HTML file
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `Printable_Skincare_Routine_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setPrintNotice('Downloaded "Printable_Skincare_Routine.html"! Open this file to print directly or save as PDF without iframe restrictions.');
    setIsPrinting(false);
  };

  const filteredForAdd = INGREDIENTS_DATA.filter((ing) => {
    const matchesSearch =
      ing.ingredient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.stage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ing.quickTake.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (addModalCategory === 'barrier_cream') return isBarrierCreamIngredient(ing);
    if (addModalCategory === 'moisture_seal') return isMoistureSealIngredient(ing);
    if (addModalCategory === 'hydrator') return isHydrateSootheIngredient(ing);
    if (addModalCategory === 'active') return isTargetActiveIngredient(ing);
    return true;
  });

  const renderIngredientCard = (ing: IngredientRecord) => {
    const currentSlot = routine[ing.id] || 'none';
    return (
      <motion.div
        key={ing.id}
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs hover:shadow-2xs transition-all flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {ing.role && (
                <span className="text-[9.5px] bg-[#556953]/10 text-[#556953] border border-[#556953]/20 font-sans font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {ing.role}
                </span>
              )}
              <span className="text-[10px] text-[#CD8B80] font-bold tracking-widest uppercase font-mono">
                {ing.stage}
              </span>
              {ing.suitabilityAMPM && (
                <span className="text-[9px] bg-stone-100 text-stone-600 font-sans px-1.5 py-0.5 rounded border border-stone-200">
                  {ing.suitabilityAMPM}
                </span>
              )}
              {isRecoveryMode && ['Retinoid', 'Exfoliant', 'Breakout Support'].includes(ing.role || '') && (
                <span className="text-[9px] bg-rose-100 text-rose-800 border border-rose-200 font-sans font-bold px-1.5 py-0.5 rounded">
                  Pause in Recovery
                </span>
              )}
            </div>
            <h3 className="text-base font-serif font-semibold text-[#1B263B] mt-0.5">
              {ing.ingredient}
            </h3>
            <p className="text-xs text-stone-500 font-sans mt-0.5 line-clamp-2">
              {ing.quickTake}
            </p>
          </div>

          <button
            onClick={() => onSelectIngredient(ing.id)}
            className="p-1.5 text-stone-400 hover:text-[#556953] rounded-lg transition-colors cursor-pointer shrink-0"
            title="View Full Details"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Protocol Controls */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2 flex-wrap select-none">
          <span className="text-[11px] font-bold text-stone-500 font-sans">
            Protocol:
          </span>

          <div className="flex items-center gap-1.5 font-sans text-xs">
            {/* Morning AM Button */}
            <button
              onClick={() =>
                onUpdateRoutine(
                  ing.id,
                  currentSlot === 'am' ? 'none' : 'am'
                )
              }
              id={`routine_slot_am_${ing.id}`}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px] ${
                currentSlot === 'am'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-3xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Sun className={`w-3.5 h-3.5 ${currentSlot === 'am' ? 'text-amber-600 fill-amber-400' : ''}`} />
              <span>AM</span>
              {currentSlot === 'am' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Evening PM Button */}
            <button
              onClick={() =>
                onUpdateRoutine(
                  ing.id,
                  currentSlot === 'pm' ? 'none' : 'pm'
                )
              }
              id={`routine_slot_pm_${ing.id}`}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px] ${
                currentSlot === 'pm'
                  ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-3xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <Moon className={`w-3.5 h-3.5 ${currentSlot === 'pm' ? 'text-indigo-600 fill-indigo-400' : ''}`} />
              <span>PM</span>
              {currentSlot === 'pm' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Both AM & PM Button */}
            <button
              onClick={() =>
                onUpdateRoutine(
                  ing.id,
                  currentSlot === 'both' ? 'none' : 'both'
                )
              }
              id={`routine_slot_both_${ing.id}`}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px] ${
                currentSlot === 'both'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-3xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <SunMoon className="w-3.5 h-3.5 text-emerald-700" />
              <span>Both</span>
              {currentSlot === 'both' && <Check className="w-3 h-3 ml-0.5" />}
            </button>

            {/* Unassign / Remove */}
            {currentSlot !== 'none' && (
              <button
                onClick={() => onUpdateRoutine(ing.id, 'none')}
                className="p-1.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="Remove from routine"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-8 bg-[#FAF9F6]"
    >
      {/* Sticky Header */}
      <div className="bg-[#556953] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 select-none">
        <div className="flex items-center">
          <span className="font-serif font-semibold text-base tracking-wide text-white">
            Routine Builder
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowExportModal(true)}
            className="px-2.5 py-1.5 text-stone-100 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg transition-colors active:scale-95 cursor-pointer flex items-center gap-1.5 shadow-3xs"
            id="routine_export_btn"
            title="Export routine as text list"
          >
            <Copy className="w-3.5 h-3.5 text-[#DAA89B]" />
            <span className="text-[11px] font-sans font-bold leading-none">Export List</span>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Banner Title */}
        <div className="mb-4 select-none">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#CD8B80] font-bold tracking-widest uppercase font-sans">
              Daily Protocol Organizer
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#556953] bg-[#556953]/10 px-2.5 py-0.5 rounded-full font-sans">
                {routineIngredients.length} active items
              </span>
              {routineIngredients.length > 0 && (
                <button
                  onClick={() => setShowClearModal(true)}
                  id="routine_clear_header_btn"
                  className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 cursor-pointer font-sans"
                  title="Clear all ingredients from routine"
                >
                  <Trash2 className="w-3 h-3 text-rose-600" />
                  <span>Clear All</span>
                </button>
              )}
            </div>
          </div>
          <h2 className="text-2xl font-serif font-medium text-[#1B263B] mt-1">
            My Skincare Regimen
          </h2>
          <p className="text-xs text-stone-500 mt-1 font-sans leading-relaxed">
            Assign your favorited actives to Morning (AM) and Evening (PM) protocols to build a safe, structured daily routine.
          </p>
        </div>

        {/* Export Routine Action Strip */}
        <div className="flex items-center justify-between gap-2.5 mb-5 flex-wrap bg-white p-3 rounded-2xl border border-stone-200/90 shadow-3xs">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowExportModal(true)}
              id="export_routine_text_btn"
              className="px-3.5 py-2 bg-[#556953] hover:bg-[#435341] text-white rounded-xl text-xs font-bold font-sans flex items-center gap-2 shadow-3xs cursor-pointer transition-all active:scale-98"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Export Routine as Text List</span>
            </button>
            <button
              onClick={handleCopyToClipboard}
              id="quick_copy_routine_btn"
              className={`px-3 py-2 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all cursor-pointer border ${
                copiedToast 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="Copy text list directly to clipboard"
            >
              {copiedToast ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-bold">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-stone-500" />
                  <span>Quick Copy</span>
                </>
              )}
            </button>
          </div>

          <span className="text-[11px] text-stone-500 font-sans hidden sm:inline-block">
            Simple text list for clipboard, printing, or notes
          </span>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex p-1 bg-stone-200/60 rounded-xl mb-5 select-none font-sans text-xs font-bold">
          <button
            onClick={() => setActiveTab('all')}
            id="routine_tab_all"
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-white text-[#556953] shadow-3xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <SunMoon className="w-3.5 h-3.5" />
            <span>All ({routineIngredients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('am')}
            id="routine_tab_am"
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'am'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 shadow-3xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-600" />
            <span>Morning ({amIngredients.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('pm')}
            id="routine_tab_pm"
            className={`flex-1 py-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'pm'
                ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 shadow-3xs font-extrabold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-600" />
            <span>Evening ({pmIngredients.length})</span>
          </button>
        </div>

        {/* Conflict Warning Notice */}
        {hasRetinoidAcidConflict && (activeTab === 'all' || activeTab === 'pm') && (
          <div className="bg-amber-50 border border-amber-300/80 rounded-2xl p-4 mb-4 shadow-3xs flex items-start gap-3 text-amber-900 select-text">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-sans">
              <span className="font-bold block text-amber-950 mb-0.5">PM Active Conflict Advisory</span>
              Your Evening protocol contains both a <strong>Retinoid/Bakuchiol</strong> and an <strong>Exfoliating Acid</strong>. Avoid using both on the same night. Alternate them on separate evenings to protect your skin barrier.
            </div>
          </div>
        )}

        {/* Skin Barrier Status & Recovery Mode Toggle */}
        <div className="mb-4 p-3 bg-[#FAF9F6] border border-[#556953]/25 rounded-2xl flex items-center justify-between gap-3 shadow-3xs">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl shrink-0 ${isRecoveryMode ? 'bg-rose-100 text-rose-800' : 'bg-[#556953]/10 text-[#556953]'}`}>
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 font-sans block">
                Barrier State
              </span>
              <span className="text-xs font-bold text-[#1B263B] font-sans">
                {isRecoveryMode ? 'Recovery Mode Active' : 'Normal Active Protocol'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsRecoveryMode(!isRecoveryMode)}
            className={`px-3 py-1.5 rounded-xl font-sans text-xs font-bold transition-all cursor-pointer ${
              isRecoveryMode 
                ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs' 
                : 'bg-stone-200/80 hover:bg-stone-300/80 text-stone-700'
            }`}
          >
            {isRecoveryMode ? 'Exit Recovery' : 'Skin Reactive?'}
          </button>
        </div>

        {/* Recovery Mode Warning Callout */}
        {isRecoveryMode && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs font-sans text-rose-900 shadow-3xs">
            <div className="flex items-center gap-2 font-bold text-rose-950 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Recovery Mode Activated</span>
            </div>
            <p className="leading-relaxed text-[11.5px] text-rose-800">
              Your skin sounds reactive today, so keep the routine simple. Pause retinoids, exfoliating acids, strong vitamin C, kojic acid, and harsh breakout treatments for now. Focus on hydration, soothing, and barrier repair.
            </p>
          </div>
        )}

        {/* Layering Rule Advisory */}
        <div className="mb-4 p-3.5 bg-white border border-stone-200/80 rounded-2xl text-xs font-sans text-stone-600 shadow-3xs">
          <span className="font-bold text-[#556953] flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
            <Info className="w-3.5 h-3.5 text-[#556953]" /> Layering Rules & Order
          </span>
          <p className="text-[11.5px] text-stone-700 leading-relaxed">
            <strong>Lightest to richest:</strong> Start with hydrating or soothing serums, then treatment ingredients, then moisturiser, then oils or balms if needed. In the morning, SPF always goes last.
          </p>
        </div>

        {/* Action Button: Add Ingredient to Routine & Clear All */}
        <div className="mb-5 flex items-center gap-2">
          <button
            onClick={() => {
              setAddModalCategory('all');
              setShowAddModal(true);
            }}
            id="routine_add_ingredient_btn"
            className="flex-1 py-3 px-4 bg-white hover:bg-stone-50 border-2 border-dashed border-[#556953]/40 hover:border-[#556953] text-[#556953] font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-3xs active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add Ingredient to Routine</span>
          </button>

          {routineIngredients.length > 0 && (
            <button
              onClick={() => setShowClearModal(true)}
              id="routine_clear_all_btn"
              className="py-3 px-3.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 hover:text-rose-800 font-sans font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-3xs active:scale-98 shrink-0"
              title="Clear all ingredients from routine"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Clear All</span>
            </button>
          )}
        </div>

        {/* Routine Sequence Content */}
        <div className="flex-1">
          {routineIngredients.length === 0 ? (
            <div className="bg-white border border-[#E2B4BD]/35 rounded-2xl p-8 text-center shadow-3xs select-none">
              <div className="w-14 h-14 bg-[#FAF9F6] border border-[#E2B4BD]/20 rounded-full flex items-center justify-center mx-auto mb-3 text-[#556953]">
                <SunMoon className="w-7 h-7 stroke-[1.5]" />
              </div>
              <h4 className="text-sm font-bold text-[#1B263B] font-sans">No ingredients in your routine yet</h4>
              <p className="text-xs text-stone-500 mt-1.5 leading-relaxed font-sans max-w-xs mx-auto">
                Categorize ingredients into Morning and Evening protocols to organize your daily barrier support and active treatments.
              </p>
              <button
                onClick={() => {
                  setAddModalCategory('all');
                  setShowAddModal(true);
                }}
                className="mt-4 px-5 py-2.5 bg-[#556953] text-white font-sans font-bold text-xs rounded-xl shadow-3xs hover:bg-[#4A5D48] transition-colors cursor-pointer"
              >
                Browse & Add Ingredients
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* ======================= EVENING (PM) TAB ======================= */}
              {activeTab === 'pm' && (
                <div className="flex flex-col gap-4">
                  {/* Step 1: Cleanse */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold flex items-center justify-center">1</span>
                        <h4 className="font-bold text-stone-900 text-xs font-sans">Cleanse (PM)</h4>
                      </div>
                      <span className="text-[10px] text-stone-500 font-sans font-medium">Preparation Step</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-sans pl-8 leading-relaxed">
                      Gentle, non-stripping cleanse (cream, balm, or milky wash) to dissolve daytime SPF and impurities without removing critical intercellular lipids.
                    </p>
                  </div>

                  {/* Step 2: Hydrate & Soothe */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold flex items-center justify-center">2</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Hydrate & Soothe</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Water-based humectants (Glycerin, Panthenol, Hyaluronic Acid)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('hydrator');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {pmHydrateSoothe.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {pmHydrateSoothe.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>No hydrating serum assigned.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('hydrator');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Hydrator
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Target Treatment Active */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold flex items-center justify-center">3</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Target Treatment Active</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Single active step (Retinol, Exfoliating Acids, Peptides). Limit 1–3x weekly.</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('active');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {pmActives.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {pmActives.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>Optional active step. Pause if skin is reactive.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('active');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Active
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 4: Barrier Cream */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold flex items-center justify-center">4</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Barrier Cream</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Lipid repair (Ceramides, Fatty Acids, Cholesterol) to restore barrier integrity</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('barrier_cream');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {pmBarrierCream.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {pmBarrierCream.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>No barrier cream assigned.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('barrier_cream');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Barrier Cream
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 5: Moisture Seal / Balm */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-900 text-xs font-extrabold flex items-center justify-center">5</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Moisture Seal / Balm</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Occlusive seal (Squalane, Petrolatum, Oils) to lock in hydration overnight</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('moisture_seal');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {pmMoistureSeal.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {pmMoistureSeal.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>Optional moisture seal or facial oil.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('moisture_seal');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Moisture Seal
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Supportive Steps in PM */}
                  {pmOther.length > 0 && (
                    <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2">
                      <h4 className="font-bold text-stone-700 text-xs font-sans uppercase tracking-wider">
                        Additional Evening Steps
                      </h4>
                      <div className="flex flex-col gap-2">
                        {pmOther.map(renderIngredientCard)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================= MORNING (AM) TAB ======================= */}
              {activeTab === 'am' && (
                <div className="flex flex-col gap-4">
                  {/* Step 1: Cleanse */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center justify-center">1</span>
                        <h4 className="font-bold text-stone-900 text-xs font-sans">Cleanse or Water Rinse</h4>
                      </div>
                      <span className="text-[10px] text-stone-500 font-sans font-medium">Preparation Step</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-sans pl-8 leading-relaxed">
                      Gentle rinse with lukewarm water or a mild hydrating cleanser. Avoid harsh foaming washes that strip natural sebum.
                    </p>
                  </div>

                  {/* Step 2: Hydrate & Soothe */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center justify-center">2</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Hydrate & Soothe</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Water-based humectants (Glycerin, Panthenol, Hyaluronic Acid)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('hydrator');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {amHydrateSoothe.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {amHydrateSoothe.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>No hydrating humectant assigned for morning.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('hydrator');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Hydrator
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 3: Protect & Brighten */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center justify-center">3</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Protect & Brighten</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Antioxidants (Vitamin C, Niacinamide, Ferulic Acid)</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('all');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {amProtectBrighten.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {amProtectBrighten.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>No morning antioxidant assigned.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('all');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Antioxidant
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 4: Barrier Moisturiser */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold flex items-center justify-center">4</span>
                        <div>
                          <h4 className="font-bold text-stone-900 text-xs font-sans">Barrier Moisturiser</h4>
                          <span className="text-[10.5px] text-stone-500 font-sans block">Ceramides, Squalane, or nourishing emulsion</span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setAddModalCategory('barrier_cream');
                          setShowAddModal(true);
                        }}
                        className="text-[11px] font-bold text-[#556953] hover:text-[#435341] font-sans cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    {amBarrierMoisturiser.length > 0 ? (
                      <div className="flex flex-col gap-2 pt-1 pl-8">
                        {amBarrierMoisturiser.map(renderIngredientCard)}
                      </div>
                    ) : (
                      <div className="ml-8 p-3 bg-stone-50 border border-dashed border-stone-200 rounded-xl text-stone-500 text-[11px] font-sans flex items-center justify-between">
                        <span>No daytime barrier moisturiser assigned.</span>
                        <button
                          onClick={() => {
                            setAddModalCategory('barrier_cream');
                            setShowAddModal(true);
                          }}
                          className="font-bold text-[#556953] hover:underline"
                        >
                          + Add Moisturiser
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Step 5: Sunscreen */}
                  <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-extrabold flex items-center justify-center">5</span>
                        <h4 className="font-bold text-stone-900 text-xs font-sans">Sunscreen (Broad Spectrum SPF 30+)</h4>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Essential</span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-sans pl-8 leading-relaxed">
                      Always applied as the final morning step. Prevents UV-accelerated collagen breakdown and hormonal hyperpigmentation.
                    </p>
                  </div>

                  {/* Supportive Steps in AM */}
                  {amOther.length > 0 && (
                    <div className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-3xs flex flex-col gap-2">
                      <h4 className="font-bold text-stone-700 text-xs font-sans uppercase tracking-wider">
                        Additional Morning Steps
                      </h4>
                      <div className="flex flex-col gap-2">
                        {amOther.map(renderIngredientCard)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ======================= ALL ROUTINES TAB ======================= */}
              {activeTab === 'all' && (
                <div className="flex flex-col gap-6">
                  {/* AM Section Header */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 border-b border-amber-200/80 pb-2">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <h3 className="font-bold text-sm text-stone-900 font-sans">Morning Regimen Sequence (AM)</h3>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      {amIngredients.length > 0 ? (
                        amIngredients.map(renderIngredientCard)
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs text-center font-sans">
                          No morning ingredients configured yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* PM Section Header */}
                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between border-b border-indigo-200/80 pb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Moon className="w-4 h-4 text-indigo-600" />
                        <h3 className="font-bold text-sm text-stone-900 font-sans">Evening Regimen Sequence (PM)</h3>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2.5">
                      {pmIngredients.length > 0 ? (
                        pmIngredients.map(renderIngredientCard)
                      ) : (
                        <div className="p-4 bg-white rounded-xl border border-dashed border-stone-200 text-stone-500 text-xs text-center font-sans">
                          No evening ingredients configured yet.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Ingredient Drawer / Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 select-none">
                <h3 className="font-serif font-bold text-lg text-[#1B263B]">
                  Add Ingredient to Routine
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  ✕
                </button>
              </div>

              {/* Search Bar */}
              <div className="py-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ingredient (e.g. Ceramides, Retinol)..."
                  className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs font-sans text-stone-800 focus:outline-none focus:border-[#556953]"
                />
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-1 scrollbar-none text-[10.5px] font-sans">
                <button
                  onClick={() => setAddModalCategory('all')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    addModalCategory === 'all'
                      ? 'bg-[#556953] text-white shadow-3xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setAddModalCategory('barrier_cream')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    addModalCategory === 'barrier_cream'
                      ? 'bg-rose-700 text-white shadow-3xs'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  ★ Barrier Creams (Ceramides/Lipids)
                </button>
                <button
                  onClick={() => setAddModalCategory('moisture_seal')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    addModalCategory === 'moisture_seal'
                      ? 'bg-rose-700 text-white shadow-3xs'
                      : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  ★ Moisture Seals & Balms (Squalane/Oils)
                </button>
                <button
                  onClick={() => setAddModalCategory('hydrator')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    addModalCategory === 'hydrator'
                      ? 'bg-sky-700 text-white shadow-3xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Hydrators & Soothers
                </button>
                <button
                  onClick={() => setAddModalCategory('active')}
                  className={`px-2.5 py-1 rounded-full font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    addModalCategory === 'active'
                      ? 'bg-purple-700 text-white shadow-3xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Treatment Actives
                </button>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto space-y-2 py-2 pr-1">
                {filteredForAdd.map((ing) => {
                  const currentSlot = routine[ing.id] || 'none';
                  return (
                    <div
                      key={ing.id}
                      className="p-3 bg-stone-50 hover:bg-stone-100/80 rounded-xl border border-stone-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-[#1B263B] block truncate font-sans">
                          {ing.ingredient}
                        </span>
                        <span className="text-[10px] text-stone-500 font-sans block truncate">
                          {ing.quickTake}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 font-sans">
                        <button
                          onClick={() => {
                            onUpdateRoutine(ing.id, 'am');
                            if (!favorites.includes(ing.id)) onToggleFavorite(ing.id);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            currentSlot === 'am' ? 'bg-amber-500 text-white' : 'bg-stone-200 text-stone-700 hover:bg-amber-100'
                          }`}
                        >
                          + AM
                        </button>
                        <button
                          onClick={() => {
                            onUpdateRoutine(ing.id, 'pm');
                            if (!favorites.includes(ing.id)) onToggleFavorite(ing.id);
                          }}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${
                            currentSlot === 'pm' ? 'bg-indigo-600 text-white' : 'bg-stone-200 text-stone-700 hover:bg-indigo-100'
                          }`}
                        >
                          + PM
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#556953] text-white font-sans font-bold text-xs rounded-xl"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Export Routine Text List Modal */}
        {showExportModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl max-h-[90vh] flex flex-col"
              id="export_routine_modal"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 select-none">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#1B263B] flex items-center gap-2">
                    <Copy className="w-4 h-4 text-[#556953]" />
                    Export Skincare Routine
                  </h3>
                  <p className="text-[11px] text-stone-500 font-sans mt-0.5">
                    Simple text list formatted for clipboard, personal printing, or sharing with a clinician.
                  </p>
                </div>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full cursor-pointer"
                  title="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="py-3 flex items-center justify-between gap-2 flex-wrap border-b border-stone-100">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {/* Primary Print Button */}
                  <button
                    onClick={handlePrint}
                    disabled={isPrinting}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 transition-all cursor-pointer border ${
                      isPrinting
                        ? 'bg-stone-200 text-stone-500 border-stone-300'
                        : 'bg-[#556953] hover:bg-[#435341] text-white border-transparent shadow-3xs active:scale-95'
                    }`}
                    id="modal_print_btn"
                    title="Print routine or save as PDF"
                  >
                    <Printer className="w-3.5 h-3.5 text-white" />
                    <span>{isPrinting ? 'Preparing...' : 'Print / PDF'}</span>
                  </button>

                  {/* Copy Button */}
                  <button
                    onClick={handleCopyToClipboard}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all cursor-pointer border ${
                      copiedToast 
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-3xs' 
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 shadow-3xs active:scale-95'
                    }`}
                    id="modal_copy_clipboard_btn"
                    title="Copy formatted text list"
                  >
                    {copiedToast ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-600" />
                        <span>Copy Text</span>
                      </>
                    )}
                  </button>

                  {/* Download HTML Print File */}
                  <button
                    onClick={handleDownloadPrintableHTML}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 rounded-xl text-xs font-semibold font-sans flex items-center gap-1.5 transition-all cursor-pointer border border-stone-200 shadow-3xs"
                    id="modal_download_html_btn"
                    title="Download ready-to-print HTML document"
                  >
                    <FileDown className="w-3.5 h-3.5 text-stone-600" />
                    <span>Save .html</span>
                  </button>

                  {/* Download TXT */}
                  <button
                    onClick={handleDownloadTextFile}
                    className="px-2.5 py-2 bg-stone-100 hover:bg-stone-200 active:scale-95 text-stone-700 rounded-xl text-xs font-semibold font-sans flex items-center gap-1 transition-all cursor-pointer border border-stone-200 shadow-3xs"
                    id="modal_download_btn"
                    title="Download raw plain text file"
                  >
                    <Download className="w-3.5 h-3.5 text-stone-600" />
                    <span>.txt</span>
                  </button>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200">
                  <button
                    onClick={() => setExportViewMode('doc')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                      exportViewMode === 'doc'
                        ? 'bg-white text-stone-900 shadow-3xs font-bold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Sheet View
                  </button>
                  <button
                    onClick={() => setExportViewMode('text')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                      exportViewMode === 'text'
                        ? 'bg-white text-stone-900 shadow-3xs font-bold'
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    Raw Text
                  </button>
                </div>
              </div>

              {printNotice && (
                <div className="my-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-950 leading-snug flex items-start gap-2 shadow-3xs">
                  <Info className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-900">{printNotice}</p>
                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      <button
                        onClick={handleDownloadPrintableHTML}
                        className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-bold rounded text-[10px] hover:bg-emerald-100 cursor-pointer flex items-center gap-1"
                      >
                        <FileDown className="w-3 h-3" />
                        Download Print File
                      </button>
                      <button
                        onClick={handleCopyToClipboard}
                        className="px-2 py-0.5 bg-white border border-emerald-300 text-emerald-900 font-bold rounded text-[10px] hover:bg-emerald-100 cursor-pointer flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy Text
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Content Preview Area */}
              <div className="flex-1 overflow-y-auto my-3 relative pr-1">
                {exportViewMode === 'doc' ? (
                  /* Formatted Paper Sheet Preview */
                  <div className="bg-white border border-stone-200 rounded-xl p-4 text-stone-800 font-sans shadow-3xs">
                    {/* Header */}
                    <div className="border-b-2 border-[#556953] pb-3 mb-4 flex items-start justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-[#1F2A3D]">The Menopause Skincare Decoder</h4>
                        <p className="text-[11px] text-[#556953] font-semibold">Personal Daily Routine & Layering Protocol</p>
                      </div>
                      <div className="text-right text-[10px] text-stone-500">
                        <div>{new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                        <div>Barrier Support</div>
                      </div>
                    </div>

                    {/* Principles */}
                    <div className="bg-[#fafaf9] border border-stone-200 border-l-4 border-l-[#556953] p-2.5 rounded-sm mb-4 text-[11px] text-stone-700">
                      <div className="font-bold text-[#556953] uppercase tracking-wider text-[10px] mb-1">Layering Rules</div>
                      <p>• <strong>Order:</strong> Lightest to richest (water humectants → active treatment → barrier cream → oil/balm). SPF always final AM step.</p>
                      <p>• <strong>Safety:</strong> Max 1 strong treatment active per night. Do not layer retinoids and acids on the same evening.</p>
                    </div>

                    {/* Morning Section */}
                    <div className="mb-4">
                      <div className="text-xs font-bold text-[#1F2A3D] border-b border-stone-200 pb-1 mb-2 flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-500" />
                        <span>Morning Protocol (AM)</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="border border-stone-200 rounded-lg p-2 text-xs flex items-start justify-between">
                          <div>
                            <span className="font-bold text-stone-900">1. Gentle Cleanse:</span> Lukewarm water rinse or hydrating milk cleanser.
                          </div>
                          <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900">2. Hydrate & Soothe:</span> Water-binding humectants.
                            </div>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {amIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {amIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900">3. Protect & Brighten:</span> Antioxidants / Vitamin C.
                            </div>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {amIngredients.filter(i => i.role === 'Antioxidant' || i.role === 'Brightener').length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {amIngredients.filter(i => i.role === 'Antioxidant' || i.role === 'Brightener').map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900">4. Barrier Moisturiser:</span> Ceramides + Fatty Acids.
                            </div>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {amIngredients.filter(i => i.role === 'Barrier Repair').length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {amIngredients.filter(i => i.role === 'Barrier Repair').map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs flex items-start justify-between">
                          <div>
                            <span className="font-bold text-stone-900">5. SPF 30+:</span> Essential daytime UV and collagen defence.
                          </div>
                          <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                        </div>
                      </div>
                    </div>

                    {/* Evening Section */}
                    <div>
                      <div className="text-xs font-bold text-[#1F2A3D] border-b border-stone-200 pb-1 mb-2 flex items-center gap-1.5">
                        <Moon className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Evening Protocol (PM)</span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="border border-stone-200 rounded-lg p-2 text-xs flex items-start justify-between">
                          <div>
                            <span className="font-bold text-stone-900">1. Cleanse:</span> Gentle cleanser to remove SPF and pollutants.
                          </div>
                          <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900">2. Hydrate & Soothe:</span> Panthenol, Centella, Glycerin.
                            </div>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {pmIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {pmIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className="font-bold text-stone-900">3. Target Treatment Active:</span> 1 active treatment only.
                            </div>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {pmIngredients.filter(i => i.role === 'Retinoid' || i.role === 'Exfoliant' || i.role === 'Breakout Support').length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {pmIngredients.filter(i => i.role === 'Retinoid' || i.role === 'Exfoliant' || i.role === 'Breakout Support').map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-stone-900">4. Barrier Cream (Ceramides / Fatty Acids)</span>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {pmBarrierCream.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {pmBarrierCream.map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-1 text-[10px] text-stone-400 italic">None assigned</div>
                          )}
                        </div>
                        <div className="border border-stone-200 rounded-lg p-2 text-xs">
                          <div className="flex items-start justify-between">
                            <span className="font-bold text-stone-900">5. Moisture Seal / Balm (Squalene / Petrolatum / Oils)</span>
                            <span className="w-3.5 h-3.5 border border-stone-300 rounded shrink-0 ml-2"></span>
                          </div>
                          {pmMoistureSeal.length > 0 ? (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {pmMoistureSeal.map(i => (
                                <span key={i.id} className="bg-stone-100 border border-stone-200 text-[10px] font-semibold px-1.5 py-0.5 rounded text-stone-800">
                                  ✓ {i.ingredient}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <div className="mt-1 text-[10px] text-stone-400 italic">None assigned</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {hasRetinoidAcidConflict && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                        ⚠️ <strong>Safety Warning:</strong> Both Retinoids and Exfoliating Acids are present in PM. Alternate on separate nights to prevent barrier compromise.
                      </div>
                    )}
                  </div>
                ) : (
                  /* Plain Text Preview */
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 font-mono text-[11px] text-stone-800 leading-relaxed whitespace-pre-wrap select-all">
                    {generateRoutineText()}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-sans">
                  {routineIngredients.length} active item{routineIngredients.length === 1 ? '' : 's'} included
                </span>
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 font-sans font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Clear All Confirmation Modal */}
        {showClearModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 select-none text-center"
            >
              <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center mx-auto mb-3 text-rose-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-[#1B263B]">
                Clear Entire Routine?
              </h3>
              <p className="text-xs text-stone-600 font-sans mt-2 leading-relaxed">
                Are you sure you want to remove all <strong>{routineIngredients.length} active items</strong> from your routine? This will reset your morning and evening protocols.
              </p>
              <div className="mt-6 flex items-center gap-2.5">
                <button
                  onClick={() => setShowClearModal(false)}
                  id="cancel_clear_routine_btn"
                  className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold font-sans transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  id="confirm_clear_routine_btn"
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold font-sans transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yes, Clear All</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hidden container specifically for browser native print (Ctrl+P / Cmd+P) */}
      <div id="printable_routine_sheet" className="hidden font-sans text-stone-900 bg-white">
        <div className="border-b-2 border-[#556953] pb-3 mb-4 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1F2A3D] font-serif">The Menopause Skincare Decoder</h1>
            <p className="text-sm font-semibold text-[#556953]">Personal Daily Routine & Layering Protocol</p>
          </div>
          <div className="text-right text-xs text-stone-500">
            <div>Generated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div>Barrier Support Protocol</div>
          </div>
        </div>

        <div className="bg-stone-50 border border-stone-200 border-l-4 border-l-[#556953] p-3 rounded mb-4 text-xs">
          <div className="font-bold text-[#556953] uppercase tracking-wide mb-1">Menopausal Skincare Layering Rules</div>
          <p>• <strong>Order of Application:</strong> Lightest to richest (humectant water serums → treatment actives → barrier cream → moisture balm/oil). SPF is always the final morning step.</p>
          <p>• <strong>Active Discipline:</strong> Only 1 strong active treatment per evening. Never layer retinoids with exfoliating acids on the same night.</p>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-bold text-[#1F2A3D] border-b border-stone-300 pb-1 mb-3">☀️ MORNING PROTOCOL (AM)</h2>
          <div className="space-y-2 text-xs">
            <div className="border border-stone-200 rounded p-2.5 flex items-center justify-between">
              <div><strong>1. Gentle Cleanse:</strong> Lukewarm water rinse or gentle hydrating milk cleanser.</div>
              <span className="w-4 h-4 border border-stone-400 rounded"></span>
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>2. Hydrate & Soothe:</strong> Water-binding humectants (Glycerin, Hyaluronic Acid, Panthenol).</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {amIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').length > 0 && (
                <div className="mt-1 text-stone-600">Assigned: {amIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').map(i => i.ingredient).join(', ')}</div>
              )}
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>3. Protect & Brighten:</strong> Daytime antioxidants (Vitamin C, Niacinamide).</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {amIngredients.filter(i => i.role === 'Antioxidant' || i.role === 'Brightener').length > 0 && (
                <div className="mt-1 text-stone-600">Assigned: {amIngredients.filter(i => i.role === 'Antioxidant' || i.role === 'Brightener').map(i => i.ingredient).join(', ')}</div>
              )}
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>4. Barrier Moisturiser:</strong> Lipid replenishment (Ceramides, Fatty Acids, Cholesterol).</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {amIngredients.filter(i => i.role === 'Barrier Repair').length > 0 && (
                <div className="mt-1 text-stone-600">Assigned: {amIngredients.filter(i => i.role === 'Barrier Repair').map(i => i.ingredient).join(', ')}</div>
              )}
            </div>
            <div className="border border-stone-200 rounded p-2.5 flex items-center justify-between">
              <div><strong>5. Sunscreen (SPF 30+):</strong> Essential daily barrier and collagen defence.</div>
              <span className="w-4 h-4 border border-stone-400 rounded"></span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-base font-bold text-[#1F2A3D] border-b border-stone-300 pb-1 mb-3">🌙 EVENING PROTOCOL (PM)</h2>
          <div className="space-y-2 text-xs">
            <div className="border border-stone-200 rounded p-2.5 flex items-center justify-between">
              <div><strong>1. Cleanse:</strong> Thorough gentle cleanse to remove SPF and pollutants.</div>
              <span className="w-4 h-4 border border-stone-400 rounded"></span>
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>2. Hydrate & Soothe:</strong> Calming hydrators on clean skin.</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {pmIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').length > 0 && (
                <div className="mt-1 text-stone-600">Assigned: {pmIngredients.filter(i => i.role === 'Hydrator' || i.role === 'Soothing').map(i => i.ingredient).join(', ')}</div>
              )}
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>3. Target Treatment Active:</strong> 1 active step only (Retinoid or Treatment Actives).</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {pmIngredients.filter(i => i.role === 'Retinoid' || i.role === 'Exfoliant' || i.role === 'Breakout Support').length > 0 && (
                <div className="mt-1 text-stone-600">Assigned: {pmIngredients.filter(i => i.role === 'Retinoid' || i.role === 'Exfoliant' || i.role === 'Breakout Support').map(i => i.ingredient).join(', ')}</div>
              )}
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>4. Barrier Cream (Ceramides / Fatty Acids):</strong> Overnight lipid restoration.</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {pmBarrierCream.length > 0 ? (
                <div className="mt-1 text-stone-600">Assigned: {pmBarrierCream.map(i => i.ingredient).join(', ')}</div>
              ) : (
                <div className="mt-1 text-stone-400 text-xs italic">None assigned</div>
              )}
            </div>
            <div className="border border-stone-200 rounded p-2.5">
              <div className="flex items-center justify-between">
                <div><strong>5. Moisture Seal / Balm (Squalene / Petrolatum / Oils):</strong> Locks moisture & halts TEWL.</div>
                <span className="w-4 h-4 border border-stone-400 rounded"></span>
              </div>
              {pmMoistureSeal.length > 0 ? (
                <div className="mt-1 text-stone-600">Assigned: {pmMoistureSeal.map(i => i.ingredient).join(', ')}</div>
              ) : (
                <div className="mt-1 text-stone-400 text-xs italic">None assigned</div>
              )}
            </div>
          </div>
        </div>

        {hasRetinoidAcidConflict && (
          <div className="p-2.5 bg-amber-50 border border-amber-300 rounded text-xs text-amber-900 mb-4">
            ⚠️ <strong>Safety Notice:</strong> Retinoids and exfoliating acids detected in PM. Alternate on separate evenings.
          </div>
        )}

        <div className="border border-dashed border-stone-300 rounded p-3 text-xs text-stone-500 min-h-[60px]">
          <strong>Personal or Clinician Notes:</strong>
        </div>
      </div>
    </motion.div>
  );
}
