/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { INGREDIENTS_DATA } from '../data';
import { RoutineState } from '../types';

export interface ConflictAlert {
  id: string;
  title: string;
  scannedActive: string;
  routineActive: string;
  routineSlot?: string;
  severity: 'caution' | 'warning';
  reason: string;
  reassuringAdvice: string;
}

// Helper to categorize ingredients by chemical active family
function getActiveFamily(nameOrId: string): 'retinoid' | 'acid' | 'vitC' | 'benzoyl' | 'other' {
  const lower = nameOrId.toLowerCase();
  if (
    lower.includes('retin') || 
    lower.includes('bakuchiol') || 
    lower.includes('adapalene') || 
    lower.includes('tretinoin')
  ) {
    return 'retinoid';
  }
  if (
    lower.includes('glycolic') || 
    lower.includes('salicylic') || 
    lower.includes('lactic') || 
    lower.includes('mandelic') || 
    lower.includes('aha') || 
    lower.includes('bha') || 
    lower.includes('pha') ||
    lower.includes('exfoliat')
  ) {
    return 'acid';
  }
  if (
    lower.includes('vitamin c') || 
    lower.includes('ascorbic') || 
    lower.includes('l-ascorbic')
  ) {
    return 'vitC';
  }
  if (lower.includes('benzoyl')) {
    return 'benzoyl';
  }
  return 'other';
}

/**
 * Checks a list of scanned/analyzed active ingredient names or IDs against an existing user routine.
 */
export function checkRoutineConflicts(
  scannedActives: string[],
  routine: RoutineState
): ConflictAlert[] {
  const alerts: ConflictAlert[] = [];

  if (!scannedActives || scannedActives.length === 0 || !routine || Object.keys(routine).length === 0) {
    return alerts;
  }

  // Get active items currently in the user's routine
  const routineItems = Object.entries(routine).map(([ingId, slot]) => {
    const matchedData = INGREDIENTS_DATA.find((item) => item.id === ingId);
    return {
      id: ingId,
      name: matchedData ? matchedData.ingredient : ingId,
      family: getActiveFamily(matchedData ? matchedData.ingredient : ingId),
      slot: slot
    };
  });

  // Categorize scanned items
  const scannedFamilies = scannedActives.map((item) => ({
    rawName: item,
    family: getActiveFamily(item)
  }));

  // Rule 1: Scanned Retinoid vs Routine Acid (or vice-versa)
  const scannedRetinoid = scannedFamilies.find((s) => s.family === 'retinoid');
  const routineAcid = routineItems.find((r) => r.family === 'acid' && (r.slot === 'pm' || r.slot === 'both'));

  if (scannedRetinoid && routineAcid) {
    alerts.push({
      id: `retinoid_acid_${routineAcid.id}`,
      title: 'Retinoid & Exfoliating Acid Overlap',
      scannedActive: scannedRetinoid.rawName,
      routineActive: routineAcid.name,
      routineSlot: routineAcid.slot.toUpperCase(),
      severity: 'caution',
      reason: `This scanned product contains a Retinoid (${scannedRetinoid.rawName}), while your Evening routine already includes an Exfoliating Acid (${routineAcid.name}).`,
      reassuringAdvice: `Don't worry! Both are wonderful for skin renewal. To prevent temporary sensitivity, avoid applying both on the same evening. Try using your acid in the morning, or alternate them on separate nights.`
    });
  }

  // Rule 2: Scanned Acid vs Routine Retinoid
  const scannedAcid = scannedFamilies.find((s) => s.family === 'acid');
  const routineRetinoid = routineItems.find((r) => r.family === 'retinoid' && (r.slot === 'pm' || r.slot === 'both'));

  if (scannedAcid && routineRetinoid) {
    alerts.push({
      id: `acid_retinoid_${routineRetinoid.id}`,
      title: 'Exfoliating Acid & Retinoid Overlap',
      scannedActive: scannedAcid.rawName,
      routineActive: routineRetinoid.name,
      routineSlot: routineRetinoid.slot.toUpperCase(),
      severity: 'caution',
      reason: `This product contains an Exfoliating Acid (${scannedAcid.rawName}), while your existing Evening routine already features a Retinoid (${routineRetinoid.name}).`,
      reassuringAdvice: `No need to stress! To keep your skin barrier calm, we recommend applying your acid during your Morning protocol, or alternating nights with your Retinoid.`
    });
  }

  // Rule 3: Scanned Retinoid vs Routine Retinoid (Double Retinoids)
  if (scannedRetinoid && routineRetinoid && scannedRetinoid.rawName.toLowerCase() !== routineRetinoid.name.toLowerCase()) {
    alerts.push({
      id: `double_retinoid_${routineRetinoid.id}`,
      title: 'Multiple Retinoid Compounds',
      scannedActive: scannedRetinoid.rawName,
      routineActive: routineRetinoid.name,
      routineSlot: routineRetinoid.slot.toUpperCase(),
      severity: 'caution',
      reason: `Your routine already has a Retinoid active (${routineRetinoid.name}), and this scanned product also contains a Retinoid (${scannedRetinoid.rawName}).`,
      reassuringAdvice: `Using multiple retinoid products at once can cause dryness or peeling. Choose just one retinoid step at a time to let your skin adapt smoothly.`
    });
  }

  // Rule 4: Scanned Acid vs Routine Acid (Double Acids)
  if (scannedAcid && routineAcid && scannedAcid.rawName.toLowerCase() !== routineAcid.name.toLowerCase()) {
    alerts.push({
      id: `double_acid_${routineAcid.id}`,
      title: 'Multiple Exfoliating Acids',
      scannedActive: scannedAcid.rawName,
      routineActive: routineAcid.name,
      routineSlot: routineAcid.slot.toUpperCase(),
      severity: 'caution',
      reason: `You already have an Exfoliating Acid (${routineAcid.name}) in your routine, and this product contains another (${scannedAcid.rawName}).`,
      reassuringAdvice: `Stacking multiple exfoliating acids can over-exfoliate delicate menopausal skin. We suggest using just one active acid step per day.`
    });
  }

  // Rule 5: Scanned Vitamin C vs Routine Retinoid (if both used in PM)
  const scannedVitC = scannedFamilies.find((s) => s.family === 'vitC');
  if (scannedVitC && routineRetinoid) {
    alerts.push({
      id: `vitc_retinoid_${routineRetinoid.id}`,
      title: 'Vitamin C & Retinoid Combination',
      scannedActive: scannedVitC.rawName,
      routineActive: routineRetinoid.name,
      routineSlot: routineRetinoid.slot.toUpperCase(),
      severity: 'caution',
      reason: `This product includes Vitamin C (${scannedVitC.rawName}), while your routine includes a Retinoid (${routineRetinoid.name}) in the evening.`,
      reassuringAdvice: `Vitamin C works best in the Morning for antioxidant protection, whereas Retinoids belong in the Evening. Timing them this way maximizes results while avoiding irritation.`
    });
  }

  return alerts;
}
