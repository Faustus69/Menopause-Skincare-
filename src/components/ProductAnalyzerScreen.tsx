/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
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
  RefreshCw
} from 'lucide-react';
import { Screen, UserProfile } from '../types';
import { INGREDIENTS_DATA } from '../data';
import { Save } from 'lucide-react';

interface IngredientAnalysis {
  name: string;
  isMatchInDatabase: boolean;
  matchedIngredientId: string | null;
  percentage: string | null;
}

interface AnalysisResult {
  productName: string;
  ingredientsFound: IngredientAnalysis[];
  overallSummary: string;
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
  onToggleFavorite: (id: string) => void;
  onSelectIngredient: (id: string) => void;
  userProfile?: UserProfile;
}

export default function ProductAnalyzerScreen({
  onNavigate,
  onGoBack,
  favorites,
  onToggleFavorite,
  onSelectIngredient,
  userProfile
}: ProductAnalyzerScreenProps) {
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const triggerCameraClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    cameraInputRef.current?.click();
  };

  // Dynamic comforting system message scheduler to enrich the loading state
  const startLoadingMessages = () => {
    const steps = [
      'Reading and OCR scanning your product label...',
      'Isolating active compound names from carrier fluids...',
      'Analysing concentrations and matching our 45+ database...',
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

  const triggerUploadClick = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    fileInputRef.current?.click();
  };

  // Perform Gemini AI Request
  const handleAnalyze = async () => {
    setError('');
    setIsLoading(true);
    setResult(null);

    const loaderInterval = startLoadingMessages();

    try {
      const payload: { text?: string; image?: string; userProfile?: any } = {};
      if (activeTab === 'upload') {
        if (!imageBase64) {
          setError('Please take or upload an image of the labels first.');
          setIsLoading(false);
          clearInterval(loaderInterval);
          return;
        }
        payload.image = imageBase64;
        payload.userProfile = userProfile;
      } else {
        if (!rawText.trim()) {
          setError('Please paste list of ingredients first.');
          setIsLoading(false);
          clearInterval(loaderInterval);
          return;
        }
        payload.text = rawText;
      payload.userProfile = userProfile;
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
        <div className="flex items-center gap-3">
          <button 
            onClick={onGoBack}
            className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
            id="ana_back_btn"
            title="Go Back"
          >
            <ArrowLeft className="w-6 h-6 text-[#DAA89B]" />
          </button>
          <span className="font-serif font-semibold text-base tracking-wide text-white">Smart Label Decoder</span>
        </div>
        
        <button 
          onClick={() => onNavigate('home')}
          className="p-1 text-stone-300 hover:text-stone-100 rounded-full transition-colors active:scale-95 cursor-pointer"
          id="ana_home_btn"
          title="Home"
        >
          <Home className="w-5 h-5 text-[#DAA89B]" />
        </button>
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
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-[#DAA89B] font-bold tracking-widest uppercase font-mono">
                      Detected Skincare Product
                    </span>
                    
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
                  <h3 className="text-xl font-serif font-medium text-[#1B263B] leading-snug">
                    {result.productName}
                  </h3>

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

                  {result.useWithCare && result.useWithCare.ingredientNames.length > 0 && (
                    <div className="mt-3 p-4 bg-rose-50 border border-rose-200 rounded-xl">
                      <span className="text-[10px] text-rose-800 font-bold tracking-widest uppercase font-sans flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" /> Use with care
                      </span>
                      <p className="text-sm font-bold text-rose-900 mt-2">
                        Also contains: {result.useWithCare.ingredientNames.join(', ')}
                      </p>
                      <p className="text-xs text-rose-700 mt-1">
                        <span className="font-semibold">Reason:</span> {result.useWithCare.reason}
                      </p>
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

                {/* Detected Ingredients Section */}
                <div>
                  <h4 className="text-xs text-[#1B263B] font-bold tracking-wider font-sans mb-3 select-none">
                    Detected Active Ingredients ({result.ingredientsFound.length})
                  </h4>

                  <div className="flex flex-col gap-3">
                    {result.ingredientsFound.map((ing, k) => {
                      const isFavorited = ing.matchedIngredientId ? favorites.includes(ing.matchedIngredientId) : false;
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
                              {ing.isMatchInDatabase && (
                                <span className="px-1.5 py-0.5 bg-[#FAF9F6] border border-[#C5A059]/20 text-[#C5A059] rounded text-[9px] font-semibold tracking-wider font-sans">
                                  In App Database
                                </span>
                              )}
                            </div>

                            
                          </div>
                          {/* Matching action buttons */}
                          <div className="mt-4 pt-3 border-t border-stone-50 flex items-center justify-between">
                            {ing.isMatchInDatabase && ing.matchedIngredientId ? (
                              <>
                                <button
                                  onClick={() => onSelectIngredient(ing.matchedIngredientId!)}
                                  className="inline-flex items-center gap-1 text-[11px] font-sans font-bold text-[#1B263B] hover:text-[#C5A059] cursor-pointer"
                                  title="View original science card"
                                >
                                  <span>View original study card</span>
                                  <ChevronRight className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => onToggleFavorite(ing.matchedIngredientId!)}
                                  className="p-1.5 text-[#C5A059] hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                                >
                                  <Heart className={`w-5 h-5 ${isFavorited ? 'fill-[#C5A059]' : ''}`} />
                                </button>
                              </>
                            ) : (
                              <span className="text-[10px] text-stone-400 font-sans italic">No direct database match</span>
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
                            <div className="relative overflow-hidden py-1.5 px-3 bg-[#1B263B] text-white text-[10px] font-bold rounded-lg cursor-pointer hover:bg-[#253447]">Retake Photo<input type="file" onChange={handleFileChange} accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>
                            <div className="relative overflow-hidden py-1.5 px-3 bg-white border border-stone-200 text-stone-600 text-[10px] font-bold rounded-lg cursor-pointer hover:text-[#1B263B]">Replace from Gallery<input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>
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
                            {/* Option 1: Live camera snap of labels */}
                            <div className="relative overflow-hidden flex-1 py-2.5 px-4 bg-[#1B263B] text-white hover:bg-[#253447] text-[11px] font-bold rounded-xl shadow-3xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"><Camera className="w-3.5 h-3.5 stroke-[2]" /><span>Take Photo</span><input type="file" onChange={handleFileChange} accept="image/*" capture="environment" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>

                            {/* Option 2: Gallery file picker */}
                            <div className="relative overflow-hidden flex-1 py-2.5 px-4 bg-white border border-[#E2B4BD] text-[#1B263B] hover:text-[#C5A059] text-[11px] font-bold rounded-xl shadow-3xs cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"><Upload className="w-3.5 h-3.5 text-[#DAA89B]" /><span>Browse Files</span><input type="file" onChange={handleFileChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" /></div>
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
          <div className="flex items-center justify-between w-full">
            {/* Nav back anchor linkage */}
            <button
              onClick={onGoBack}
              className="flex items-center gap-1.5 text-xs font-sans font-bold text-[#1B263B] hover:text-[#C5A059] transition-colors cursor-pointer"
              id="ana_footer_back"
            >
              <ArrowLeft className="w-4 h-4 text-[#DAA89B]" />
              <span>Previous Page</span>
            </button>

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
