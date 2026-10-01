/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type IngredientRole = 
  | 'Hydrator' 
  | 'Barrier Repair' 
  | 'Antioxidant' 
  | 'Brightener' 
  | 'Exfoliant' 
  | 'Retinoid' 
  | 'Breakout Support' 
  | 'Occlusive' 
  | 'Soothing' 
  | 'Formulation Support';

export interface IngredientRecord {
  id: string; // convenient unique ID, e.g. "hyaluronic-acid"
  ingredient: string; // e.g. "Hyaluronic Acid"
  role?: IngredientRole; // standardized skincare functional role
  concern: string[]; // skin concerns associated with this ingredient
  stage: string; // why menopausal skin needs it stage
  whatItIs: string;
  bestFor: string;
  whyMenopausalSkinMayNeedIt: string;
  worksWellWith: string;
  caution?: string;
  avoid?: string;
  beginnerFriendly: boolean;
  beginnerFriendlyNotes?: string;
  evidenceLevel: string;
  quickTake: string;
  worthTheSpend: string;
  worthTheSpendDetail?: string; // extra detail if needed
  effectivenessRange?: string; // new field: recommended/effective concentration
  whatToKnow?: string;        // new field: tip or precautionary note
  suitabilityAMPM?: string;   // new field: AM/PM routine suitability
}

export interface ClinicalStudyReference {
  title: string;
  journal: string;
  year?: number | string;
  authors?: string;
  studyType?: string; // e.g. "Randomized Double-Blind Placebo-Controlled"
  summary: string;
  keyOutcome?: string;
  url: string; // PubMed / DOI / medical literature link
  pmid?: string;
  doi?: string;
}

export interface ClinicalEvidenceData {
  evidenceLevel: string; // e.g. "Gold Standard" | "Strong" | "Moderate"
  consensusSummary: string;
  primaryStudy: ClinicalStudyReference;
  additionalStudies?: ClinicalStudyReference[];
  dermatologicalTakeaway: string;
}

export type Screen = 'welcome' | 'home' | 'concern_list' | 'concern_results' | 'ingredient_az' | 'ingredient_detail' | 'barrier_quiz' | 'barrier_results' | 'how_to_use' | 'favorites' | 'routine_builder' | 'product_analyzer' | 'notes' | 'skin_profiler' | 'saved_scans' | 'upgrade';

export type RoutineSlot = 'am' | 'pm' | 'both' | 'none';

export interface RoutineState {
  [ingredientId: string]: 'am' | 'pm' | 'both';
}

export interface UserProfile {
  barrierType: string | null;
  concerns: string[];
  recommendedIngredients: string[];
  isPro?: boolean;
  planType?: 'lifetime' | 'annual' | 'monthly' | 'free';
  purchasedAt?: string;
}
