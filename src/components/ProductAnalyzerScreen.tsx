/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Home, 
  Sparkles, 
  Camera, 
  Upload, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  Info, 
  Heart, 
  HelpCircle,
  FileCheck,
  RefreshCw,
  ShieldAlert,
  Sun,
  Moon,
  Check,
  Plus
} from 'lucide-react';
import { Screen, UserProfile, RoutineState, RoutineSlot } from '../types';
import { INGREDIENTS_DATA } from '../data';
import { Save } from 'lucide-react';
import { checkRoutineConflicts, ConflictAlert } from '../utils/routineConflict';

interface IngredientAnalysis {
  name: string;
  role?: string;
  isMatchInDatabase: boolean;
  matchedIngredientId: string | null;
  percentage: string | null;
}

interface RoutineStepRecommendation {
  stepNumber: number;
  stepName: string;
  productOrActive: string;
  reason: string;
}

interface AnalysisResult {
  productName: string;
  matchLevel?: 'Good Match' | 'Possible Match' | 'Use With Care';
  routinePlacement?: string;
  ingredientsFound: IngredientAnalysis[];
  overallSummary: string;
  layeringTip?: string;
  isRecoveryModeRecommended?: boolean;
  recoveryModeAdvice?: string;
  suggestedAMRoutine?: RoutineStepRecommendation[];
  suggestedPMRoutine?: RoutineStepRecommendation[];
  goodMatches: {
    ingredientNames: string[];
    bestFor: string;
  };
  useWithCare: {
    ingredientNames: string[];
    reason: string;
  };
}

interface ProductAnalyzerScreenProps {
  onNavigate: (screen: Screen) => void;
  onGoBack: () => void;
  favorites: string[];
  routine?: RoutineState;
  onUpdateRoutine?: (ingredientId: string, slot: RoutineSlot) => void;
  onToggleFavorite: (id: string) => void;
  onSelectIngredient: (id: string) => void;
  userProfile?: UserProfile;
}

