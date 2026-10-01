var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_stripe = __toESM(require("stripe"), 1);

// src/data.ts
var INGREDIENTS_DATA = [
  {
    "id": "allantoin",
    "ingredient": "ALLANTOIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1\u20132%",
    "whatItIs": "Helps calm skin that has become reactive",
    "bestFor": "Soothing \xB7 Irritation \xB7 Barrier support",
    "whyMenopausalSkinMayNeedIt": "Helps calm skin that has become reactive due to hormonal changes, actives, or environmental stress.",
    "worksWellWith": "Panthenol \xB7 Ceramides \xB7 Beta-Glucan \xB7 Oat Extract",
    "whatToKnow": "A quiet workhorse ingredient that appears in many barrier-repair formulas",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Not glamorous, but consistently effective.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "aloe_vera",
    "ingredient": "Aloe Vera",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports hydration  \xB7  redness support  \xB7  post-treatment comfort",
    "bestFor": "Hydration  \xB7  Redness support  \xB7  Post-treatment comfort",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Aloe sensitivity possible \u2022 Seal with moisturiser if dry. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "alpha_arbutin",
    "ingredient": "ALPHA ARBUTIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Advanced",
    "effectivenessRange": "1\u20132%",
    "whatItIs": "Alpha arbutin helps suppress excess pigment production",
    "bestFor": "Melasma \xB7 Age spots \xB7 Uneven skin tone",
    "whyMenopausalSkinMayNeedIt": "Hormonal pigmentation often becomes more stubborn after 45. Alpha arbutin helps suppress excess pigment production.",
    "worksWellWith": "TXA \xB7 Niacinamide \xB7 Vitamin C \xB7 N-Acetyl Glucosamine",
    "whatToKnow": "Results require patience and consistent use. Visible improvement usually takes 8\u201312 weeks of consistent use.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Moderate",
    "evidenceLevel": "Strong",
    "quickTake": "One of the safest and most reliable pigment-fighting ingredients available.",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "argan_oil",
    "ingredient": "Argan Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports plant oil  \xB7  softness  \xB7  elasticity support  \xB7  antioxidant support",
    "bestFor": "Plant oil  \xB7  Softness  \xB7  Elasticity support  \xB7  Antioxidant support",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May feel heavy if overused. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ascorbyl_palmitate",
    "ingredient": "Ascorbyl Palmitate",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports brightening support  \xB7  photodamage support  \xB7  vitamin c derivative",
    "bestFor": "Brightening support  \xB7  Photodamage support  \xB7  Vitamin C derivative",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "SPF essential \u2022 Less proven than L-ascorbic acid. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "astaxanthin",
    "ingredient": "ASTAXANTHIN",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.01\u20130.1%",
    "whatItIs": "Helps combat oxidative stress and UV-induced collagen breakdown.",
    "bestFor": "Photoaging \xB7 Wrinkles \xB7 Antioxidant protection",
    "whyMenopausalSkinMayNeedIt": "Helps combat oxidative stress and UV-induced collagen breakdown.",
    "worksWellWith": "Vitamin C \xB7 CoQ10 \xB7 Resveratrol",
    "whatToKnow": "Often paired with other antioxidants for broader environmental protection.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "yes",
    "evidenceLevel": "Emerging Strong",
    "quickTake": "One of the most powerful antioxidants in skincare",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "avena_sativa_bran_extract",
    "ingredient": "Avena Sativa Bran Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports barrier comfort  \xB7  dryness  \xB7  redness support",
    "bestFor": "Barrier comfort  \xB7  Dryness  \xB7  Redness support",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Oat sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "avena_sativa_kernel_extract",
    "ingredient": "Avena Sativa Kernel Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports barrier comfort  \xB7  itching  \xB7  dryness  \xB7  redness support",
    "bestFor": "Barrier comfort  \xB7  Itching  \xB7  Dryness  \xB7  Redness support",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Oat sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "azelaic_acid",
    "ingredient": "Azelaic Acid",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "10\u201320%",
    "whatItIs": "Multi-tasking acid that calms inflammation, reduces pigmentation and helps breakouts",
    "bestFor": "Redness, pigmentation, rosacea-prone skin, hormonal breakouts",
    "whyMenopausalSkinMayNeedIt": "Particularly useful for menopause-related redness, pigmentation and adult acne without excessive irritation",
    "worksWellWith": "Niacinamide, Ceramides, TXA",
    "whatToKnow": "Can be used morning or evening and generally layers well with barrier-support ingredients.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Usually",
    "evidenceLevel": "High",
    "quickTake": "Excellent for redness, pigmentation and hormonal skin changes",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "bakuchiol",
    "ingredient": "BAKUCHIOL",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.5\u20132%",
    "whatItIs": "Offers retinol-like benefits with less irritation",
    "bestFor": "Fine lines \xB7 Firmness \xB7 Sensitive aging skin",
    "whyMenopausalSkinMayNeedIt": "Offers retinol-like benefits with less irritation",
    "worksWellWith": "Peptides \xB7 Niacinamide \xB7 Ceramides",
    "whatToKnow": "Can often be used more frequently than retinol due to its gentler nature",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "The best retinol alternative currently available.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Retinoid"
  },
  {
    "id": "bee_venom",
    "ingredient": "BEE VENOM",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.006\u20130.05%",
    "whatItIs": "May stimulate collagen production through controlled micro-inflammatory signalling.",
    "bestFor": "Firmness \xB7 Fine lines \xB7 Skin vitality",
    "whyMenopausalSkinMayNeedIt": "May stimulate collagen production through controlled micro-inflammatory signalling.",
    "worksWellWith": "Peptides \xB7 Hyaluronic Acid\xB7 Centella",
    "whatToKnow": "Patch test carefully and avoid if you have bee-related allergies.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Moderate",
    "evidenceLevel": "Moderate",
    "quickTake": "Interesting ingredient with some promising early evidence",
    "worthTheSpend": "Depends on formulation",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "behenyl_alcohol",
    "ingredient": "Behenyl Alcohol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  thickener  \xB7  texture",
    "bestFor": "Emollient  \xB7  Thickener  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Not drying alcohol \u2022 Rare sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "bentonite",
    "ingredient": "Bentonite",
    "suitabilityAMPM": "PM or short-contact",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Oil Balance that supports clay  \xB7  oil absorption  \xB7  congestion support",
    "bestFor": "Clay  \xB7  Oil absorption  \xB7  Congestion support",
    "whyMenopausalSkinMayNeedIt": "Gently addresses adult hormonal breakouts and congested pores without stripping or dehydrating the barrier.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Can dry skin \u2022 Avoid if barrier-impaired. Guidance: Occasional use only.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Oil Balance active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Breakout Support"
  },
  {
    "id": "benzoic_acid",
    "ingredient": "Benzoic Acid",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports preservative  \xB7  ph support",
    "bestFor": "Preservative  \xB7  pH support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May sting sensitive or cracked skin. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "benzyl_alcohol",
    "ingredient": "Benzyl Alcohol",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports preservative  \xB7  solvent  \xB7  fragrance component",
    "bestFor": "Preservative  \xB7  Solvent  \xB7  Fragrance component",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance/preservative sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "benzyl_salicylate",
    "ingredient": "Benzyl Salicylate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports scent  \xB7  allergen flag",
    "bestFor": "Scent  \xB7  Allergen flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Avoid if fragrance-sensitive. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "beta_glucan",
    "ingredient": "BETA-GLUCAN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1\u20132%",
    "whatItIs": "Supports healing and hydration while calming inflammation common in hormonally stressed skin.",
    "bestFor": "Barrier repair \xB7 Redness \xB7 Hydration \xB7 Post-treatment recovery",
    "whyMenopausalSkinMayNeedIt": "Supports healing and hydration while calming inflammation common in hormonally stressed skin.",
    "worksWellWith": "Panthenol \xB7 Ceramides \xB7 HA \xB7 Centella \xB7 Ectoin",
    "whatToKnow": "Excellent after procedures, retinoids, or periods of skin irritation.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Often outperforms hyaluronic acid for soothing and repair.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "betasitosterol",
    "ingredient": "Beta-Sitosterol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports lipid support  \xB7  soothing  \xB7  skin conditioning",
    "bestFor": "Lipid support  \xB7  Soothing  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Plant sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "bifida_ferment_lysate",
    "ingredient": "Bifida Ferment Lysate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Active that supports barrier resilience  \xB7  hydration  \xB7  recovery support",
    "bestFor": "Barrier resilience  \xB7  Hydration  \xB7  Recovery support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Ferment sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Active active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "bisdiglyceryl_polyacyladipate2",
    "ingredient": "Bis-Diglyceryl Polyacyladipate-2",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  moisture sealing  \xB7  rich texture",
    "bestFor": "Emollient  \xB7  Moisture sealing  \xB7  Rich texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel heavy if congestion-prone. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "bisabolol",
    "ingredient": "Bisabolol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports redness support  \xB7  irritation comfort  \xB7  barrier support",
    "bestFor": "Redness support  \xB7  Irritation comfort  \xB7  Barrier support",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Chamomile-related sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "butylene_glycol",
    "ingredient": "Butylene Glycol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports solvent  \xB7  texture  \xB7  humectant",
    "bestFor": "Solvent  \xB7  Texture  \xB7  Humectant",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Rare glycol sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "butyrospermum_parkii_butter_shea_butter",
    "ingredient": "Butyrospermum Parkii Butter / Shea Butter",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Occlusive / Sealant that supports emollient  \xB7  barrier comfort  \xB7  softness",
    "bestFor": "Emollient  \xB7  Barrier comfort  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Prevents accelerated transepidermal water loss (TEWL) that frequently accompanies lower estrogen levels.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May feel heavy if congestion-prone. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Occlusive / Sealant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Occlusive"
  },
  {
    "id": "caffeine",
    "ingredient": "Caffeine",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "De-puffing Support that supports antioxidant  \xB7  redness support  \xB7  eye-area support",
    "bestFor": "Antioxidant  \xB7  Redness support  \xB7  Eye-area support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel drying if overused \u2022 Avoid broken skin. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "De-puffing Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "camphor",
    "ingredient": "Camphor",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Sensory Ingredient that supports cooling  \xB7  fragrance-like  \xB7  sensitivity flag",
    "bestFor": "Cooling  \xB7  Fragrance-like  \xB7  Sensitivity flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Can sting or irritate \u2022 Avoid near eyes. Guidance: Occasional only.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Sensory Ingredient active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "cannabis_sativa_seed_oil",
    "ingredient": "Cannabis Sativa Seed Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports emollient  \xB7  fatty acids  \xB7  softness",
    "bestFor": "Emollient  \xB7  Fatty acids  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May not suit all congestion-prone users. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "caprylic_capric_triglyceride",
    "ingredient": "Caprylic/Capric Triglyceride",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  softness  \xB7  texture",
    "bestFor": "Emollient  \xB7  Softness  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare congestion concern. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "caprylyl_glycol",
    "ingredient": "Caprylyl Glycol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports humectant  \xB7  preservative support  \xB7  texture",
    "bestFor": "Humectant  \xB7  Preservative support  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "caprylyl_methicone",
    "ingredient": "Caprylyl Methicone",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports silicone  \xB7  slip  \xB7  lightweight emollience",
    "bestFor": "Silicone  \xB7  Slip  \xB7  Lightweight emollience",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible with film-formers. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "carbomer",
    "ingredient": "Carbomer",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports thickener  \xB7  gel texture  \xB7  stability",
    "bestFor": "Thickener  \xB7  Gel texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible depending on formula. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "centella_asiatica",
    "ingredient": "CENTELLA ASIATICA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.5\u20135%",
    "whatItIs": "Helps repair weakened barriers and calm reactive skin often seen during hormonal changes.",
    "bestFor": "Barrier repair \xB7 Sensitivity \xB7 Redness",
    "whyMenopausalSkinMayNeedIt": "Helps repair weakened barriers and calm reactive skin often seen during hormonal changes.",
    "worksWellWith": "Panthenol \xB7 Ceramides \xB7 Beta-Glucan \xB7 Madecassoside",
    "whatToKnow": "Particularly helpful after over-exfoliation or retinoid irritation.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "One of the best ingredients for calming stressed skin",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "ceramide_np",
    "ingredient": "Ceramide NP",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports dryness  \xB7  sensitivity  \xB7  lipid support",
    "bestFor": "Dryness  \xB7  Sensitivity  \xB7  Lipid support",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Best with cholesterol and fatty acids. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ceramides",
    "ingredient": "Ceramides",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.1\u20131%",
    "whatItIs": "Skin-identical lipids that restore and protect the moisture barrier",
    "bestFor": "Dryness, sensitivity, barrier repair, irritation",
    "whyMenopausalSkinMayNeedIt": "Replaces lipids that naturally decline with age, helping menopausal skin feel less dry, tight and reactive",
    "worksWellWith": "Cholesterol, Fatty Acids, Niacinamide",
    "whatToKnow": "Look for formulas that also contain cholesterol and fatty acids",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Essential barrier-support ingredient for dry or sensitive menopausal skin",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ceteareth20",
    "ingredient": "Ceteareth-20",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emulsifier  \xB7  texture  \xB7  stability",
    "bestFor": "Emulsifier  \xB7  Texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "cetearyl_alcohol",
    "ingredient": "Cetearyl Alcohol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  fatty alcohol  \xB7  thickener  \xB7  texture",
    "bestFor": "Emollient  \xB7  Fatty alcohol  \xB7  Thickener  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Not drying alcohol \u2022 Rare sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "cetyl_alcohol",
    "ingredient": "Cetyl Alcohol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  fatty alcohol  \xB7  thickener  \xB7  softness",
    "bestFor": "Emollient  \xB7  Fatty alcohol  \xB7  Thickener  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Not drying alcohol \u2022 May feel rich in heavy formulas. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "chamomile_extract",
    "ingredient": "Chamomile Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports redness support  \xB7  antioxidant support  \xB7  barrier comfort",
    "bestFor": "Redness support  \xB7  Antioxidant support  \xB7  Barrier comfort",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Ragweed/daisy-family allergy possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "chlorella_vulgaris_extract",
    "ingredient": "Chlorella Vulgaris Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  hydration support  \xB7  skin conditioning",
    "bestFor": "Antioxidant support  \xB7  Hydration support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical/algae sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "cholesterol",
    "ingredient": "Cholesterol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports lipid support  \xB7  dryness  \xB7  barrier repair",
    "bestFor": "Lipid support  \xB7  Dryness  \xB7  Barrier repair",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Best with ceramides and fatty acids. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ci_77861_tin_oxide",
    "ingredient": "CI 77861 / Tin Oxide",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Colourant / Formulation Support that supports pigment support  \xB7  opacity  \xB7  shimmer",
    "bestFor": "Pigment support  \xB7  Opacity  \xB7  Shimmer",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Colourant / Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "ci_77891_titanium_dioxide",
    "ingredient": "CI 77891 / Titanium Dioxide",
    "suitabilityAMPM": "AM if SPF",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "UV Filter / Colourant that supports opacity  \xB7  mineral pigment  \xB7  sun protection if in spf",
    "bestFor": "Opacity  \xB7  Mineral pigment  \xB7  Sun protection if in SPF",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Only counts as UV protection in labelled SPF product. Guidance: Daily if in sunscreen.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "UV Filter / Colourant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "citric_acid",
    "ingredient": "Citric Acid",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports ph adjustment  \xB7  acidic formula support",
    "bestFor": "pH adjustment  \xB7  Acidic formula support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Acidic formula \u2022 May sting compromised barrier. Guidance: No usage guidance by itself.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "citronellol",
    "ingredient": "Citronellol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports scent  \xB7  allergen flag",
    "bestFor": "Scent  \xB7  Allergen flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Avoid if fragrance-sensitive. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "citrus_aurantium_bergamia_bergamot_peel_oil",
    "ingredient": "Citrus Aurantium Bergamia (Bergamot) Peel Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports essential oil  \xB7  scent  \xB7  botanical sensitivity flag",
    "bestFor": "Essential oil  \xB7  Scent  \xB7  Botanical sensitivity flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Essential oil \u2022 Fragrance allergens \u2022 Possible phototoxicity if not FCF. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "citrus_aurantium_dulcis_orange_peel_oil",
    "ingredient": "Citrus Aurantium Dulcis (Orange) Peel Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports essential oil  \xB7  scent  \xB7  botanical sensitivity flag",
    "bestFor": "Essential oil  \xB7  Scent  \xB7  Botanical sensitivity flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Essential oil \u2022 Fragrance allergens \u2022 Avoid if reactive. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "cocamidopropyl_betaine",
    "ingredient": "Cocamidopropyl Betaine",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports surfactant  \xB7  cleansing  \xB7  foam",
    "bestFor": "Surfactant  \xB7  Cleansing  \xB7  Foam",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Possible cleanser allergy \u2022 Rinse-off preferred. Guidance: Rinse-off use.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "coccinia_indica_fruit_extract",
    "ingredient": "Coccinia Indica Fruit Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  skin conditioning",
    "bestFor": "Antioxidant support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "cocoglucoside",
    "ingredient": "Coco-Glucoside",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports mild surfactant  \xB7  cleansing  \xB7  foam",
    "bestFor": "Mild surfactant  \xB7  Cleansing  \xB7  Foam",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Avoid over-cleansing \u2022 May still irritate reactive skin. Guidance: Rinse-off use.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "coenzyme_q10_ubiquinone",
    "ingredient": "Coenzyme Q10 (Ubiquinone)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1\u20131%",
    "whatItIs": "Antioxidant that supports cellular energy and helps reduce oxidative stress",
    "bestFor": "Fine lines, dullness, firmness, photodamage",
    "whyMenopausalSkinMayNeedIt": "Supports skin repair and energy production as natural antioxidant levels decline with age",
    "worksWellWith": "Vitamin C, Vitamin E, Peptides",
    "whatToKnow": "Best used as part of a broader antioxidant routine rather than as a standalone hero ingredient.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Strong supportive antioxidant for ageing skin, especially as part of a broader routine",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "collagen_hydrolysed",
    "ingredient": "Collagen (Hydrolysed)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Commonly used at 1\u201310% in topical formulations. Performance depends more on molecular size and formulation quality than percentage alone",
    "whatItIs": "Collagen-supporting ingredient that helps skin feel firmer, softer and more hydrated",
    "bestFor": "Dryness, dehydration, fine lines",
    "whyMenopausalSkinMayNeedIt": "Can improve skin feel and surface hydration, which may help menopausal skin feel softer, though it does not rebuild collagen deeply",
    "worksWellWith": "Hyaluronic Acid, Peptides",
    "whatToKnow": "Focus on formulation quality and supporting ingredients rather than percentage alone.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Optional",
    "quickTake": "Helpful for hydration, but not a collagen miracle",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "colloidal_oatmeal",
    "ingredient": "COLLOIDAL OATMEAL",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.5\u20131% for maintenance\n1\u20135% for more intensive barrier support",
    "whatItIs": "Helps calm inflamed, itchy, or highly reactive skin.",
    "bestFor": "Itching \xB7 Sensitivity \xB7 Barrier repair",
    "whyMenopausalSkinMayNeedIt": "Helps calm inflamed, itchy, or highly reactive skin.",
    "worksWellWith": "Ceramides \xB7 Panthenol \xB7 Allantoin",
    "whatToKnow": "Ideal for skin that feels itchy, irritated, or reactive.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Dermatology's gold standard for irritated skin.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "copper_peptides_526",
    "ingredient": "Copper Peptides",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Firmness Support that supports repair support  \xB7  elasticity  \xB7  peptide signalling",
    "bestFor": "Repair support  \xB7  Elasticity  \xB7  Peptide signalling",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Avoid low-pH acids and high-strength vitamin C in same routine. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Firmness Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "corallina_officinalis_extract",
    "ingredient": "Corallina Officinalis Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports marine extract  \xB7  hydration support  \xB7  skin conditioning",
    "bestFor": "Marine extract  \xB7  Hydration support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Algae/marine sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "curcuma_longa_turmeric_root_extract",
    "ingredient": "Curcuma Longa (Turmeric) Root Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  redness support  \xB7  soothing",
    "bestFor": "Antioxidant support  \xB7  Redness support  \xB7  Soothing",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible \u2022 Staining possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "cyclopentasiloxane",
    "ingredient": "Cyclopentasiloxane",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports volatile silicone  \xB7  slip  \xB7  smooth finish",
    "bestFor": "Volatile silicone  \xB7  Slip  \xB7  Smooth finish",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible with film-formers. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "dlimonene",
    "ingredient": "D-Limonene",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports scent  \xB7  allergen flag",
    "bestFor": "Scent  \xB7  Allergen flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Oxidation increases irritation risk. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "dicaprylyl_carbonate",
    "ingredient": "Dicaprylyl Carbonate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "It helps skin feel smoother and softer, improves spreadability, and gives products a less greasy feel. It can also help dissolve or carry other ingredients in a formula.",
    "bestFor": "It helps skin feel smoother and softer, improves spreadability, and gives products a less greasy feel. It can also help dissolve or carry other ingredients in a formula.",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May not be enough for very dry skin alone. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "lightweight emollient active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "dicaprylyl_ether",
    "ingredient": "Dicaprylyl Ether",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports lightweight emollient  \xB7  texture  \xB7  softness",
    "bestFor": "Lightweight emollient  \xB7  Texture  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May not be enough for very dry skin alone. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "dihydroxy_methylchromone",
    "ingredient": "Dihydroxy Methylchromone",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports antioxidant support  \xB7  redness support  \xB7  comfort",
    "bestFor": "Antioxidant support  \xB7  Redness support  \xB7  Comfort",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Check exact INCI spelling \u2022 Evidence emerging. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "dimethicone",
    "ingredient": "Dimethicone",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Occlusive / Sealant that supports barrier protection  \xB7  smoothness  \xB7  comfort",
    "bestFor": "Barrier protection  \xB7  Smoothness  \xB7  Comfort",
    "whyMenopausalSkinMayNeedIt": "Prevents accelerated transepidermal water loss (TEWL) that frequently accompanies lower estrogen levels.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May pill with some products. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Occlusive / Sealant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Occlusive"
  },
  {
    "id": "dimethyl_mea_dmae",
    "ingredient": "Dimethyl MEA / DMAE",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Firmness Support that supports temporary tightening  \xB7  texture  \xB7  skin conditioning",
    "bestFor": "Temporary tightening  \xB7  Texture  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Irritation possible \u2022 Do not overclaim. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Firmness Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "dimethylmethoxy_chromanol",
    "ingredient": "Dimethylmethoxy Chromanol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports photodamage support  \xB7  oxidative stress support",
    "bestFor": "Photodamage support  \xB7  Oxidative stress support",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Not SPF \u2022 Evidence emerging. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "dipotassium_glycyrrhizate",
    "ingredient": "Dipotassium Glycyrrhizate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports redness support  \xB7  sensitivity  \xB7  comfort",
    "bestFor": "Redness support  \xB7  Sensitivity  \xB7  Comfort",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Rare sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "disodium_edta",
    "ingredient": "Disodium EDTA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports chelating agent  \xB7  stability  \xB7  preservation support",
    "bestFor": "Chelating agent  \xB7  Stability  \xB7  Preservation support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "ectoin",
    "ingredient": "ECTOIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.3\u20132%",
    "whatItIs": "Ectoin protects cells from stress while reducing inflammation and dehydration.",
    "bestFor": "Barrier repair \xB7 Sensitivity \xB7 Redness \xB7 Environmental stress",
    "whyMenopausalSkinMayNeedIt": "Menopausal skin often becomes thinner, more reactive, and less resilient. Ectoin protects cells from stress while reducing inflammation and dehydration.",
    "worksWellWith": "Ceramides \xB7 Panthenol \xB7 Beta-Glucan \xB7 HA \xB7 Niacinamide",
    "whatToKnow": "Often found in newer-generation barrier repair products.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong Emerging Evidence",
    "quickTake": "One of the most exciting barrier-repair ingredients available today.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "egf_epidermal_growth_factor",
    "ingredient": "EGF / Epidermal Growth Factor",
    "suitabilityAMPM": "PM preferred or AM if formula allows",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Repair Support that supports skin recovery  \xB7  elasticity support  \xB7  barrier recovery",
    "bestFor": "Skin recovery  \xB7  Elasticity support  \xB7  Barrier recovery",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Avoid direct layering with low-pH acids \u2022 Evidence emerging. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Repair Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "elaeis_guineensis_palm_oil",
    "ingredient": "Elaeis Guineensis (Palm) Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Occlusive / Sealant that supports emollient  \xB7  softness  \xB7  lipid support",
    "bestFor": "Emollient  \xB7  Softness  \xB7  Lipid support",
    "whyMenopausalSkinMayNeedIt": "Prevents accelerated transepidermal water loss (TEWL) that frequently accompanies lower estrogen levels.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May feel heavy if congestion-prone. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Occlusive / Sealant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Occlusive"
  },
  {
    "id": "ergothioneine",
    "ingredient": "ERGOTHIONEINE",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.01\u20130.5%",
    "whatItIs": "Protects cells from environmental damage and may help preserve collagen.",
    "bestFor": "Oxidative stress \xB7 Premature aging \xB7 Inflammation",
    "whyMenopausalSkinMayNeedIt": "Protects cells from environmental damage and may help preserve collagen",
    "worksWellWith": "Vitamin C \xB7 CoQ10 \xB7 Astaxanthin",
    "whatToKnow": "No major concerns",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "",
    "evidenceLevel": "Emerging Strong",
    "quickTake": "A longevity skincare ingredient to watch closely",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ethylhexyl_palmitate",
    "ingredient": "Ethylhexyl Palmitate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  texture  \xB7  softness",
    "bestFor": "Emollient  \xB7  Texture  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel rich for congestion-prone users. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "ethylhexylglycerin",
    "ingredient": "Ethylhexylglycerin",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports preservative support  \xB7  skin conditioning  \xB7  light hydration",
    "bestFor": "Preservative support  \xB7  Skin conditioning  \xB7  Light hydration",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare preservative-support sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "evening_primrose_oil",
    "ingredient": "Evening Primrose Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports fatty acids  \xB7  gla  \xB7  redness support  \xB7  dryness",
    "bestFor": "Fatty acids  \xB7  GLA  \xB7  Redness support  \xB7  Dryness",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Use fresh oil \u2022 Oxidised oils may irritate. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "fatty_acids_linoleic_acid",
    "ingredient": "Fatty Acids / Linoleic Acid",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports lipid support  \xB7  softness  \xB7  dryness",
    "bestFor": "Lipid support  \xB7  Softness  \xB7  Dryness",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Some oils may not suit congestion-prone skin. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ferulic_acid",
    "ingredient": "Ferulic Acid",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports photodamage  \xB7  vitamin c support  \xB7  brightening support",
    "bestFor": "Photodamage  \xB7  Vitamin C support  \xB7  Brightening support",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "May irritate in low-pH formulas. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "galactoarabinan",
    "ingredient": "Galactoarabinan",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports film-former  \xB7  texture  \xB7  smoothness",
    "bestFor": "Film-former  \xB7  Texture  \xB7  Smoothness",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Rare sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "geraniol",
    "ingredient": "Geraniol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports scent  \xB7  allergen flag",
    "bestFor": "Scent  \xB7  Allergen flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Avoid if fragrance-sensitive. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "glycerin",
    "ingredient": "GLYCERIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2\u20135% \u2192 light hydration\n5\u201310% \u2192 moisturisers and serums\n10\u201320% \u2192 intensive hydration products",
    "whatItIs": "Glycerin attracts moisture into the upper layers of the skin",
    "bestFor": "Dehydration \xB7 Tightness \xB7 Barrier support",
    "whyMenopausalSkinMayNeedIt": "Natural moisturising factors decline with age, making skin less able to retain water. Glycerin attracts moisture into the upper layers of the skin.",
    "worksWellWith": "Hyaluronic Acid\xB7 Ceramides \xB7 Urea \xB7 Panthenol \xB7 Polyglutamic Acid",
    "whatToKnow": "Rarely irritating. Can feel sticky in poorly formulated products.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "One of the most underrated ingredients in skincare. Cheap, effective, and clinically proven. Often appears near the top of excellent moisturiser formulas",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "glyceryl_behenate",
    "ingredient": "Glyceryl Behenate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  thickener  \xB7  texture",
    "bestFor": "Emollient  \xB7  Thickener  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel heavy in rich formulas. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "glyceryl_oleate",
    "ingredient": "Glyceryl Oleate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  emulsifier  \xB7  cleanser mildness",
    "bestFor": "Emollient  \xB7  Emulsifier  \xB7  Cleanser mildness",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel rich in heavy formulas. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "glyceryl_stearate",
    "ingredient": "Glyceryl Stearate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  emulsifier  \xB7  texture",
    "bestFor": "Emollient  \xB7  Emulsifier  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel rich in heavy formulas. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "glycine_soja_soybean_oil",
    "ingredient": "Glycine Soja (Soybean) Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports emollient  \xB7  fatty acids  \xB7  softness  \xB7  lipid support",
    "bestFor": "Emollient  \xB7  Fatty acids  \xB7  Softness  \xB7  Lipid support",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May feel rich if congestion-prone \u2022 Soy sensitivity possible. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "glycolic_acid",
    "ingredient": "Glycolic Acid",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Advanced",
    "effectivenessRange": "5\u201310% (home use)",
    "whatItIs": "Powerful skin-renewing ingredient that helps smooth rough texture, brighten dullness and improve the look of dark spots",
    "bestFor": "Pigmentation, texture, fine lines",
    "whyMenopausalSkinMayNeedIt": "Can improve menopausal dullness, roughness and pigmentation, but may be too strong for fragile skin barriers",
    "worksWellWith": "Niacinamide (alternate use), Antioxidants",
    "whatToKnow": "Introduce slowly and avoid over-exfoliating alongside other strong actives",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Advanced users",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Powerful resurfacer, but best for resilient skin or careful use",
    "worthTheSpend": "Moderate to High",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "glycosphingolipids",
    "ingredient": "Glycosphingolipids",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports lipid support  \xB7  dryness  \xB7  sensitivity",
    "bestFor": "Lipid support  \xB7  Dryness  \xB7  Sensitivity",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Best in complete barrier formula. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "green_tea_extract",
    "ingredient": "Green Tea Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports soothing  \xB7  redness support  \xB7  inflammation support  \xB7  uv stress support",
    "bestFor": "Soothing  \xB7  Redness support  \xB7  Inflammation support  \xB7  UV stress support",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "No major conflicts. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "ha_hyaluronic_acid",
    "ingredient": "HA (Hyaluronic Acid)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.1\u20130.5% for high molecular weight HA\nUp to 2% in multi-weight HA serums",
    "whatItIs": "Deeply hydrating ingredient that helps skin feel softer, fresher and less tight",
    "bestFor": "Dryness, dehydration, fine lines",
    "whyMenopausalSkinMayNeedIt": "Helps counter menopause-related dehydration and loss of plumpness",
    "worksWellWith": "Ceramides, Glycerin, Panthenol",
    "whatToKnow": "Apply to slightly damp skin and follow with moisturiser.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Excellent hydration booster, but best paired with barrier support",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "hamamelis_virginiana_water_witch_hazel_water",
    "ingredient": "Hamamelis Virginiana Water / Witch Hazel Water",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Sensory Ingredient that supports astringent  \xB7  oil-control feel  \xB7  botanical water",
    "bestFor": "Astringent  \xB7  Oil-control feel  \xB7  Botanical water",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Astringent \u2022 May dry or sting \u2022 Check for alcohol/fragrance. Guidance: Occasional or as tolerated.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Sensory Ingredient active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "helianthus_annuus_sunflower_seed_oil",
    "ingredient": "Helianthus Annuus (Sunflower) Seed Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports emollient  \xB7  fatty acids  \xB7  softness",
    "bestFor": "Emollient  \xB7  Fatty acids  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May not suit all congestion-prone users. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "hesperidin",
    "ingredient": "Hesperidin",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Eye / Redness Support that supports microcirculation support  \xB7  dark circles  \xB7  capillary support",
    "bestFor": "Microcirculation support  \xB7  Dark circles  \xB7  Capillary support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Topical evidence emerging. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Eye / Redness Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "hydrogenated_palm_glycerides_citrate",
    "ingredient": "Hydrogenated Palm Glycerides Citrate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  stabiliser  \xB7  texture",
    "bestFor": "Emollient  \xB7  Stabiliser  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel rich in heavy formulas. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "hydrolysed_collagen",
    "ingredient": "Hydrolysed Collagen",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports softness  \xB7  film-forming  \xB7  dehydration lines",
    "bestFor": "Softness  \xB7  Film-forming  \xB7  Dehydration lines",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Do not treat as collagen-building active. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "isosorbide_dicaprylate",
    "ingredient": "Isosorbide Dicaprylate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports lightweight emollient  \xB7  texture  \xB7  softness",
    "bestFor": "Lightweight emollient  \xB7  Texture  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May not be enough alone for very dry skin. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "jania_rubens_extract",
    "ingredient": "Jania Rubens Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports marine extract  \xB7  hydration support  \xB7  skin conditioning",
    "bestFor": "Marine extract  \xB7  Hydration support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Algae/marine sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "kojic_acid",
    "ingredient": "Kojic Acid",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Brightener that supports pigmentation  \xB7  dark spots  \xB7  melasma-prone tone",
    "bestFor": "Pigmentation  \xB7  Dark spots  \xB7  Melasma-prone tone",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Sunscreen, Niacinamide, Peptides, Gentle Hydrators",
    "whatToKnow": "Irritation risk \u2022 Avoid with strong acids if sensitive. Guidance: Once daily or alternate days.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Brightener active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "lactic_acid",
    "ingredient": "Lactic Acid",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Advanced",
    "effectivenessRange": "5\u201312%",
    "whatItIs": "Gentle alpha hydroxy acid that exfoliates while also supporting hydration",
    "bestFor": "Dryness, pigmentation, uneven texture",
    "whyMenopausalSkinMayNeedIt": "Useful for dull, rough menopausal skin needing renewal without the harsher feel of stronger acids",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Urea",
    "whatToKnow": "Limit use to a few times weekly initially. Avoid over-layering with other strong acids",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Usually",
    "evidenceLevel": "High",
    "quickTake": "One of the better exfoliating acids for dry or sensitive menopausal skin",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "laminaria_digitata_extract",
    "ingredient": "Laminaria Digitata Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports algae extract  \xB7  hydration support  \xB7  antioxidant support",
    "bestFor": "Algae extract  \xB7  Hydration support  \xB7  Antioxidant support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Algae/seaweed sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "laminaria_hyperborea_extract",
    "ingredient": "Laminaria Hyperborea Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports algae extract  \xB7  hydration support  \xB7  skin conditioning",
    "bestFor": "Algae extract  \xB7  Hydration support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Algae/seaweed sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "licorice_root_extract",
    "ingredient": "LICORICE ROOT EXTRACT",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.5\u20132%",
    "whatItIs": "Helps reduce age spots and hormonal pigmentation while calming inflammation and flushing.",
    "bestFor": "Pigmentation \xB7 Redness \xB7 Sensitive skin",
    "whyMenopausalSkinMayNeedIt": "Helps reduce age spots and hormonal pigmentation while calming inflammation and flushing.",
    "worksWellWith": "TXA \xB7 Arbutin \xB7 Niacinamide \xB7 Vitamin C",
    "whatToKnow": "Particularly useful when pigmentation is accompanied by redness",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "One of the gentlest brightening ingredients available.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "limonene",
    "ingredient": "Limonene",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports scent  \xB7  allergen flag",
    "bestFor": "Scent  \xB7  Allergen flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Oxidation increases irritation risk. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "linalool",
    "ingredient": "Linalool",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports scent  \xB7  allergen flag",
    "bestFor": "Scent  \xB7  Allergen flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Oxidation increases irritation risk. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "lysolecithin",
    "ingredient": "Lysolecithin",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emulsifier  \xB7  phospholipid  \xB7  skin conditioning",
    "bestFor": "Emulsifier  \xB7  Phospholipid  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "madecassoside",
    "ingredient": "MADECASSOSIDE",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.05\u20130.5%",
    "whatItIs": "Calms inflammation and supports healing",
    "bestFor": "Redness \xB7 Sensitivity \xB7 Barrier repair \xB7 Rosacea-prone skin",
    "whyMenopausalSkinMayNeedIt": "Calms inflammation and supports healing when skin suddenly becomes reactive during hormonal shifts.",
    "worksWellWith": "Panthenol \xB7 Beta-Glucan \xB7 Ceramides \xB7 Centella",
    "whatToKnow": "Frequently paired with Centella Asiatica in calming formulations",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": 'Ideal for women who say "everything burns now."',
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "magnesium_ascorbyl_phosphate",
    "ingredient": "Magnesium Ascorbyl Phosphate",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Brightener that supports antioxidant  \xB7  vitamin c derivative  \xB7  dullness  \xB7  pigmentation support",
    "bestFor": "Antioxidant  \xB7  Vitamin C derivative  \xB7  Dullness  \xB7  Pigmentation support",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Sunscreen, Niacinamide, Peptides, Gentle Hydrators",
    "whatToKnow": "SPF essential \u2022 Use care if sensitive. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Brightener active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "malachite_extract",
    "ingredient": "Malachite Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports mineral extract  \xB7  skin conditioning  \xB7  dullness support",
    "bestFor": "Mineral extract  \xB7  Skin conditioning  \xB7  Dullness support",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Evidence emerging \u2022 Do not overclaim. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "maltodextrin",
    "ingredient": "Maltodextrin",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports binder  \xB7  stabiliser  \xB7  texture  \xB7  carrier",
    "bestFor": "Binder  \xB7  Stabiliser  \xB7  Texture  \xB7  Carrier",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "mandelic_acid",
    "ingredient": "Mandelic Acid",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Exfoliant that supports pigmentation  \xB7  texture  \xB7  dullness  \xB7  breakouts",
    "bestFor": "Pigmentation  \xB7  Texture  \xB7  Dullness  \xB7  Breakouts",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Avoid with retinoids \u2022 Avoid over-exfoliation. Guidance: 1\u20133 nights weekly.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Exfoliant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "manuka_honey",
    "ingredient": "Manuka Honey",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports humectant  \xB7  antimicrobial support  \xB7  recovery support",
    "bestFor": "Humectant  \xB7  Antimicrobial support  \xB7  Recovery support",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Avoid bee-product allergy \u2022 Sticky as mask. Guidance: Daily if in formula or occasional mask.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "marula_oil",
    "ingredient": "Marula Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Occlusive / Sealant that supports emollient  \xB7  antioxidant support  \xB7  softness  \xB7  barrier comfort",
    "bestFor": "Emollient  \xB7  Antioxidant support  \xB7  Softness  \xB7  Barrier comfort",
    "whyMenopausalSkinMayNeedIt": "Prevents accelerated transepidermal water loss (TEWL) that frequently accompanies lower estrogen levels.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May feel rich if congestion-prone. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Occlusive / Sealant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Occlusive"
  },
  {
    "id": "melatonin_topical",
    "ingredient": "Melatonin / Topical",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports overnight repair support  \xB7  environmental stress  \xB7  dullness",
    "bestFor": "Overnight repair support  \xB7  Environmental stress  \xB7  Dullness",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Night use preferred \u2022 Evidence emerging. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "melia_azadirachta_flower_extract",
    "ingredient": "Melia Azadirachta Flower Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports soothing support  \xB7  antioxidant support  \xB7  skin conditioning",
    "bestFor": "Soothing support  \xB7  Antioxidant support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "melia_azadirachta_leaf_extract",
    "ingredient": "Melia Azadirachta Leaf Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports soothing support  \xB7  antioxidant support  \xB7  blemish support",
    "bestFor": "Soothing support  \xB7  Antioxidant support  \xB7  Blemish support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "mentha_piperita_peppermint_oil",
    "ingredient": "Mentha Piperita (Peppermint) Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports essential oil  \xB7  cooling  \xB7  scent",
    "bestFor": "Essential oil  \xB7  Cooling  \xB7  Scent",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Essential oil \u2022 Can sting \u2022 Avoid if rosacea-prone or fragrance-sensitive. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "methyl_gluceth20",
    "ingredient": "Methyl Gluceth-20",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports humectant  \xB7  softness  \xB7  texture  \xB7  skin conditioning",
    "bestFor": "Humectant  \xB7  Softness  \xB7  Texture  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Rare sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "mica",
    "ingredient": "Mica",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Colourant / Formulation Support that supports shimmer  \xB7  glow  \xB7  pigment support",
    "bestFor": "Shimmer  \xB7  Glow  \xB7  Pigment support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May emphasise texture visually. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Colourant / Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "n_acetyl_glucosamine_nag",
    "ingredient": "N-ACETYL GLUCOSAMINE (NAG)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Advanced",
    "effectivenessRange": "2\u20135%",
    "whatItIs": "Helps brighten age-related pigmentation while supporting the skin's natural HA production.",
    "bestFor": "Pigmentation \xB7 Hydration \xB7 Uneven skin tone",
    "whyMenopausalSkinMayNeedIt": "Helps brighten age-related pigmentation while supporting the skin's natural HA production.",
    "worksWellWith": "Niacinamide \xB7 TXA \xB7 Arbutin \xB7 Vitamin C",
    "whatToKnow": "Frequently paired with niacinamide for enhanced brightening results.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Moderate",
    "evidenceLevel": "Strong Emerging Evidence",
    "quickTake": "One of skincare's most underrated brightening ingredients",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "niacinamide",
    "ingredient": "Niacinamide",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2\u20135% (5% is often the sweet spot)",
    "whatItIs": "Vitamin B3 that strengthens the skin barrier, improves tone and balances oil",
    "bestFor": "Dryness, redness, pigmentation, barrier repair, sensitivity",
    "whyMenopausalSkinMayNeedIt": "Supports weakened menopausal skin by improving barrier strength, reducing redness and helping uneven tone",
    "worksWellWith": "Ceramides, Panthenol, Hyaluronic Acid",
    "whatToKnow": "Usually works best at 2\u20135%; higher percentages aren't always more effective.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "One of the best all-round ingredients for menopausal skin",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "oat_extract_avena_sativa_kernel",
    "ingredient": "Oat Extract / Avena Sativa Kernel",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports itching  \xB7  barrier repair  \xB7  redness  \xB7  sensitivity",
    "bestFor": "Itching  \xB7  Barrier repair  \xB7  Redness  \xB7  Sensitivity",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Oat sensitivity possible, though uncommon. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "ocimum_basilicum_basil_flower_leaf_extract",
    "ingredient": "Ocimum Basilicum (Basil) Flower/Leaf Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  skin conditioning  \xB7  comfort",
    "bestFor": "Antioxidant support  \xB7  Skin conditioning  \xB7  Comfort",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "ocimum_sanctum_leaf_extract",
    "ingredient": "Ocimum Sanctum Leaf Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports soothing support  \xB7  antioxidant support  \xB7  skin conditioning",
    "bestFor": "Soothing support  \xB7  Antioxidant support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "octadecenedioic_acid",
    "ingredient": "Octadecenedioic Acid",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Brightener that supports pigmentation  \xB7  dark spots  \xB7  uneven tone",
    "bestFor": "Pigmentation  \xB7  Dark spots  \xB7  Uneven tone",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Sunscreen, Niacinamide, Peptides, Gentle Hydrators",
    "whatToKnow": "SPF essential \u2022 Use care with strong actives. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Brightener active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "oryza_sativa_rice_bran_extract",
    "ingredient": "Oryza Sativa (Rice Bran) Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  soothing  \xB7  skin conditioning",
    "bestFor": "Antioxidant support  \xB7  Soothing  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "palmitoyl_tetrapeptide7",
    "ingredient": "Palmitoyl Tetrapeptide-7",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Firmness Support that supports peptide  \xB7  fine lines  \xB7  elasticity  \xB7  skin quality",
    "bestFor": "Peptide  \xB7  Fine lines  \xB7  Elasticity  \xB7  Skin quality",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Avoid direct layering with strong acids if sensitive. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Firmness Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "palmitoyl_tripeptide1",
    "ingredient": "Palmitoyl Tripeptide-1",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Firmness Support that supports peptide  \xB7  fine lines  \xB7  elasticity  \xB7  repair",
    "bestFor": "Peptide  \xB7  Fine lines  \xB7  Elasticity  \xB7  Repair",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Avoid direct layering with strong acids if sensitive. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Firmness Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "panthenol_pro_vitamin_b5",
    "ingredient": "PANTHENOL (Pro-Vitamin B5)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "1\u20135%",
    "whatItIs": "Panthenol supports healing and reduces inflammation",
    "bestFor": "Barrier repair \xB7 Redness \xB7 Sensitivity \xB7 Post-retinoid recovery",
    "whyMenopausalSkinMayNeedIt": "Hormonal skin often becomes reactive and slower to repair. Panthenol supports healing and reduces inflammation.",
    "worksWellWith": "Ceramides \xB7 Beta-Glucan \xB7 Ectoin \xB7 Centella \xB7 Hyaluronic Acid",
    "whatToKnow": "A great ingredient to reach for when your skin barrier feels stressed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Every reactive menopause routine should contain some form of panthenol.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "pdrn_polydeoxyribonucleotide",
    "ingredient": "PDRN / Polydeoxyribonucleotide",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Repair Support that supports regeneration support  \xB7  recovery  \xB7  elasticity support",
    "bestFor": "Regeneration support  \xB7  Recovery  \xB7  Elasticity support",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Avoid strong acids/retinoids in same routine if sensitive \u2022 Evidence emerging. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Repair Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "peg100_stearate",
    "ingredient": "PEG-100 Stearate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emulsifier  \xB7  texture  \xB7  stability",
    "bestFor": "Emulsifier  \xB7  Texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare emulsifier sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "pentylene_glycol",
    "ingredient": "Pentylene Glycol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports solvent  \xB7  humectant  \xB7  preservative support",
    "bestFor": "Solvent  \xB7  Humectant  \xB7  Preservative support",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Rare glycol sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "copper_peptides",
    "ingredient": "Peptides",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2\u201310%",
    "whatItIs": "Skin-repairing ingredients that help support collagen and improve the look of sagging or thinning skin",
    "bestFor": "Firmness, elasticity, fine lines, repair",
    "whyMenopausalSkinMayNeedIt": "Helps support declining collagen and skin resilience without the irritation of stronger actives",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Vitamin C",
    "whatToKnow": "Look for named peptides such as Matrixyl or Copper Peptides rather than generic blends.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": 'Excellent supportive ingredient for firmness and skin quality. Look for named signal peptides such as Matrixyl or Copper Peptides. Generic "peptide blends" are harder to evaluate',
    "worthTheSpend": "Moderate to High",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "petrolatum",
    "ingredient": "Petrolatum",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Occlusive / Sealant that supports severe dryness  \xB7  barrier damage  \xB7  water-loss prevention",
    "bestFor": "Severe dryness  \xB7  Barrier damage  \xB7  Water-loss prevention",
    "whyMenopausalSkinMayNeedIt": "Prevents accelerated transepidermal water loss (TEWL) that frequently accompanies lower estrogen levels.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Can feel heavy \u2022 Use as final step. Guidance: As needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Occlusive / Sealant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Occlusive"
  },
  {
    "id": "phas_gluconolactone",
    "ingredient": "PHAs / Gluconolactone",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Exfoliant that supports hydration  \xB7  texture  \xB7  dullness  \xB7  sensitive skin",
    "bestFor": "Hydration  \xB7  Texture  \xB7  Dullness  \xB7  Sensitive skin",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Avoid over-exfoliation. Guidance: 1\u20133 nights weekly.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Exfoliant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "phenoxyethanol",
    "ingredient": "Phenoxyethanol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports preservative  \xB7  formula safety",
    "bestFor": "Preservative  \xB7  Formula safety",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Preservative sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "phenyl_trimethicone",
    "ingredient": "Phenyl Trimethicone",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports silicone  \xB7  slip  \xB7  smoothness  \xB7  shine",
    "bestFor": "Silicone  \xB7  Slip  \xB7  Smoothness  \xB7  Shine",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible with film-formers. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "phytic_acid",
    "ingredient": "Phytic Acid",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Brightener that supports chelating agent  \xB7  antioxidant support  \xB7  mild exfoliation support",
    "bestFor": "Chelating agent  \xB7  Antioxidant support  \xB7  Mild exfoliation support",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Sunscreen, Niacinamide, Peptides, Gentle Hydrators",
    "whatToKnow": "Acidic formula may sting \u2022 SPF essential. Guidance: Daily or as tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Brightener active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "pinene",
    "ingredient": "Pinene",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports terpene  \xB7  scent  \xB7  essential oil component",
    "bestFor": "Terpene  \xB7  Scent  \xB7  Essential oil component",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Fragrance allergen \u2022 Oxidation may increase irritation. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "polyacrylate_crosspolymer6",
    "ingredient": "Polyacrylate Crosspolymer-6",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports thickener  \xB7  gel texture  \xB7  stability",
    "bestFor": "Thickener  \xB7  Gel texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible depending on formula. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "polyacrylate13",
    "ingredient": "Polyacrylate-13",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports film-former  \xB7  texture  \xB7  stability",
    "bestFor": "Film-former  \xB7  Texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible with film-formers. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "polyglutamic_acid",
    "ingredient": "POLYGLUTAMIC ACID",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1\u20133%",
    "whatItIs": "Helps retain moisture and improve skin plumpness",
    "bestFor": "Dehydration \xB7 Plumping \xB7 Fine dehydration lines",
    "whyMenopausalSkinMayNeedIt": "Helps retain moisture and improve skin plumpness when natural hydration levels decline.",
    "worksWellWith": "HA \xB7 Glycerin \xB7 Ceramides \xB7 Peptides",
    "whatToKnow": "Works beautifully alongside hyaluronic acid and glycerin",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Think of it as hyaluronic acid's highly effective cousin.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "polyisobutene",
    "ingredient": "Polyisobutene",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports film-former  \xB7  emollient  \xB7  moisture sealing",
    "bestFor": "Film-former  \xB7  Emollient  \xB7  Moisture sealing",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel heavy if congestion-prone. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "polysorbate_20",
    "ingredient": "Polysorbate 20",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports solubiliser  \xB7  emulsifier  \xB7  stability",
    "bestFor": "Solubiliser  \xB7  Emulsifier  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare emulsifier sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "polysorbate_60",
    "ingredient": "Polysorbate 60",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emulsifier  \xB7  texture  \xB7  stability",
    "bestFor": "Emulsifier  \xB7  Texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare emulsifier sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "poria_cocos_extract",
    "ingredient": "Poria Cocos Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports mushroom extract  \xB7  soothing support  \xB7  antioxidant support",
    "bestFor": "Mushroom extract  \xB7  Soothing support  \xB7  Antioxidant support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical/mushroom sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "potassium_cetyl_phosphate",
    "ingredient": "Potassium Cetyl Phosphate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emulsifier  \xB7  surfactant  \xB7  sunscreen support",
    "bestFor": "Emulsifier  \xB7  Surfactant  \xB7  Sunscreen support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "potassium_sorbate",
    "ingredient": "Potassium Sorbate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports preservative  \xB7  formula safety",
    "bestFor": "Preservative  \xB7  Formula safety",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May sting sensitive or cracked skin. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "ppg12_smdi_copolymer",
    "ingredient": "PPG-12/SMDI Copolymer",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports film-former  \xB7  texture  \xB7  adhesion  \xB7  flexibility",
    "bestFor": "Film-former  \xB7  Texture  \xB7  Adhesion  \xB7  Flexibility",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling or film feel possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "ppg5ceteth20",
    "ingredient": "PPG-5-Ceteth-20",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports solubiliser  \xB7  emulsifier  \xB7  stability",
    "bestFor": "Solubiliser  \xB7  Emulsifier  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare emulsifier sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "propanediol",
    "ingredient": "Propanediol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports solvent  \xB7  humectant  \xB7  texture",
    "bestFor": "Solvent  \xB7  Humectant  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Rare glycol sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "propolis",
    "ingredient": "PROPOLIS",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "1\u201310%",
    "whatItIs": "Supports repair and hydration while calming irritation",
    "bestFor": "Healing \xB7 Redness \xB7 Barrier support",
    "whyMenopausalSkinMayNeedIt": "Supports repair and hydration while calming irritation.",
    "worksWellWith": "Honey \xB7 Centella \xB7 Panthenol",
    "whatToKnow": "Best avoided by anyone sensitive to bee-derived ingredients.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Excellent for stressed, irritated skin.",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "propolis_extract",
    "ingredient": "Propolis Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports antimicrobial support  \xB7  redness support  \xB7  breakout support",
    "bestFor": "Antimicrobial support  \xB7  Redness support  \xB7  Breakout support",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Avoid bee-product allergy. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "pullulan",
    "ingredient": "Pullulan",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports film-former  \xB7  temporary smoothing  \xB7  tightening feel",
    "bestFor": "Film-former  \xB7  Temporary smoothing  \xB7  Tightening feel",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Temporary effect only \u2022 May feel tight. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "pumice",
    "ingredient": "Pumice",
    "suitabilityAMPM": "PM or occasional rinse-off",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Physical Exfoliant that supports surface smoothing  \xB7  scrub particle",
    "bestFor": "Surface smoothing  \xB7  Scrub particle",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Abrasive \u2022 Avoid if reactive or using acids/retinoids. Guidance: Occasional only.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Physical Exfoliant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "quartz",
    "ingredient": "Quartz",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Physical Exfoliant / Formulation Support that supports mineral particle  \xB7  texture  \xB7  scrub potential",
    "bestFor": "Mineral particle  \xB7  Texture  \xB7  Scrub potential",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Abrasive if scrub \u2022 Avoid irritated skin. Guidance: Occasional only if exfoliating.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Physical Exfoliant / Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "resveratrol",
    "ingredient": "Resveratrol",
    "suitabilityAMPM": "PM preferred or AM under SPF",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports dullness  \xB7  environmental stress  \xB7  firmness support",
    "bestFor": "Dullness  \xB7  Environmental stress  \xB7  Firmness support",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Light/air stability matters \u2022 Use care with strong actives. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "retinal_retinaldehyde",
    "ingredient": "Retinal / Retinaldehyde",
    "suitabilityAMPM": "PM only",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Advanced",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Retinoid that supports wrinkles  \xB7  firmness  \xB7  texture  \xB7  pigmentation",
    "bestFor": "Wrinkles  \xB7  Firmness  \xB7  Texture  \xB7  Pigmentation",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Avoid with acids \u2022 Avoid pregnancy/breastfeeding \u2022 Irritation risk. Guidance: Start 1\u20132 nights weekly.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Use caution / advance slowly",
    "evidenceLevel": "High",
    "quickTake": "Retinoid active supporting menopausal skin resilience.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Retinoid"
  },
  {
    "id": "retinol",
    "ingredient": "Retinol",
    "suitabilityAMPM": "PM only",
    "concern": [
      "Sagging & Wrinkles",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Advanced",
    "effectivenessRange": "0.1\u20131%",
    "whatItIs": "Vitamin A derivative that speeds skin renewal and boosts collagen",
    "bestFor": "Wrinkles, firmness, pigmentation, texture, hormonal breakouts",
    "whyMenopausalSkinMayNeedIt": "Helps address collagen loss, thinning skin, slower cell turnover and uneven tone common during menopause",
    "worksWellWith": "Ceramides, Peptides, Niacinamide",
    "whatToKnow": "Start with 2\u20133 nights per week and increase gradually as tolerated",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Advanced users",
    "evidenceLevel": "Strong",
    "quickTake": "Gold-standard anti-ageing ingredient, but best introduced gradually",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Retinoid"
  },
  {
    "id": "rosehip_oil",
    "ingredient": "Rosehip Oil",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports plant oil  \xB7  softness  \xB7  uneven tone support  \xB7  antioxidant support",
    "bestFor": "Plant oil  \xB7  Softness  \xB7  Uneven tone support  \xB7  Antioxidant support",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May irritate very sensitive skin \u2022 Use care with retinoids. Guidance: Daily or alternate nights if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "rosmarinus_officinalis_rosemary_leaf_extract",
    "ingredient": "Rosmarinus Officinalis (Rosemary) Leaf Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  skin conditioning",
    "bestFor": "Antioxidant support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "rosmarinus_officinalis_rosemary_leaf_oil",
    "ingredient": "Rosmarinus Officinalis (Rosemary) Leaf Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Fragrance / Sensitivity Flag that supports essential oil  \xB7  scent  \xB7  botanical sensitivity flag",
    "bestFor": "Essential oil  \xB7  Scent  \xB7  Botanical sensitivity flag",
    "whyMenopausalSkinMayNeedIt": "Adds sensory texture; use with awareness if hormonal skin is experiencing increased sensitivity.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Essential oil \u2022 Fragrance allergens \u2022 Avoid if reactive. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Sensory / Caution",
    "quickTake": "Fragrance / Sensitivity Flag active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "saccharomyces_ferment_lysate_filtrate",
    "ingredient": "Saccharomyces Ferment Lysate Filtrate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Active that supports ferment  \xB7  hydration support  \xB7  barrier comfort",
    "bestFor": "Ferment  \xB7  Hydration support  \xB7  Barrier comfort",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Ferment sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Active active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "saccharomyces_rice_ferment_filtrate",
    "ingredient": "Saccharomyces/Rice Ferment Filtrate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports ferment  \xB7  hydration support  \xB7  radiance",
    "bestFor": "Ferment  \xB7  Hydration support  \xB7  Radiance",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Ferment sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "salicylic_acid_bha",
    "ingredient": "Salicylic Acid (BHA)",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.5\u20132%",
    "whatItIs": "Oil-soluble exfoliating acid that clears pores and reduces inflammation",
    "bestFor": "Hormonal breakouts, clogged pores, rough texture",
    "whyMenopausalSkinMayNeedIt": "Consistency matters more than strength for long-term congestion control.",
    "worksWellWith": "Niacinamide, Ceramides",
    "whatToKnow": "Consistency matters more than strength for long-term congestion control.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Usually",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Excellent for breakouts and congestion, but balance with barrier support",
    "worthTheSpend": "Moderate to High",
    "worthTheSpendDetail": "",
    "role": "Exfoliant"
  },
  {
    "id": "salix_nigra_willow_bark_extract",
    "ingredient": "Salix Nigra (Willow) Bark Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Breakout Support that supports salicylate botanical  \xB7  mild exfoliation support  \xB7  oiliness",
    "bestFor": "Salicylate botanical  \xB7  Mild exfoliation support  \xB7  Oiliness",
    "whyMenopausalSkinMayNeedIt": "Gently addresses adult hormonal breakouts and congested pores without stripping or dehydrating the barrier.",
    "worksWellWith": "Niacinamide, Zinc PCA, Gentle Barrier Creams",
    "whatToKnow": "Salicylate sensitivity \u2022 Avoid over-exfoliation. Guidance: Daily or as tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Breakout Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Breakout Support"
  },
  {
    "id": "sclerotium_gum",
    "ingredient": "Sclerotium Gum",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports thickener  \xB7  gel texture  \xB7  stability",
    "bestFor": "Thickener  \xB7  Gel texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sea_buckthorn_oil",
    "ingredient": "SEA BUCKTHORN OIL",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "1\u201310%",
    "whatItIs": "Rich in omega fatty acids that support a lipid-depleted barrier",
    "bestFor": "Dryness \xB7 Barrier repair \xB7 Antioxidant support",
    "whyMenopausalSkinMayNeedIt": "Rich in omega fatty acids that support a lipid-depleted barrier.",
    "worksWellWith": "Ceramides \xB7 Squalane \xB7 Vitamin E",
    "whatToKnow": "Particularly beneficial for very dry, lipid-depleted skin.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Wonderful for very dry post-menopausal skin.",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "silica_dimethyl_silylate",
    "ingredient": "Silica Dimethyl Silylate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports oil absorption  \xB7  thickener  \xB7  texture",
    "bestFor": "Oil absorption  \xB7  Thickener  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel drying or mattifying. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "simmondsia_chinensis_jojoba_seed_oil",
    "ingredient": "Simmondsia Chinensis (Jojoba) Seed Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Barrier Repair that supports emollient  \xB7  wax esters  \xB7  softness  \xB7  moisture sealing",
    "bestFor": "Emollient  \xB7  Wax esters  \xB7  Softness  \xB7  Moisture sealing",
    "whyMenopausalSkinMayNeedIt": "Replenishes diminishing skin lipids and fortifies the barrier against midlife dryness and barrier permeability.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May not suit every congestion-prone user. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Barrier Repair active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "sodium_acrylates_copolymer",
    "ingredient": "Sodium Acrylates Copolymer",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports film-former  \xB7  thickener  \xB7  texture",
    "bestFor": "Film-former  \xB7  Thickener  \xB7  Texture",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Pilling possible with film-formers. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sodium_benzoate",
    "ingredient": "Sodium Benzoate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports preservative  \xB7  formula safety",
    "bestFor": "Preservative  \xB7  Formula safety",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May sting sensitive or cracked skin. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sodium_carbonate",
    "ingredient": "Sodium Carbonate",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports ph adjustment  \xB7  formula balance",
    "bestFor": "pH adjustment  \xB7  Formula balance",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Finished formula may be alkaline or drying. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sodium_chloride",
    "ingredient": "Sodium Chloride",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports thickener  \xB7  viscosity control  \xB7  stability",
    "bestFor": "Thickener  \xB7  Viscosity control  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May sting cracked skin \u2022 Can feel drying in some cleansers. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sodium_hyaluronate",
    "ingredient": "Sodium Hyaluronate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports hyaluronic acid salt  \xB7  plumpness  \xB7  dehydration support",
    "bestFor": "Hyaluronic acid salt  \xB7  Plumpness  \xB7  Dehydration support",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Seal with moisturiser in dry environments. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "sodium_hydroxide",
    "ingredient": "Sodium Hydroxide",
    "suitabilityAMPM": "Depends on formula",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports ph adjustment  \xB7  formula balance",
    "bestFor": "pH adjustment  \xB7  Formula balance",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Judge finished formula pH \u2022 Not an active. Guidance: No usage guidance needed.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sodium_lactate",
    "ingredient": "Sodium Lactate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports natural moisturising factor  \xB7  dehydration  \xB7  barrier support",
    "bestFor": "Natural moisturising factor  \xB7  Dehydration  \xB7  Barrier support",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "May sting cracked or irritated skin. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "sodium_pca",
    "ingredient": "Sodium PCA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports natural moisturising factor  \xB7  dehydration  \xB7  tightness",
    "bestFor": "Natural moisturising factor  \xB7  Dehydration  \xB7  Tightness",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Seal with moisturiser in dry environments. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "sodium_phytate",
    "ingredient": "Sodium Phytate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports chelating agent  \xB7  stability  \xB7  preservation support",
    "bestFor": "Chelating agent  \xB7  Stability  \xB7  Preservation support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "solanum_melongena_eggplant_fruit_extract",
    "ingredient": "Solanum Melongena (Eggplant) Fruit Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  skin conditioning  \xB7  comfort",
    "bestFor": "Antioxidant support  \xB7  Skin conditioning  \xB7  Comfort",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "sorbitan_isostearate",
    "ingredient": "Sorbitan Isostearate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emulsifier  \xB7  texture  \xB7  spreadability",
    "bestFor": "Emulsifier  \xB7  Texture  \xB7  Spreadability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Rare emulsifier sensitivity possible. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "sorbitol",
    "ingredient": "Sorbitol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports humectant  \xB7  softness  \xB7  dehydration support",
    "bestFor": "Humectant  \xB7  Softness  \xB7  Dehydration support",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Seal with moisturiser in dry environments. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "spirulina_platensis_extract",
    "ingredient": "Spirulina Platensis Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports algae extract  \xB7  antioxidant support  \xB7  skin conditioning",
    "bestFor": "Algae extract  \xB7  Antioxidant support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Algae sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "squalane",
    "ingredient": "Squalane",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "1\u20135% for lightweight hydration\n5\u201315% for richer moisturisers\n100% in facial oils",
    "whatItIs": "Lightweight skin-replenishing oil that mimics natural skin lipids",
    "bestFor": "Dryness, sensitivity, fine lines, barrier support",
    "whyMenopausalSkinMayNeedIt": "Helps replace lost softness and comfort as sebum production declines during menopause",
    "worksWellWith": "Retinol, Ceramides, Vitamin C",
    "whatToKnow": "Can be used alone or mixed into moisturiser for extra comfort.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Simple, effective ingredient for restoring softness and comfort",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Occlusive"
  },
  {
    "id": "stearyl_glycyrrhetinate",
    "ingredient": "Stearyl Glycyrrhetinate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Soothing that supports licorice derivative  \xB7  redness support  \xB7  barrier comfort",
    "bestFor": "Licorice derivative  \xB7  Redness support  \xB7  Barrier comfort",
    "whyMenopausalSkinMayNeedIt": "Calms flare-ups, reactive flushing, and inflammatory redness triggered by hormonal fluctuations.",
    "worksWellWith": "Panthenol, Allantoin, Oat Extract, Beta-Glucan",
    "whatToKnow": "Rare sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Soothing active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Soothing"
  },
  {
    "id": "sulfur",
    "ingredient": "Sulfur",
    "suitabilityAMPM": "PM or targeted use",
    "concern": [
      "Sagging & Wrinkles",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Advanced",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Breakout Support that supports oiliness  \xB7  congestion  \xB7  inflamed spots",
    "bestFor": "Oiliness  \xB7  Congestion  \xB7  Inflamed spots",
    "whyMenopausalSkinMayNeedIt": "Gently addresses adult hormonal breakouts and congested pores without stripping or dehydrating the barrier.",
    "worksWellWith": "Niacinamide, Zinc PCA, Gentle Barrier Creams",
    "whatToKnow": "Drying \u2022 Avoid overuse with acids/retinoids. Guidance: As needed or short contact.",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Use caution / advance slowly",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Breakout Support active supporting menopausal skin resilience.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Breakout Support"
  },
  {
    "id": "teprenone",
    "ingredient": "Teprenone",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Firmness Support that supports skin resilience  \xB7  ageing support  \xB7  fine-line appearance",
    "bestFor": "Skin resilience  \xB7  Ageing support  \xB7  Fine-line appearance",
    "whyMenopausalSkinMayNeedIt": "Helps counteract the rapid decline in collagen and elastin by encouraging cellular renewal and tensile resilience.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Centella Asiatica",
    "whatToKnow": "Evidence emerging \u2022 Do not overclaim. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Firmness Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "tetrahexyldecyl_ascorbate",
    "ingredient": "Tetrahexyldecyl Ascorbate",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Brightener that supports oil-soluble vitamin c derivative  \xB7  antioxidant  \xB7  dullness  \xB7  pigmentation support",
    "bestFor": "Oil-soluble vitamin C derivative  \xB7  Antioxidant  \xB7  Dullness  \xB7  Pigmentation support",
    "whyMenopausalSkinMayNeedIt": "Improves uneven skin tone, age-related discoloration, and dull texture caused by sluggish epidermal turnover.",
    "worksWellWith": "Sunscreen, Niacinamide, Peptides, Gentle Hydrators",
    "whatToKnow": "SPF essential \u2022 Less proven than L-ascorbic acid. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Brightener active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "tetrasodium_glutamate_diacetate",
    "ingredient": "Tetrasodium Glutamate Diacetate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports chelating agent  \xB7  stability  \xB7  preservation support",
    "bestFor": "Chelating agent  \xB7  Stability  \xB7  Preservation support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "tocopherol",
    "ingredient": "Tocopherol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports vitamin e  \xB7  barrier support  \xB7  photodamage support  \xB7  softness",
    "bestFor": "Vitamin E  \xB7  Barrier support  \xB7  Photodamage support  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Can feel rich in oily formulas. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "tocopheryl_acetate",
    "ingredient": "Tocopheryl Acetate",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports vitamin e derivative  \xB7  skin conditioning  \xB7  softness",
    "bestFor": "Vitamin E derivative  \xB7  Skin conditioning  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Less direct antioxidant activity than tocopherol. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "tocotrienols",
    "ingredient": "Tocotrienols",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports vitamin e family  \xB7  photodamage support  \xB7  skin conditioning",
    "bestFor": "Vitamin E family  \xB7  Photodamage support  \xB7  Skin conditioning",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Evidence emerging \u2022 Not SPF. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "tremella_mushroom_tremella_fuciformis",
    "ingredient": "Tremella Mushroom / Tremella Fuciformis",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports polysaccharide  \xB7  plumpness  \xB7  smoothness  \xB7  dehydration support",
    "bestFor": "Polysaccharide  \xB7  Plumpness  \xB7  Smoothness  \xB7  Dehydration support",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Seal with moisturiser. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "triolein",
    "ingredient": "Triolein",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports emollient  \xB7  lipid  \xB7  softness  \xB7  barrier comfort",
    "bestFor": "Emollient  \xB7  Lipid  \xB7  Softness  \xB7  Barrier comfort",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "May feel rich if congestion-prone. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "txa_tranexamic_acid",
    "ingredient": "TXA (Tranexamic Acid)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2\u20135%",
    "whatItIs": "Brightening ingredient that reduces melasma and stubborn pigmentation",
    "bestFor": "Melasma, pigmentation, redness",
    "whyMenopausalSkinMayNeedIt": "Especially useful for hormonally triggered pigmentation and uneven skin tone during menopause",
    "worksWellWith": "Niacinamide, Vitamin C, Azelaic Acid",
    "whatToKnow": "Often performs best when combined with niacinamide or alpha arbutin",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "One of the best ingredients for persistent hormonal pigmentation",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Brightener"
  },
  {
    "id": "urea",
    "ingredient": "UREA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Advanced",
    "effectivenessRange": "5\u201310% (face), 10\u201320% (body)",
    "whatItIs": "Urea hydrates while gently resurfacing skin.",
    "bestFor": "Extreme dryness \xB7 Crepey skin \xB7 Rough texture \xB7 Barrier support",
    "whyMenopausalSkinMayNeedIt": "Declining estrogen often causes severe dryness and texture changes. Urea hydrates while gently resurfacing skin.",
    "worksWellWith": "Ceramides \xB7 Glycerin \xB7 Panthenol \xB7 Squalane",
    "whatToKnow": "Lower strengths hydrate; higher strengths also help smooth rough texture",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Advanced users",
    "evidenceLevel": "Strong",
    "quickTake": "One of dermatology's best-kept secrets for mature skin.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "vaccinium_macrocarpon_cranberry_fruit_extract",
    "ingredient": "Vaccinium Macrocarpon (Cranberry) Fruit Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Supportive Botanical that supports antioxidant support  \xB7  skin conditioning  \xB7  dullness support",
    "bestFor": "Antioxidant support  \xB7  Skin conditioning  \xB7  Dullness support",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Botanical sensitivity possible. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Supportive Botanical active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Barrier Repair"
  },
  {
    "id": "vegetable_oil",
    "ingredient": "Vegetable Oil",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports generic emollient  \xB7  softness  \xB7  moisture sealing",
    "bestFor": "Generic emollient  \xB7  Softness  \xB7  Moisture sealing",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "Vague ingredient \u2022 May feel heavy if congestion-prone. Guidance: Daily or as needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Formulation Support"
  },
  {
    "id": "vitamin_c",
    "ingredient": "Vitamin C (L-Ascorbic Acid)",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening"
    ],
    "stage": "Start Here",
    "effectivenessRange": "10\u201320%",
    "whatItIs": "Antioxidant that brightens skin, supports collagen and protects from environmental damage",
    "bestFor": "Pigmentation, dullness, firmness, photodamage",
    "whyMenopausalSkinMayNeedIt": "Helps tackle dullness, age spots and collagen decline while protecting vulnerable skin from oxidative stress",
    "worksWellWith": "Vitamin E, Ferulic Acid, Sunscreen",
    "whatToKnow": "Morning use is often preferred due to antioxidant benefits. Can irritate sensitive skin; unstable forms may be less effective",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Usually",
    "evidenceLevel": "High",
    "quickTake": "Powerful brightening ingredient that can help improve dullness, dark spots and skin vitality",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "vitamin_e_tocopherol",
    "ingredient": "Vitamin E / Tocopherol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening",
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Antioxidant that supports barrier support  \xB7  softness  \xB7  photodamage",
    "bestFor": "Barrier support  \xB7  Softness  \xB7  Photodamage",
    "whyMenopausalSkinMayNeedIt": "Protects vulnerable menopausal skin from oxidative stress, environmental assault, and accelerated collagen breakdown.",
    "worksWellWith": "Vitamin E, Sunscreen, Niacinamide, Ferulic Acid",
    "whatToKnow": "Can feel rich in oily formulas. Guidance: Daily.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Antioxidant active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Antioxidant"
  },
  {
    "id": "willow_bark_extract",
    "ingredient": "Willow Bark Extract",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair",
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Breakout Support that supports mild exfoliation support  \xB7  oiliness  \xB7  redness support",
    "bestFor": "Mild exfoliation support  \xB7  Oiliness  \xB7  Redness support",
    "whyMenopausalSkinMayNeedIt": "Gently addresses adult hormonal breakouts and congested pores without stripping or dehydrating the barrier.",
    "worksWellWith": "Niacinamide, Zinc PCA, Gentle Barrier Creams",
    "whatToKnow": "Salicylate sensitivity \u2022 Avoid over-exfoliation. Guidance: Daily or as tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Breakout Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Breakout Support"
  },
  {
    "id": "xanthan_gum",
    "ingredient": "Xanthan Gum",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Formulation Support that supports thickener  \xB7  gel texture  \xB7  stability",
    "bestFor": "Thickener  \xB7  Gel texture  \xB7  Stability",
    "whyMenopausalSkinMayNeedIt": "Supports overall skin comfort, texture smoothness, and formula efficacy for menopausal skin.",
    "worksWellWith": "Complementary skincare actives and gentle moisturising bases",
    "whatToKnow": "No major conflicts. Guidance: No usage guidance needed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Formulation Support",
    "quickTake": "Formulation Support active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "xylitol",
    "ingredient": "Xylitol",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports humectant  \xB7  dehydration support  \xB7  softness",
    "bestFor": "Humectant  \xB7  Dehydration support  \xB7  Softness",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Seal with moisturiser in dry environments. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "xylitylglucoside",
    "ingredient": "Xylitylglucoside",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "Standard formulation concentration",
    "whatItIs": "Hydrator that supports sugar-derived humectant  \xB7  hydration complex  \xB7  barrier comfort",
    "bestFor": "Sugar-derived humectant  \xB7  Hydration complex  \xB7  Barrier comfort",
    "whyMenopausalSkinMayNeedIt": "Draws vital moisture into hormone-depleted skin layers to restore bounce, cushion, and hydration balance.",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Niacinamide, Squalane",
    "whatToKnow": "Seal with moisturiser. Guidance: Daily if tolerated.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Hydrator active supporting menopausal skin resilience.",
    "worthTheSpend": "Moderate",
    "worthTheSpendDetail": "",
    "role": "Hydrator"
  },
  {
    "id": "zinc_pca",
    "ingredient": "ZINC PCA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.1\u20131%",
    "whatItIs": "Helps with oil regulation and enlatged pores",
    "bestFor": "Hormonal acne \xB7 Oil regulation \xB7 Enlarged pores",
    "whyMenopausalSkinMayNeedIt": "Particularly useful for menopausal skin that feels both dry and breakout-prone.",
    "worksWellWith": "Niacinamide \xB7 Azelaic Acid \xB7 Salicylic Acid",
    "whatToKnow": "Can feel drying if overused.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Excellent for the menopausal woman battling both dryness and breakouts.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": "",
    "role": "Breakout Support"
  }
];

// server.ts
var import_config = require("dotenv/config");
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json({ limit: "50mb" }));
  app.use(import_express.default.urlencoded({ extended: true, limit: "50mb" }));
  app.post("/api/analyze-ingredients", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: "Gemini API key is not configured. Please add GEMINI_API_KEY to your Secrets panel inside AI Studio Settings."
        });
      }
      const { text, image, userProfile, routine } = req.body;
      if (!text && !image) {
        return res.status(400).json({
          error: "Please provide either raw ingredients text or an image payload to analyze."
        });
      }
      const ai = new import_genai.GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      const knownIngredientsContext = INGREDIENTS_DATA.map((ing) => ({
        id: ing.id,
        name: ing.ingredient,
        role: ing.role || "Barrier Repair",
        stage: ing.stage,
        suitabilityAMPM: ing.suitabilityAMPM || "AM or PM",
        whatToKnow: ing.whatToKnow || ""
      }));
      const routineContext = routine && Object.keys(routine).length > 0 ? Object.entries(routine).map(([ingId, slot]) => {
        const ing = INGREDIENTS_DATA.find((i) => i.id === ingId);
        return ing ? `${ing.ingredient} [Role: ${ing.role || "Active"}, Stage: ${ing.stage}] (${String(slot).toUpperCase()} Routine)` : `${ingId} (${String(slot).toUpperCase()})`;
      }).join(", ") : "None currently set";
      const profileContext = userProfile ? `
User Profile Context:
- Barrier Type: ${userProfile.barrierType || "Unknown"} (Moisture-Impaired, Inflammation-Reactive, Lipid-Depleted, or Unknown)
- Current Concerns: ${userProfile.concerns?.join(", ") || "None specified"}
- Saved / Recommended Ingredients: ${userProfile.recommendedIngredients?.join(", ") || "None"}
- Existing Daily Routine: ${routineContext}
` : `Existing Daily Routine: ${routineContext}`;
      const textPrompt = `You are the Menopausal Skin Routine and Ingredient-Layering Assistant.
Your job is to create simple, safe AM/PM skincare layering guidance using only the ingredient information provided in the app\u2019s ingredient database. Do not invent ingredient benefits, percentages, warnings, or product claims that are not supported by the database.

The app is designed for menopausal and perimenopausal skin, where the main priorities are barrier support, dryness, sensitivity, pigmentation, dullness, loss of firmness, fine lines, hormonal breakouts, and congestion.

${profileContext}

CORE RULES:
1. Always prioritise barrier comfort first, especially for menopausal skin.
2. Build routines by product role, not by random ingredient lists.
   Ingredient roles: Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, or Formulation Support.
3. Recommend a maximum of 3 core ingredients plus 1 treatment focus unless the user asks for more detail.
4. Keep advice short, practical, and easy to understand.
5. Do not say an ingredient is present at an effective percentage unless the product clearly states the percentage.
6. If ingredient strength is unknown, say \u201Ccontains\u201D or \u201Clook for,\u201D not \u201Cthis will deliver.\u201D
7. Never diagnose skin conditions or promise medical results.
8. For severe acne, rosacea, eczema, melasma, sudden irritation, infection, swelling, or persistent symptoms, recommend advice from a qualified clinician.
9. If the user is pregnant, breastfeeding, trying to conceive, or unsure, avoid retinoids and advise checking with a clinician.

LAYERING SAFETY RULES:
- Do not recommend retinoids and exfoliating acids in the same routine for sensitive, dry, reactive, or menopausal barrier-impaired skin.
- Do not recommend multiple exfoliating acids in the same routine.
- Do not recommend strong acids with kojic acid for sensitive or reactive skin.
- Do not recommend strong vitamin C, acids, and retinoids together in one routine.
- If the user reports stinging, burning, new redness, peeling, or irritation, activate Recovery Mode.
  In Recovery Mode: pause retinoids, exfoliating acids, kojic acid, strong vitamin C, and aggressive breakout treatments.
  Recommend soothing and barrier ingredients only (Glycerin, Panthenol, Ceramides, Cholesterol, Fatty Acids, Squalane, Dimethicone, Petrolatum, Colloidal Oatmeal, Allantoin, Centella Asiatica, Madecassoside, low-strength Niacinamide if tolerated).
- Exfoliating acids should usually be suggested 1\u20133 nights weekly, not every night.
- Retinoids should usually start 1\u20132 nights weekly and increase only if tolerated.
- SPF is essential every morning, especially when using retinoids, acids, vitamin C, azelaic acid, tranexamic acid, alpha arbutin, kojic acid, or pigmentation-focused routines.

WHEN ANALYSING THIS SCANNED PRODUCT:
1. Identify product name/brand or use "Skincare Treatment".
2. Match detected ingredients against the Core Database (${knownIngredientsContext.length} ingredients).
   Assign each detected ingredient its role (Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, or Formulation Support).
3. Evaluate compatibility:
   - "Good Match": Product supports barrier health and matches user concerns without conflicting with current routine.
   - "Possible Match": Beneficial, but requires mindful placement or alternate-day scheduling.
   - "Use With Care": Contains ingredients that may irritate the user's barrier type or clash with their existing routine.
4. Recommend where the product fits in the routine: AM, PM, treatment step, moisturiser step, SPF step, occasional use (1\u20133 nights/week), or avoid for now.
5. Provide a practical Layering Tip.
6. Provide structured AM and PM suggested step sequences based on layering order:
   - Morning Routine (AM): 
     Step 1: Gentle Cleanse or water rinse
     Step 2: Hydrating / soothing water-based step (Glycerin, Panthenol, Hyaluronic Acid)
     Step 3: Antioxidant or brightening step (Vitamin C, Niacinamide)
     Step 4: Barrier moisturiser (Ceramides, Squalane)
     Step 5: Moisture seal / oil (only if needed on dry areas)
     Step 6: SPF (Broad Spectrum Sunscreen - essential final step)
   - Evening Protocol Sequence (PM) MUST ALWAYS CONTAIN ALL 5 STEPS in exact order:
     Step 1: Cleanse (Gentle thorough cleanse to remove SPF/makeup)
     Step 2: Hydrating / soothing step (Glycerin, Panthenol, Hyaluronic Acid)
     Step 3: One treatment active only (if calm) \u2014 place scanned product here if it is an active treatment/serum
     Step 4: Barrier Cream (Ceramides + Fatty Acids & Cholesterol) \u2014 essential to restore barrier lipids
     Step 5: Moisture Seal / Balm (Squalane, lipid oil, or barrier balm) \u2014 seals dry/tight areas overnight.
     NEVER return only 2 or 3 steps for the evening protocol. All 5 steps must be explicitly listed so the user sees the complete regimen.`;
      const contents = [];
      if (image) {
        const regex = /^data:(image\/\w+);base64,(.+)$/;
        const matches = image.match(regex);
        if (matches) {
          const mimeType = matches[1];
          const data = matches[2];
          contents.push({
            inlineData: { mimeType, data }
          });
        } else {
          return res.status(400).json({ error: "Invalid base64 image data URL format." });
        }
      }
      contents.push({ text: textPrompt + (text ? `

Analyzable Raw Ingredient Text:
${text}` : "") });
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: import_genai.Type.OBJECT,
            properties: {
              productName: {
                type: import_genai.Type.STRING,
                description: "Brand name or product title, e.g. 'Olay Regenerist Serum' or 'Skincare Treatment'"
              },
              matchLevel: {
                type: import_genai.Type.STRING,
                enum: ["Good Match", "Possible Match", "Use With Care"],
                description: "Compatibility classification for this user"
              },
              routinePlacement: {
                type: import_genai.Type.STRING,
                description: "Recommended placement, e.g. 'AM Routine \xB7 Hydrate / Soothe step' or 'PM Routine \xB7 Treatment step (1\u20132 nights weekly)'"
              },
              overallSummary: {
                type: import_genai.Type.STRING,
                description: "Warm, reassuring, practical cosmetic review using the specified tone and rules"
              },
              goodMatches: {
                type: import_genai.Type.OBJECT,
                properties: {
                  ingredientNames: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING }, description: "Helpful ingredients detected" },
                  bestFor: { type: import_genai.Type.STRING, description: "Short summary of benefits supported by database" }
                },
                required: ["ingredientNames", "bestFor"]
              },
              useWithCare: {
                type: import_genai.Type.OBJECT,
                properties: {
                  ingredientNames: { type: import_genai.Type.ARRAY, items: { type: import_genai.Type.STRING }, description: "Caution ingredients or potential conflicts" },
                  reason: { type: import_genai.Type.STRING, description: "Gentle reason based on user's barrier type or existing routine" }
                },
                required: ["ingredientNames", "reason"]
              },
              layeringTip: {
                type: import_genai.Type.STRING,
                description: "One simple, practical, relevant layering tip adhering to assistant guidelines"
              },
              isRecoveryModeRecommended: {
                type: import_genai.Type.BOOLEAN,
                description: "True if user reports stinging, burning, or product is unsuitable for compromised barrier"
              },
              recoveryModeAdvice: {
                type: import_genai.Type.STRING,
                description: "Recovery mode message if applicable"
              },
              ingredientsFound: {
                type: import_genai.Type.ARRAY,
                description: "Array of detected skincare ingredients with role and database linkage",
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    name: { type: import_genai.Type.STRING },
                    role: { type: import_genai.Type.STRING, description: "Ingredient role (Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, Formulation Support)" },
                    isMatchInDatabase: { type: import_genai.Type.BOOLEAN },
                    matchedIngredientId: { type: import_genai.Type.STRING },
                    percentage: { type: import_genai.Type.STRING }
                  },
                  required: ["name", "isMatchInDatabase"]
                }
              },
              suggestedAMRoutine: {
                type: import_genai.Type.ARRAY,
                description: "Step-by-step morning layering guide",
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    stepNumber: { type: import_genai.Type.INTEGER },
                    stepName: { type: import_genai.Type.STRING },
                    productOrActive: { type: import_genai.Type.STRING },
                    reason: { type: import_genai.Type.STRING }
                  },
                  required: ["stepNumber", "stepName", "productOrActive", "reason"]
                }
              },
              suggestedPMRoutine: {
                type: import_genai.Type.ARRAY,
                description: "Step-by-step evening layering guide",
                items: {
                  type: import_genai.Type.OBJECT,
                  properties: {
                    stepNumber: { type: import_genai.Type.INTEGER },
                    stepName: { type: import_genai.Type.STRING },
                    productOrActive: { type: import_genai.Type.STRING },
                    reason: { type: import_genai.Type.STRING }
                  },
                  required: ["stepNumber", "stepName", "productOrActive", "reason"]
                }
              }
            },
            required: [
              "productName",
              "matchLevel",
              "routinePlacement",
              "overallSummary",
              "goodMatches",
              "useWithCare",
              "layeringTip",
              "ingredientsFound",
              "suggestedAMRoutine",
              "suggestedPMRoutine"
            ]
          }
        }
      });
      const responseText = response.text || "{}";
      const analysisResult = JSON.parse(responseText.trim());
      if (!Array.isArray(analysisResult.suggestedPMRoutine) || analysisResult.suggestedPMRoutine.length < 4) {
        const existingSteps = Array.isArray(analysisResult.suggestedPMRoutine) ? analysisResult.suggestedPMRoutine : [];
        const activeStep = existingSteps.find(
          (s) => /active|treatment|serum|retin|acid|peptid/i.test(s.stepName || "") || /active|treatment|serum|retin|acid|peptid/i.test(s.productOrActive || "")
        ) || existingSteps[1] || {
          stepNumber: 3,
          stepName: "Target Active Treatment",
          productOrActive: analysisResult.productName || "One treatment active only (if skin is calm)",
          reason: "Introduce slowly 1\u20133 nights weekly to avoid sensitizing menopausal skin."
        };
        analysisResult.suggestedPMRoutine = [
          {
            stepNumber: 1,
            stepName: "Gentle Cleanse",
            productOrActive: "Gentle hydrating or cream cleanser",
            reason: "Removes daily impurities, pollutants, and SPF without disrupting barrier lipids."
          },
          {
            stepNumber: 2,
            stepName: "Hydrating / Soothing Step",
            productOrActive: "Glycerin, Panthenol, or Hyaluronic Acid serum",
            reason: "Water-based humectants replenish dermal hydration before applying treatment."
          },
          {
            stepNumber: 3,
            stepName: activeStep.stepName || "Target Active Treatment",
            productOrActive: activeStep.productOrActive || analysisResult.productName || "One treatment active only",
            reason: activeStep.reason || "Use maximum 1\u20133 nights weekly; avoid layering conflicting acids or retinoids."
          },
          {
            stepNumber: 4,
            stepName: "Barrier Cream",
            productOrActive: "Ceramides + Fatty Acids & Cholesterol",
            reason: "Essential physiological lipid replacement to seal the skin barrier and prevent trans-epidermal moisture loss."
          },
          {
            stepNumber: 5,
            stepName: "Moisture Seal / Balm",
            productOrActive: "Squalane, lipid oil, or rich barrier balm",
            reason: "Optional final occlusive layer to soothe dry or tight areas overnight."
          }
        ];
      } else {
        const hasBarrierCream = analysisResult.suggestedPMRoutine.some(
          (s) => /barrier|ceramide|fatty acid|moisturi/i.test(s.stepName + " " + s.productOrActive)
        );
        const hasMoistureSeal = analysisResult.suggestedPMRoutine.some(
          (s) => /seal|balm|squalane|oil|occlusive/i.test(s.stepName + " " + s.productOrActive)
        );
        if (!hasBarrierCream) {
          analysisResult.suggestedPMRoutine.splice(3, 0, {
            stepNumber: 4,
            stepName: "Barrier Cream",
            productOrActive: "Ceramides + Fatty Acids & Cholesterol",
            reason: "Crucial for menopausal skin to replenish lipid architecture and fortify against moisture loss."
          });
        }
        if (!hasMoistureSeal) {
          analysisResult.suggestedPMRoutine.push({
            stepNumber: analysisResult.suggestedPMRoutine.length + 1,
            stepName: "Moisture Seal / Balm",
            productOrActive: "Squalane, facial oil, or occlusive balm",
            reason: "Final protective lipid seal for extra dry, sensitive, or flaky patches overnight."
          });
        }
        analysisResult.suggestedPMRoutine.forEach((step, idx) => {
          step.stepNumber = idx + 1;
        });
      }
      res.json({ success: true, result: analysisResult });
    } catch (error) {
      console.error("Ingredient analysis error:", error);
      res.status(500).json({
        error: error?.message || "An error occurred during ingredient analysis. Please try again."
      });
    }
  });
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { plan = "lifetime", userEmail, origin } = req.body;
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      const baseHost = origin || req.headers.referer?.replace(/\/$/, "") || "https://wisebloom.co.uk";
      const plansData = {
        lifetime: {
          name: "Wise Bloom Pro \u2022 Lifetime Access Pass",
          amount: 999,
          // £9.99 in pence
          description: "Unlimited lifetime access to all 50+ ingredients, clinical evidence dossiers, AI scanner, and routine builder."
        },
        annual: {
          name: "Wise Bloom Pro \u2022 Annual Membership",
          amount: 2499,
          // £24.99 in pence
          description: "Full 1-year access with monthly ingredient updates and routine builder.",
          interval: "year"
        },
        monthly: {
          name: "Wise Bloom Pro \u2022 Monthly Membership",
          amount: 399,
          // £3.99 in pence
          description: "Flexible monthly access with ongoing clinical updates and scanner.",
          interval: "month"
        }
      };
      const selectedPlan = plansData[plan] || plansData.lifetime;
      if (!stripeSecretKey) {
        return res.json({
          success: true,
          mode: "simulation",
          message: "Stripe Secret Key not configured in .env yet. Running in simulation mode.",
          checkoutUrl: `${baseHost}?payment=success&session_id=sim_${Date.now()}&plan=${plan}`,
          plan: selectedPlan
        });
      }
      const stripe = new import_stripe.default(stripeSecretKey, {
        apiVersion: "2023-10-16"
      });
      const lineItems = [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.amount,
            ...selectedPlan.interval ? { recurring: { interval: selectedPlan.interval } } : {}
          },
          quantity: 1
        }
      ];
      const session = await stripe.checkout.sessions.create({
        mode: selectedPlan.interval ? "subscription" : "payment",
        line_items: lineItems,
        customer_email: userEmail || void 0,
        success_url: `${baseHost}?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
        cancel_url: `${baseHost}?payment=cancelled`,
        metadata: {
          plan,
          source: "wisebloom.co.uk"
        }
      });
      return res.json({
        success: true,
        mode: "live",
        checkoutUrl: session.url,
        sessionId: session.id
      });
    } catch (error) {
      console.error("Stripe checkout error:", error);
      res.status(500).json({
        error: error?.message || "Failed to create Stripe checkout session"
      });
    }
  });
  app.get("/api/stripe/verify-session", async (req, res) => {
    try {
      const sessionId = req.query.sessionId;
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
      if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
      }
      if (sessionId.startsWith("sim_")) {
        return res.json({
          paid: true,
          status: "complete",
          plan: req.query.plan || "lifetime",
          simulated: true
        });
      }
      if (!stripeSecretKey) {
        return res.json({ paid: true, status: "complete", simulated: true });
      }
      const stripe = new import_stripe.default(stripeSecretKey, {
        apiVersion: "2023-10-16"
      });
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      return res.json({
        paid: session.payment_status === "paid" || session.status === "complete",
        status: session.status,
        customerEmail: session.customer_details?.email,
        plan: session.metadata?.plan || "lifetime"
      });
    } catch (error) {
      console.error("Stripe verification error:", error);
      res.status(500).json({ error: error?.message || "Verification failed" });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Menopause Skincare Decoder server running at http://localhost:${PORT}`);
  });
}
startServer();
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
//# sourceMappingURL=server.cjs.map
