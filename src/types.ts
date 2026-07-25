/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IngredientRecord {
  id: string; // convenient unique ID, e.g. "hyaluronic-acid"
  ingredient: string; // e.g. "Hyaluronic Acid"
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

export type Screen = 'welcome' | 'home' | 'concern_list' | 'concern_results' | 'ingredient_az' | 'ingredient_detail' | 'barrier_quiz' | 'barrier_results' | 'how_to_use' | 'favorites' | 'product_analyzer' | 'notes' | 'skin_profiler' | 'saved_scans';

export interface UserProfile {
  barrierType: string | null;
  concerns: string[];
  recommendedIngredients: string[];
}