export default function ProductAnalyzerScreen({
  onNavigate,
  onGoBack,
  favorites,
  routine = {},
  onUpdateRoutine,
  onToggleFavorite,
  onSelectIngredient,
  userProfile
}: ProductAnalyzerScreenProps) {
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [addedRoutineMessage, setAddedRoutineMessage] = useState<string | null>(null);

  const handleQuickAddToRoutine = (ingredientId: string, slot: RoutineSlot, ingredientName: string) => {
    if (onUpdateRoutine) {
      onUpdateRoutine(ingredientId, slot);
      setAddedRoutineMessage(`Added ${ingredientName} to your ${slot.toUpperCase()} routine!`);
      setTimeout(() => setAddedRoutineMessage(null), 3500);
    }
  };

  const getCompletePMRoutine = (
    rawSteps?: RoutineStepRecommendation[],
    productName?: string
  ): RoutineStepRecommendation[] => {
    const steps = rawSteps && rawSteps.length > 0 ? [...rawSteps] : [];

    const cleanseStep = steps.find(s => /cleanse/i.test(s.stepName + ' ' + s.productOrActive)) || {
      stepNumber: 1,
      stepName: 'Gentle Cleanse',
      productOrActive: 'Gentle hydrating or cream cleanser',
      reason: 'Removes daytime SPF, pollutants, and debris without stripping natural barrier lipids.'
    };

    const hydrateStep = steps.find(s => /hydrat|sooth|glycerin|panthenol|hyaluronic/i.test(s.stepName + ' ' + s.productOrActive)) || {
      stepNumber: 2,
      stepName: 'Hydrating & Soothing Step',
      productOrActive: 'Glycerin, Panthenol, or Hyaluronic Acid serum',
      reason: 'Water-based humectants replenish dermal moisture before applying treatment actives.'
    };

    const activeStep = steps.find(s => 
      /active|treatment|serum|retin|acid|peptid|glycolic|lactic|salicylic|niacinamide|bright/i.test(s.stepName + ' ' + s.productOrActive)
    ) || steps[1] || {
      stepNumber: 3,
      stepName: 'Target Active Treatment',
      productOrActive: productName ? `${productName} (One active only)` : 'One treatment active only (if skin is calm)',
      reason: 'Introduce 1–3 nights weekly. Avoid layering conflicting retinoids or exfoliating acids.'
    };

    const barrierStep = steps.find(s => /barrier|ceramide|fatty acid|cholesterol/i.test(s.stepName + ' ' + s.productOrActive)) || {
      stepNumber: 4,
      stepName: 'Barrier Cream (Ceramides + Fatty Acids)',
      productOrActive: 'Ceramides + Fatty Acids & Cholesterol',
      reason: 'Essential physiological lipid replenishment to restore barrier architecture and lock in hydration.'
    };

    const moistureSealStep = steps.find(s => /seal|balm|squalane|oil|petrolatum|occlusive/i.test(s.stepName + ' ' + s.productOrActive)) || {
      stepNumber: 5,
      stepName: 'Moisture Seal / Balm (Squalane etc.)',
      productOrActive: 'Squalane, facial oil, or lipid-rich barrier balm',
      reason: 'Optional final layer to seal dry, tight, or flaky patches overnight against transepidermal water loss.'
    };

    return [
      { ...cleanseStep, stepNumber: 1 },
      { ...hydrateStep, stepNumber: 2 },
      { ...activeStep, stepNumber: 3 },
      { ...barrierStep, stepNumber: 4 },
      { ...moistureSealStep, stepNumber: 5 }
    ];
  };

  const handleSaveScan = async () => {
    if (!result) return;
    setIsSaving(true);
    try {
      const savedScansStr = localStorage.getItem('boots_skin_decoder_scans');
      const savedScans = savedScansStr ? JSON.parse(savedScansStr) : [];
      
      const newScan = {
        id: 'scan_' + Date.now(),
        productName: result.productName || 'Unknown Product',
        summary: result.overallSummary || '',
        ingredients: result.ingredientsFound || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      savedScans.unshift(newScan);
      localStorage.setItem('boots_skin_decoder_scans', JSON.stringify(savedScans));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving scan", err);
    } finally {
      setIsSaving(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Dynamic comforting system message scheduler to enrich the loading state
  const startLoadingMessages = () => {
    const steps = [
      'Reading and OCR scanning your product label...',
      'Isolating active compound names from carrier fluids...',
      'Analysing concentrations and matching our 45+ database...',
      'Evaluating active combinations against your routine...',
      'Generating menopause compatibility scores...'
    ];
    let i = 0;
    setLoadingStep(steps[0]);
    const interval = setInterval(() => {
      i++;
      if (i < steps.length) {
        setLoadingStep(steps[i]);
      } else {
        clearInterval(interval);
      }
    }, 2200);
    return interval;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select or drop an image file (PNG, JPG, or JPEG).');
      return;
    }
    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageBase64(reader.result as string);
      setImagePreviewUrl(URL.createObjectURL(file));
      setResult(null); // Reset previous results on new drop
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  // Perform Gemini AI Request
  const handleAnalyze = async () => {
    setError('');
    setIsLoading(true);
    setResult(null);

    const loaderInterval = startLoadingMessages();

    try {
      const payload: { text?: string; image?: string; userProfile?: any; routine?: any } = {};
      if (activeTab === 'upload') {
        if (!imageBase64) {
          setError('Please take or upload an image of the labels first.');
          setIsLoading(false);
          clearInterval(loaderInterval);
          return;
        }
        payload.image = imageBase64;
        payload.userProfile = userProfile;
        payload.routine = routine;
      } else {
        if (!rawText.trim()) {
          setError('Please paste list of ingredients first.');
          setIsLoading(false);
          clearInterval(loaderInterval);
          return;
        }
        payload.text = rawText;
        payload.userProfile = userProfile;
        payload.routine = routine;
      }

      const response = await fetch('/api/analyze-ingredients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      let data;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(response.status === 413 ? 'Image is too large. Please try a smaller image.' : 'Server returned an invalid response.');
      }

      clearInterval(loaderInterval);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Server returned an error. Please try again.');
      }

      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to analyze product. Please verify your internet connection or API keys.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetAnalyzer = () => {
    setImageBase64('');
    setImagePreviewUrl('');
    setRawText('');
    setResult(null);
    setError('');
    setAddedRoutineMessage(null);
  };

  // Routine conflict calculation for current scanned result
  const scannedIngredientNames = result?.ingredientsFound ? result.ingredientsFound.map(i => i.name) : [];
  const routineConflicts: ConflictAlert[] = checkRoutineConflicts(scannedIngredientNames, routine);

  const handleRoutineToggle = (ingId: string, slot: RoutineSlot) => {
    if (!onUpdateRoutine) return;
    const currentSlot = routine[ingId];
    let newSlot: RoutineSlot = slot;
    if (currentSlot === slot) {
      newSlot = 'none';
    } else if ((currentSlot === 'am' && slot === 'pm') || (currentSlot === 'pm' && slot === 'am')) {
      newSlot = 'both';
    }

    onUpdateRoutine(ingId, newSlot);

    const ingObj = INGREDIENTS_DATA.find(i => i.id === ingId);
    const ingName = ingObj ? ingObj.ingredient : ingId;
    if (newSlot === 'none') {
      setAddedRoutineMessage(`Removed ${ingName} from routine.`);
    } else {
      setAddedRoutineMessage(`Updated ${ingName} in your ${newSlot.toUpperCase()} routine!`);
    }
    setTimeout(() => setAddedRoutineMessage(null), 3500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="flex flex-col min-h-full pb-8"
    >
      {/* Sticky Header */}
      <div className="bg-[#1B263B] text-stone-100 py-4 px-6 flex items-center justify-between shadow-sm sticky top-0 z-30 border-b border-stone-200/10 select-none">
        <div className="flex items-center">
          <span className="font-serif font-semibold text-base tracking-wide text-white">Smart Label Decoder</span>
        </div>
      </div>

      <div className="p-6 bg-[#FAF9F6] flex-1 flex flex-col justify-between">
        <div>
          {/* Top Title Section */}
          <div className="mb-6 select-none">
            <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-sans">
              Instant AI Cosmetic Chemistry
            </span>
            <h2 className="text-2xl font-serif font-light text-[#1B263B] mt-0.5">
              Analyze Skincare Labels
            </h2>
            <p className="text-xs text-stone-500 mt-1 font-sans leading-relaxed">
              Take a clean photo of the product back, or paste the text, and let our custom AI match it against beneficial midlife active components.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs flex gap-3 items-start font-sans"
              id="analysis_error_box"
            >
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span className="font-bold block">Analysis Impeded</span>
                <p className="mt-0.5 leading-relaxed">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Sub-Tabs Selector */}
          {!result && !isLoading && (
            <div className="flex bg-[#E2B4BD]/20 p-1 rounded-xl mb-5 select-none self-center font-sans">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'upload' ? 'bg-white text-[#1B263B] shadow-xs' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Snap or Upload Photo
              </button>
              <button
                onClick={() => setActiveTab('paste')}
                className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'paste' ? 'bg-white text-[#1B263B] shadow-xs' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                Paste Ingredient List
              </button>
            </div>
          )}

          {/* Toggle Screens depending on Analysis State */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              /* PROGRESS STATE & SKELETON */
              <motion.div
                key="loading_screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="flex flex-col gap-5 select-none"
              >
                {/* Active Progress Status Card */}
                <div className="bg-white border border-[#E2B4BD]/30 rounded-2xl p-6 py-8 shadow-3xs text-center flex flex-col items-center justify-center">
                  <div className="relative mb-4">
                    <div className="w-14 h-14 border-4 border-[#E2B4BD]/20 border-t-[#C5A059] rounded-full animate-spin"></div>
                    <Sparkles className="w-5 h-5 text-[#DAA89B] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                  </div>
                  <h4 className="text-[15px] font-bold text-[#1B263B] font-sans">Decoding Product Ingredients</h4>
                  <p className="text-xs text-[#C5A059] mt-2.5 font-mono font-medium max-w-xs animate-pulse">
                    {loadingStep || 'Initializing analyzer...'}
                  </p>
                  
                  {/* Micro Progress Bar */}
                  <div className="w-full max-w-xs bg-stone-100 h-1 rounded-full mt-4 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#C5A059] to-[#DAA89B] animate-pulse" style={{ width: '75%' }}></div>
                  </div>

                  <p className="text-[10px] text-stone-400 mt-4 font-sans">
                    Please hold on. This takes about 5-10 seconds to analyze molecular structures.
                  </p>
                </div>

                {/* Shimmering Skeleton of Upcoming Result */}
                <div className="bg-white border border-[#E2B4BD]/10 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
                  {/* Title card skeleton */}
                  <div className="flex justify-between items-center pb-3 border-b border-stone-100">
                    <div className="h-3 w-32 bg-stone-100 rounded-md"></div>
                    <div className="h-3 w-16 bg-stone-100 rounded-md"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-stone-100 rounded-md mb-1"></div>
                  <div className="h-4 w-1/2 bg-stone-100 rounded-md"></div>
                </div>

                {/* Cosmetic Science Summary skeleton */}
                <div className="bg-white border border-[#E2B4BD]/10 rounded-2xl p-5 flex flex-col gap-3 animate-pulse">
                  <div className="h-3.5 w-40 bg-stone-100 rounded-md mb-1"></div>
                  <div className="h-3 w-full bg-stone-100 rounded-md"></div>
                  <div className="h-3 w-5/6 bg-[#FAF9F6] rounded-md"></div>
                  <div className="h-3 w-4/5 bg-stone-100 rounded-md"></div>
                </div>

                {/* Detected active ingredients skeleton list */}
                <div className="flex flex-col gap-3 animate-pulse">
                  <div className="h-4 w-48 bg-stone-100 rounded-md mb-1"></div>
                  {[1, 2, 3].map((idx) => (
                    <div key={idx} className="bg-white border border-[#E2B4BD]/10 rounded-xl p-3 flex justify-between items-center">
                      <div className="flex flex-col gap-2 w-2/3">
                        <div className="h-4 w-1/3 bg-stone-100 rounded-md"></div>
                        <div className="h-3 w-5/6 bg-stone-100 rounded-md"></div>
                      </div>
                      <div className="h-6 w-16 bg-stone-100 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : result ? (
              /* RESULTS ANALYSIS PRESENTATION */
              <motion.div
                key="results_screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-5"
              >
                {/* Result Title */}
                <div className="bg-white border border-[#E2B4BD]/30 rounded-2xl p-5 shadow-3xs">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-mono">
                        Detected Product
                      </span>
                      {result.matchLevel && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase font-sans flex items-center gap-1 ${
                          result.matchLevel === 'Good Match'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : result.matchLevel === 'Possible Match'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {result.matchLevel === 'Good Match' && <CheckCircle className="w-3 h-3 text-emerald-600" />}
                          {result.matchLevel === 'Possible Match' && <Sparkles className="w-3 h-3 text-sky-600" />}
                          {result.matchLevel === 'Use With Care' && <AlertTriangle className="w-3 h-3 text-amber-700" />}
                          <span>{result.matchLevel}</span>
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveScan}
                        disabled={isSaving || saveSuccess}
                        className={`text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer ${saveSuccess ? 'text-emerald-600' : 'text-[#1B263B] hover:text-[#C5A059]'}`}
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{saveSuccess ? 'Saved!' : isSaving ? 'Saving...' : 'Save Scan'}</span>
                      </button>

                      <button
                        onClick={resetAnalyzer}
                        className="text-xs font-bold text-[#C5A059] hover:text-[#1B263B] transition-colors flex items-center gap-1 cursor-pointer"
                        id="reset_btn"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Scan Another</span>
                      </button>
                    </div>
                  </div>
                  <h3 className="text-xl font-serif font-medium text-[#1B263B] leading-snug">
                    {result.productName}
                  </h3>

                  {/* Routine Placement Recommendation */}
                  {result.routinePlacement && (
                    <div className="mt-2.5 px-3 py-1.5 bg-[#FAF9F6] border border-[#556953]/20 rounded-xl flex items-center gap-2 text-xs text-[#556953] font-sans font-medium">
                      <span className="font-bold text-[#1B263B] uppercase tracking-wider text-[10px]">Routine Fit:</span>
                      <span>{result.routinePlacement}</span>
                    </div>
                  )}

                  {/* Recovery Mode Guidance Banner if recommended */}
                  {(result.isRecoveryModeRecommended || (userProfile?.concerns && userProfile.concerns.some(c => ['stinging', 'burning', 'irritation', 'redness'].includes(c.toLowerCase())))) && (
                    <div className="mt-3.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs font-sans text-rose-900">
                      <div className="flex items-center gap-2 font-bold text-rose-950 mb-1">
                        <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Recovery Mode Active</span>
                      </div>
                      <p className="leading-relaxed text-[11.5px] text-rose-800">
                        {result.recoveryModeAdvice || "Your skin sounds reactive today, so keep the routine simple. Pause retinoids, exfoliating acids, strong vitamin C, kojic acid, and harsh breakout treatments for now. Focus on hydration, soothing, and barrier repair."}
                      </p>
                    </div>
                  )}

                  {/* Toast notification when ingredient added to routine */}
                  {addedRoutineMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-3 p-3 bg-[#556953] text-white text-xs font-sans rounded-xl font-semibold flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-300" />
                        <span>{addedRoutineMessage}</span>
                      </div>
                      <button 
                        onClick={() => onNavigate('routine_builder')} 
                        className="text-[11px] underline font-normal hover:text-stone-200 cursor-pointer"
                      >
                        View Regimen
                      </button>
                    </motion.div>
                  )}

                  {/* Profile Compatibility Section */}
                  {result.goodMatches && result.goodMatches.ingredientNames.length > 0 && (
                    <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                      <span className="text-[10px] text-emerald-800 font-bold tracking-widest uppercase font-sans flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5" /> Good match for you
                      </span>
                      <p className="text-sm font-bold text-emerald-900 mt-2">
                        Contains: {result.goodMatches.ingredientNames.join(', ')}
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        <span className="font-semibold">Best for:</span> {result.goodMatches.bestFor}
                      </p>
                    </div>
                  )}

                  {/* PROMINENT USE WITH CARE ALERT SYSTEM */}
                  {(routineConflicts.length > 0 || (result.useWithCare && result.useWithCare.ingredientNames.length > 0)) && (
                    <div className="mt-4 p-4.5 bg-amber-50/90 border-2 border-amber-300 rounded-2xl shadow-3xs flex flex-col gap-3 font-sans select-text" id="use_with_care_alert_box">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-amber-100 text-amber-800 rounded-xl shrink-0">
                          <ShieldAlert className="w-5 h-5 text-amber-700" />
                        </div>
                        <div>
                          <span className="text-[10px] text-amber-800 font-bold tracking-widest uppercase block font-sans">
                            Use With Care • Routine Compatibility Alert
                          </span>
                          <h4 className="text-xs font-bold text-amber-950 mt-0.5">
                            Mindful Active Pairing Guidance
                          </h4>
                        </div>
                      </div>

                      {/* Routine conflict specific warnings */}
                      {routineConflicts.length > 0 && (
                        <div className="flex flex-col gap-2 mt-1 border-t border-amber-200/70 pt-3">
                          {routineConflicts.map((conflict, idx) => (
                            <div key={idx} className="bg-white p-3.5 rounded-xl border border-amber-200/90 text-xs shadow-3xs">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold text-amber-950 text-xs flex items-center gap-1">
                                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  {conflict.title}
                                </span>
                                {conflict.routineSlot && (
                                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-900 text-[9px] font-bold rounded uppercase">
                                    In your {conflict.routineSlot} Routine
                                  </span>
                                )}
                              </div>
                              <p className="text-amber-900 font-medium leading-relaxed text-[11.5px] mt-1">
                                {conflict.reason}
                              </p>
                              <div className="mt-2.5 p-2.5 bg-amber-50/80 rounded-lg text-[11px] text-amber-850 leading-relaxed font-sans border border-amber-200/60">
                                <strong className="font-bold text-amber-950 block mb-0.5">Gentle Advisory:</strong>
                                {conflict.reassuringAdvice}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Product-specific useWithCare items from AI */}
                      {result.useWithCare && result.useWithCare.ingredientNames.length > 0 && (
                        <div className="bg-white p-3.5 rounded-xl border border-amber-200/90 text-xs shadow-3xs">
                          <span className="font-bold text-amber-950 block mb-1">
                            Scanned Actives to Note: {result.useWithCare.ingredientNames.join(', ')}
                          </span>
                          <p className="text-amber-900 leading-relaxed text-[11.5px]">
                            {result.useWithCare.reason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Overall Summary */}
                <div className="bg-white border border-[#E2B4BD]/30 rounded-2xl p-5 shadow-3xs">
                  <h4 className="text-xs text-[#DAA89B] font-bold tracking-widest uppercase font-sans mb-2 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#DAA89B]" />
                    <span>Cosmetic Science Summary</span>
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans mt-1 whitespace-pre-line pl-1">
                    {result.overallSummary}
                  </p>
                </div>

                {/* Layering Tip & Menopause Layering Rules */}
                <div className="bg-[#FAF9F6] border border-[#C5A059]/30 rounded-2xl p-5 shadow-3xs">
                  <h4 className="text-xs text-[#C5A059] font-bold tracking-widest uppercase font-sans mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <span>Layering Guidance & Rules</span>
                  </h4>

                  {result.layeringTip && (
                    <div className="p-3 bg-white border border-[#C5A059]/20 rounded-xl mb-3 text-xs text-[#1B263B] font-sans">
                      <span className="font-bold text-[#C5A059] block mb-0.5">Product Layering Tip:</span>
                      <p className="text-stone-700 leading-relaxed text-[11.5px]">{result.layeringTip}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-2 text-[11.5px] font-sans text-stone-600 leading-relaxed border-t border-stone-200/60 pt-3">
                    <div className="flex items-start gap-2">
                      <span className="text-[#556953] font-bold text-xs mt-0.5">✓</span>
                      <span><strong>Lightest to richest:</strong> Serums & water hydrators first, then treatment actives, then moisturiser, followed by oils/balms. SPF always goes last in the AM.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#556953] font-bold text-xs mt-0.5">✓</span>
                      <span><strong>One strong active at a time:</strong> Avoid combining retinoids with exfoliating acids in the same routine, especially on dry, sensitive, or menopausal barrier-impaired skin.</span>
                    </div>
                  </div>
                </div>

                {/* Suggested AM / PM Routine Steps if provided */}
                {((result.suggestedAMRoutine && result.suggestedAMRoutine.length > 0) || (result.suggestedPMRoutine && result.suggestedPMRoutine.length > 0)) && (
                  <div className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-3xs flex flex-col gap-4">
                    <h4 className="text-xs text-[#556953] font-bold tracking-widest uppercase font-sans flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-[#556953]" />
                      <span>Suggested Step-by-Step Regimen</span>
                    </h4>

                    {result.suggestedAMRoutine && result.suggestedAMRoutine.length > 0 && (
                      <div className="border border-amber-200/70 bg-amber-50/40 rounded-xl p-3.5">
                        <span className="text-[11px] font-bold font-sans text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                          <Sun className="w-3.5 h-3.5 text-amber-600" /> Morning (AM) Layering Order
                        </span>
                        <div className="flex flex-col gap-2">
                          {result.suggestedAMRoutine.map((step, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs font-sans">
                              <span className="w-5 h-5 rounded-full bg-amber-200/70 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                {step.stepNumber}
                              </span>
                              <div>
                                <span className="font-bold text-stone-900">{step.stepName}: </span>
                                <span className="text-[#556953] font-semibold">{step.productOrActive}</span>
                                <p className="text-[11px] text-stone-600 leading-snug mt-0.5">{step.reason}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evening PM Layering Order: Full 5-Step Protocol */}
                    {(() => {
                      const pmSteps = getCompletePMRoutine(result.suggestedPMRoutine, result.productName);
                      return (
                        <div className="border border-indigo-200/80 bg-indigo-50/50 rounded-xl p-3.5 flex flex-col gap-2.5">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="text-[11.5px] font-bold font-sans text-indigo-950 uppercase tracking-wide flex items-center gap-1.5">
                              <Moon className="w-3.5 h-3.5 text-indigo-600" /> Evening (PM) Layering Order (5 Steps)
                            </span>
                            <span className="text-[10px] bg-indigo-200/70 text-indigo-900 font-bold px-2 py-0.5 rounded-full font-mono">
                              Sequential Protocol
                            </span>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            {pmSteps.map((step, idx) => {
                              const isBarrierStep = step.stepNumber === 4 || /barrier|ceramide|fatty/i.test(step.stepName);
                              const isSealStep = step.stepNumber === 5 || /seal|balm|squalane|oil/i.test(step.stepName);
                              const isActiveStep = step.stepNumber === 3 || /active|treatment/i.test(step.stepName);

                              return (
                                <div 
                                  key={idx} 
                                  className={`flex items-start gap-2.5 text-xs font-sans p-2 rounded-lg transition-colors ${
                                    isBarrierStep 
                                      ? 'bg-emerald-50/80 border border-emerald-200/60' 
                                      : isSealStep 
                                      ? 'bg-amber-50/80 border border-amber-200/60' 
                                      : isActiveStep
                                      ? 'bg-indigo-100/50 border border-indigo-200/60'
                                      : 'bg-white/70'
                                  }`}
                                >
                                  <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${
                                    isBarrierStep 
                                      ? 'bg-emerald-200 text-emerald-900' 
                                      : isSealStep 
                                      ? 'bg-amber-200 text-amber-900' 
                                      : 'bg-indigo-200/80 text-indigo-900'
                                  }`}>
                                    {step.stepNumber}
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold text-stone-900">{step.stepName}: </span>
                                      <span className="text-indigo-950 font-semibold">{step.productOrActive}</span>
                                      {isBarrierStep && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                          Barrier Step
                                        </span>
                                      )}
                                      {isSealStep && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                                          Moisture Seal
                                        </span>
                                      )}
                                      {isActiveStep && (
                                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-300">
                                          Active Treatment
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[11px] text-stone-600 leading-snug mt-0.5">{step.reason}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Menopausal Protocol Action Shortcuts */}
                          <div className="mt-1 pt-2.5 border-t border-indigo-200/70 flex flex-col gap-1.5">
                            <span className="text-[10.5px] text-indigo-900 font-medium">
                              Need to complete Steps 4 & 5 in your Evening routine?
                            </span>
                            <div className="flex items-center gap-2 flex-wrap">
                              <button
                                onClick={() => handleQuickAddToRoutine('ceramides', 'pm', 'Ceramides')}
                                className="px-2.5 py-1.5 bg-[#556953] text-white text-[10.5px] font-bold rounded-lg shadow-3xs hover:bg-[#435341] transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" /> Add Step 4: Ceramides
                              </button>
                              <button
                                onClick={() => handleQuickAddToRoutine('squalane', 'pm', 'Squalane')}
                                className="px-2.5 py-1.5 bg-[#556953] text-white text-[10.5px] font-bold rounded-lg shadow-3xs hover:bg-[#435341] transition-all flex items-center gap-1 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" /> Add Step 5: Squalane
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Detected Ingredients Section */}
                <div id="detected_ingredients_section">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <h4 className="text-xs text-[#1B263B] font-bold tracking-wider font-sans select-none">
                      Detected Active Ingredients ({result.ingredientsFound.length})
                    </h4>
                    <span className="text-[10px] font-bold font-sans uppercase tracking-wider text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2 py-0.5 rounded-full">
                      Step 3: Target Treatment Fit
                    </span>
                  </div>

                  {/* Evening Protocol Context Notice */}
                  {(() => {
                    const hasBarrierInProduct = result.ingredientsFound.some(i => 
                      /ceramide|fatty acid|cholesterol/i.test(i.name)
                    );
                    const hasSealInProduct = result.ingredientsFound.some(i => 
                      /squalane|balm|oil|petrolatum/i.test(i.name)
                    );

                    if (!hasBarrierInProduct || !hasSealInProduct) {
                      return (
                        <div className="mb-3.5 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-amber-950 text-xs font-sans shadow-3xs">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <span className="font-bold block text-[11.5px] text-amber-950">
                                Evening Protocol Sequence Check
                              </span>
                              <p className="text-[11px] text-amber-900 mt-0.5 leading-snug">
                                Only {result.ingredientsFound.length} active ingredient{result.ingredientsFound.length === 1 ? '' : 's'} detected in this product, which correspond to your evening <strong>Step 3 (Target Active Treatment)</strong>.
                              </p>
                              <p className="text-[11px] text-amber-900 font-semibold mt-1">
                                Notice: There is no Barrier cream (ceramides + fatty acids) and no Moisture seal/Balm (squalane etc) in this scanned product.
                              </p>
                              <p className="text-[10.5px] text-stone-600 mt-1 leading-relaxed">
                                For menopausal skin, active treatments must always be sealed with lipid barrier restoration (Step 4) and an optional moisture seal (Step 5) to prevent trans-epidermal water loss and irritation.
                              </p>
                              <div className="mt-2.5 flex items-center gap-2 flex-wrap">
                                {!hasBarrierInProduct && (
                                  <button
                                    onClick={() => handleQuickAddToRoutine('ceramides', 'pm', 'Ceramides')}
                                    className="px-2.5 py-1 bg-[#556953] text-white text-[10.5px] font-bold rounded-lg shadow-3xs hover:bg-[#435341] transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Add Step 4: Ceramides to PM
                                  </button>
                                )}
                                {!hasSealInProduct && (
                                  <button
                                    onClick={() => handleQuickAddToRoutine('squalane', 'pm', 'Squalane')}
                                    className="px-2.5 py-1 bg-[#556953] text-white text-[10.5px] font-bold rounded-lg shadow-3xs hover:bg-[#435341] transition-all flex items-center gap-1 cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" /> Add Step 5: Squalane to PM
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <div className="flex flex-col gap-3">
                    {result.ingredientsFound.map((ing, k) => {
                      const isFavorited = ing.matchedIngredientId ? favorites.includes(ing.matchedIngredientId) : false;
                      const matchedId = ing.matchedIngredientId;
                      const dbRecord = matchedId ? INGREDIENTS_DATA.find(i => i.id === matchedId) : null;
                      const roleDisplay = ing.role || dbRecord?.role;
                      const currentSlot = matchedId ? routine[matchedId] : undefined;

                      return (
                        <div 
                          key={k}
                          className={`p-4 bg-white border rounded-2xl relative shadow-3xs flex flex-col justify-between transition-all ${
                            ing.isMatchInDatabase 
                              ? 'border-[#C5A059]/40 hover:border-[#C5A059]' 
                              : 'border-[#E2B4BD]/20'
                          }`}
                        >
                          <div className="pr-10">
                            {/* Heading and tag */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-serif text-[15px] font-medium text-[#1B263B]">
                                {ing.name}
                                {ing.percentage && <span className="text-[#DAA89B] font-mono text-xs ml-1">({ing.percentage})</span>}
                              </span>
                              {roleDisplay && (
                                <span className="px-2 py-0.5 bg-[#556953]/10 text-[#556953] border border-[#556953]/20 rounded-full text-[9.5px] font-bold uppercase tracking-wider font-sans">
                                  {roleDisplay}
                                </span>
                              )}
                              {ing.isMatchInDatabase && (
                                <span className="px-1.5 py-0.5 bg-[#FAF9F6] border border-[#C5A059]/20 text-[#C5A059] rounded text-[9px] font-semibold tracking-wider font-sans">
                                  In Database
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Matching action buttons */}
                          <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col gap-2.5">
                            <div className="flex items-center justify-between">
                              {ing.isMatchInDatabase && ing.matchedIngredientId ? (
                                <>
                                  <button
                                    onClick={() => onSelectIngredient(ing.matchedIngredientId!)}
                                    className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-[#1B263B] hover:text-[#C5A059] cursor-pointer"
                                    title="View original science card"
                                  >
                                    <span>View study card</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => onToggleFavorite(ing.matchedIngredientId!)}
                                    className="p-1 text-[#C5A059] hover:bg-rose-50 rounded-lg transition-all cursor-pointer flex flex-col items-center gap-0.5"
                                    title={isFavorited ? "Remove from Favorites" : "Save to Favorites"}
                                  >
                                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#C5A059] text-[#C5A059]' : 'text-stone-400'}`} />
                                    <span className={`text-[9px] font-sans font-bold leading-none ${isFavorited ? 'text-[#C5A059]' : 'text-stone-500'}`}>
                                      {isFavorited ? 'Saved' : 'Save'}
                                    </span>
                                  </button>
                                </>
                              ) : (
                                <span className="text-[10px] text-stone-400 font-sans italic">No direct database match</span>
                              )}
                            </div>

                            {/* Quick AM / PM Routine Assignment Buttons */}
                            {ing.isMatchInDatabase && ing.matchedIngredientId && onUpdateRoutine && (
                              <div className="flex items-center gap-2 pt-1 border-t border-stone-50">
                                <span className="text-[10px] text-stone-400 font-sans font-bold uppercase tracking-wider">
                                  Add to Routine:
                                </span>
                                <button
                                  onClick={() => handleRoutineToggle(ing.matchedIngredientId!, 'am')}
                                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-sans flex items-center gap-1 transition-all cursor-pointer ${
                                    currentSlot === 'am' || currentSlot === 'both'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                      : 'bg-stone-100 hover:bg-amber-50 text-stone-600 hover:text-amber-800 border border-stone-200'
                                  }`}
                                >
                                  <Sun className="w-3 h-3 text-amber-600" />
                                  <span>AM {currentSlot === 'am' || currentSlot === 'both' ? '✓' : ''}</span>
                                </button>

                                <button
                                  onClick={() => handleRoutineToggle(ing.matchedIngredientId!, 'pm')}
                                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold font-sans flex items-center gap-1 transition-all cursor-pointer ${
                                    currentSlot === 'pm' || currentSlot === 'both'
                                      ? 'bg-indigo-100 text-indigo-900 border border-indigo-300'
                                      : 'bg-stone-100 hover:bg-indigo-50 text-stone-600 hover:text-indigo-800 border border-stone-200'
                                  }`}
                                >
                                  <Moon className="w-3 h-3 text-indigo-600" />
                                  <span>PM {currentSlot === 'pm' || currentSlot === 'both' ? '✓' : ''}</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>

                <button
                  onClick={resetAnalyzer}
                  className="w-full py-3.5 mt-2 bg-[#1B263B] text-white font-sans font-bold rounded-xl text-xs cursor-pointer hover:bg-[#253447] text-center shadow-xs transition-colors select-none"
                  id="bot_scan_another"
                >
                  Decoder Label Scanner
                </button>
              </motion.div>
            ) : (
              /* TAB CHOICE LAYOUT: SNAPPING IMAGE */
              <motion.div
                key="interactive_form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col gap-4 font-sans"
              >
                {activeTab === 'upload' ? (
                  <div className="flex flex-col gap-4">
                    {/* Visual drag and drop container */}
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-3xl p-8 text-center transition-all select-none flex flex-col items-center justify-center min-h-[220px] ${
                        isDragging 
                          ? 'border-[#C5A059] bg-[#FAF9F6]' 
                          : imagePreviewUrl 
                            ? 'border-emerald-200 bg-[#E2B4BD]/5' 
                            : 'border-[#E2B4BD]/50 bg-white hover:border-[#C5A059]'
                      }`}
                    >
                      {imagePreviewUrl ? (
                        <div className="flex flex-col items-center gap-3 w-full">
                          <div className="w-24 h-24 border border-stone-200 rounded-xl overflow-hidden shadow-xs relative bg-white flex items-center justify-center">
                            <img 
                              src={imagePreviewUrl} 
                              alt="Upload preview" 
                              className="max-w-full max-h-full object-cover" 
                            />
                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-white drop-shadow-xs" />
                            </div>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#1B263B] block">Label successfully captured</span>
                            <span className="text-[10px] text-stone-500 block mt-1">Ready for decoding analysis.</span>
                          </div>
                          
                          <div className="flex gap-2 mt-2">
                            <label className="py-1.5 px-3 bg-[#1B263B] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#253447] active:scale-95 transition-all flex items-center gap-1 shadow-3xs">
                              <Camera className="w-3 h-3" />
                              <span>Retake Photo</span>
                              <input 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                capture="environment" 
                                className="hidden" 
                              />
                            </label>
                            <label className="py-1.5 px-3 bg-white border border-stone-200 text-stone-600 hover:text-[#1B263B] text-[10px] font-bold rounded-lg cursor-pointer active:scale-95 transition-all flex items-center gap-1 shadow-3xs">
                              <Upload className="w-3 h-3 text-[#DAA89B]" />
                              <span>Replace from Gallery</span>
                              <input 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-3 w-full">
                          <div className="w-14 h-14 bg-[#FAF9F6] border border-[#E2B4BD]/30 rounded-2xl flex items-center justify-center text-[#DAA89B]">
                            <Camera className="w-7 h-7 stroke-[1.4]" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-[#1B263B] block">
                              Take Photo or Upload Image
                            </span>
                            <span className="text-[10.5px] text-stone-400 block mt-1.5 leading-relaxed max-w-xs mx-auto">
                              Drag and drop your image file here, or select one of the options below.
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5 mt-3.5 flex-wrap justify-center w-full max-w-[280px]">
                            {/* Option 1: Live camera snap of labels using native capture */}
                            <label 
                              className="flex-1 py-2.5 px-4 bg-[#1B263B] text-white hover:bg-[#253447] text-[11px] font-bold rounded-xl shadow-3xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                              id="take_photo_btn"
                            >
                              <Camera className="w-3.5 h-3.5 stroke-[2]" />
                              <span>Take Photo</span>
                              <input 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                capture="environment" 
                                className="hidden" 
                                id="take_photo_input"
                              />
                            </label>

                            {/* Option 2: Gallery file picker */}
                            <label 
                              className="flex-1 py-2.5 px-4 bg-white border border-[#E2B4BD] text-[#1B263B] hover:text-[#C5A059] text-[11px] font-bold rounded-xl shadow-3xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                              id="browse_files_label"
                            >
                              <Upload className="w-3.5 h-3.5 text-[#DAA89B]" />
                              <span>Browse Files</span>
                              <input 
                                type="file" 
                                onChange={handleFileChange} 
                                accept="image/*" 
                                className="hidden" 
                                id="browse_files_input"
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* PASTE TEXT COMPLEX INPUT */
                  <div className="flex flex-col gap-1.5 select-none">
                    <label className="text-xs font-bold text-[#1B263B] flex items-center gap-1.5 pl-0.5 relative">
                      <FileText className="w-4 h-4 text-[#DAA89B]" />
                      <span>Paste Ingredients list</span>
                      <div className="relative group ml-auto flex items-center">
                        <Info className="w-4 h-4 text-stone-400 hover:text-[#C5A059] transition-colors cursor-help" />
                        <div className="absolute right-0 bottom-full mb-2 w-52 p-3 bg-[#1B263B] text-white text-[10px] leading-relaxed rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                          <div className="font-bold mb-1 text-[#DAA89B] flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Formatting Tip
                          </div>
                          For the best matching accuracy, ensure ingredients are separated by commas (e.g., "Water, Glycerin, Retinol") just like they appear on the package label.
                          <div className="absolute -bottom-1.5 right-1.5 w-3 h-3 bg-[#1B263B] rotate-45"></div>
                        </div>
                      </div>
                    </label>
                    <textarea
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="Ingredients: Water, Niacinamide, Glycerin, Ceramide NP, Squalane, Retinol, Sodium Hyaluronate..."
                      rows={6}
                      className="w-full bg-white border border-[#E2B4BD]/40 text-stone-800 text-xs rounded-2xl p-4.5 font-sans leading-relaxed resize-none focus:outline-none focus:border-[#C5A059] shadow-3xs placeholder:text-stone-400"
                    />
                  </div>
                )}

                {/* Submitting button trigger */}
                <button
                  onClick={handleAnalyze}
                  className={`w-full py-3.5 bg-[#1B263B] text-white font-sans font-bold rounded-2xl text-xs transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-xs ${
                    (activeTab === 'upload' && !imageBase64) || (activeTab === 'paste' && !rawText)
                      ? 'opacity-60 bg-stone-400 cursor-not-allowed'
                      : 'hover:bg-[#253447]'
                  }`}
                  id="ana_submit_btn"
                  disabled={(activeTab === 'upload' && !imageBase64) || (activeTab === 'paste' && !rawText)}
                >
                  <Sparkles className="w-4 h-4 text-[#DAA89B]" />
                  <span>Start Deciphering Label</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Outer bottom layout standard styling footer */}
        <div className="mt-12 pt-6 border-t border-stone-100 flex flex-col items-center gap-4 select-none">
          <div className="flex items-center justify-end w-full">
            {/* Top scrolling anchor widget */}
            <button
              onClick={() => {
                const container = document.querySelector('.overflow-y-auto');
                if (container) {
                  container.scrollTo({ top: 0, behavior: 'smooth' });
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-1 text-xs font-sans font-bold text-[#C5A059] hover:text-[#1B263B] transition-colors cursor-pointer"
              id="ana_back_to_top"
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
