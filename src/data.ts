/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { IngredientRecord } from './types';

export const SKIN_CONCERNS = [
  {
    id: 'sagging_wrinkles',
    title: 'Sagging & Wrinkles',
    description: 'Address fine lines, volume loss, crepey skin, and structural sagging due to rapid collagen depletion.'
  },
  {
    id: 'pigmentation_brightening',
    title: 'Pigmentation & Brightening',
    description: 'Combat stubborn age spots, sun spots, and dull, lackluster skin from hormone fluctuations.'
  },
  {
    id: 'dryness_barrier',
    title: 'Dryness & Barrier Repair',
    description: 'Restore comfort to tight, parched, flaky, or reactive skin due to declining estrogen and lipid levels.'
  },
  {
    id: 'hormonal_breakouts',
    title: 'Hormonal Breakouts & Congestion',
    description: 'Clear adult-onset hormonal acne, clogged pores, and uneven texture in peri- and post-menopause.'
  }
];

export interface QuizQuestion {
  id: string;
  text: string;
}

export interface QuizSection {
  id: string;
  title: string;
  profileName: string;
  questions: QuizQuestion[];
  description: string;
  howItWorks: string;
  foundationIngredientsText: string;
  foundationIngredients: string[];
}

export const QUIZ_SECTIONS: QuizSection[] = [
  {
    id: 'type_a',
    title: 'TYPE A: Moisture Impaired',
    profileName: 'Moisture Impaired (Dehydrated Barrier)',
    questions: [
      { id: 'a1', text: 'Does your skin feel dehydrated (tight, papery) but still produce oil in your T-zone?' },
      { id: 'a2', text: 'Do fine lines look more pronounced by midday, especially around your eyes and mouth?' },
      { id: 'a3', text: 'Does your makeup emphasize pores or settle into lines within a few hours?' },
      { id: 'a4', text: 'Does your skin feel "thirsty" no matter how much moisturizer you apply?' }
    ],
    description: "If your profile shows moisture-impaired, your skin can't hold onto water effectively. You'll see fine dehydration lines that weren't there before, especially around your eyes and mouth. Your skin might look dull or feel rough, and makeup sits on the surface instead of blending smoothly.",
    howItWorks: "The mechanism here is different: your natural moisturizing factors—the compounds that bind water in your skin—have decreased. Your skin barrier might still have adequate oils, but without these water-binding molecules, hydration evaporates before it can do its job.",
    foundationIngredientsText: "Hyaluronic Acid, Glycerin, Niacinamide, Polyglutamic Acid, Beta-Glucan",
    foundationIngredients: ["hyaluronic_acid", "glycerin", "niacinamide", "polyglutamic_acid", "beta_glucan"]
  },
  {
    id: 'type_b',
    title: 'TYPE B: Inflammation Reactive',
    profileName: 'Inflammation Reactive',
    questions: [
      { id: 'b1', text: 'Does your skin flush easily with heat, new products, or stress?' },
      { id: 'b2', text: 'Do products that used to work fine now cause stinging, burning, or redness?' },
      { id: 'b3', text: 'Is your skin sensitive to touch or pressure (like when applying makeup)?' },
      { id: 'b4', text: 'Do you experience random breakouts or irritation without clear triggers?' }
    ],
    description: "If your profile shows inflammation-reactive, your skin has become hypersensitive to ingredients and environmental triggers that never bothered you before. Products sting or burn within seconds of application. Your cheeks flush easily. Redness lingers for hours after a hot shower or a glass of wine.",
    howItWorks: "This reactivity stems from barrier thinning and increased nerve sensitivity during hormonal changes. Your skin's immune response has become overactive, treating harmless ingredients as threats.",
    foundationIngredientsText: "Ectoin, Centellaiatica, Azelaic Acid, Beta-Glucan, Madecassoside, Allantoin",
    foundationIngredients: ["ectoin", "centella_asiatica", "azelaic_acid", "beta_glucan", "madecassoside", "allantoin"]
  },
  {
    id: 'type_c',
    title: 'TYPE C: Lipid Depleted',
    profileName: 'Lipid Depleted',
    questions: [
      { id: 'c1', text: 'Does your skin feel tight or uncomfortable within 30 minutes of cleansing?' },
      { id: 'c2', text: 'Do you see visible flaking, rough patches, or texture even after moisturizing?' },
      { id: 'c3', text: 'Does your skin look dull or lackluster even when you\'re well-hydrated?' },
      { id: 'c4', text: 'Do products that used to absorb easily now seem to sit on top of your skin?' }
    ],
    description: "If your profile shows lipid-depleted, your skin has lost the oils and fatty substances that create its protective seal. You\'ll notice this most after cleansing—your face feels tight, almost papery, within minutes. Products absorb quickly but the comfort doesn\'t last. Your skin drinks up moisturizer but still feels dry an hour later.",
    howItWorks: "This happens because declining estrogen reduces sebum production and disrupts the lipid layer between your skin cells. The result? Water escapes faster than you can replace it, and irritants slip through gaps that shouldn\'t exist.",
    foundationIngredientsText: "Ceramides, Squalane, Sea Buckthorn Oil, and nourishing oils to rebuild your skin\'s protective layer",
    foundationIngredients: ["ceramides", "squalane", "sea_buckthorn_oil"]
  },
  {
    id: 'type_d',
    title: 'TYPE D: Healthy Skin Barrier',
    profileName: 'Healthy Skin Barrier',
    questions: [],
    description: "If your skin feels comfortable the majority of time and you don\'t suffer from stinging, dehydrated or inflamed skin, then you have a healthy skin barrier.",
    howItWorks: "Your skin barrier is in a balanced, comfortable state. In menopause, continuous support preserves moisture, bounce, and resilience.",
    foundationIngredientsText: "Ceramides, Niacinamide, Peptides",
    foundationIngredients: ["ceramides", "niacinamide", "peptides"]
  }
];

export const INGREDIENTS_DATA: IngredientRecord[] = [
  {
    "id": "vitamin_c",
    "ingredient": "Vitamin C (L-Ascorbic Acid)",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Sagging & Wrinkles",
      "Pigmentation & Brightening"
    ],
    "stage": "Start Here",
    "effectivenessRange": "10–20%",
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
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "2–5% (5% is often the sweet spot)",
    "whatItIs": "Vitamin B3 that strengthens the skin barrier, improves tone and balances oil",
    "bestFor": "Dryness, redness, pigmentation, barrier repair, sensitivity",
    "whyMenopausalSkinMayNeedIt": "Supports weakened menopausal skin by improving barrier strength, reducing redness and helping uneven tone",
    "worksWellWith": "Ceramides, Panthenol, Hyaluronic Acid",
    "whatToKnow": "Usually works best at 2–5%; higher percentages aren't always more effective.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "One of the best all-round ingredients for menopausal skin",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "copper_peptides",
    "ingredient": "Peptides",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2–10%",
    "whatItIs": "Skin-repairing ingredients that help support collagen and improve the look of sagging or thinning skin",
    "bestFor": "Firmness, elasticity, fine lines, repair",
    "whyMenopausalSkinMayNeedIt": "Helps support declining collagen and skin resilience without the irritation of stronger actives",
    "worksWellWith": "Ceramides, Hyaluronic Acid, Vitamin C",
    "whatToKnow": "Look for named peptides such as Matrixyl or Copper Peptides rather than generic blends.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Excellent supportive ingredient for firmness and skin quality. Look for named signal peptides such as Matrixyl or Copper Peptides. Generic \"peptide blends\" are harder to evaluate",
    "worthTheSpend": "Moderate to High",
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "0.1–1%",
    "whatItIs": "Vitamin A derivative that speeds skin renewal and boosts collagen",
    "bestFor": "Wrinkles, firmness, pigmentation, texture, hormonal breakouts",
    "whyMenopausalSkinMayNeedIt": "Helps address collagen loss, thinning skin, slower cell turnover and uneven tone common during menopause",
    "worksWellWith": "Ceramides, Peptides, Niacinamide",
    "whatToKnow": "Start with 2–3 nights per week and increase gradually as tolerated",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Advanced users",
    "evidenceLevel": "Strong",
    "quickTake": "Gold-standard anti-ageing ingredient, but best introduced gradually",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "5–10% (home use)",
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
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "Commonly used at 1–10% in topical formulations. Performance depends more on molecular size and formulation quality than percentage alone",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "coenzyme_q10_ubiquinone",
    "ingredient": "Coenzyme Q10 (Ubiquinone)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1–1%",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "bakuchiol",
    "ingredient": "BAKUCHIOL",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.5–2%",
    "whatItIs": "Offers retinol-like benefits with less irritation",
    "bestFor": "Fine lines · Firmness · Sensitive aging skin",
    "whyMenopausalSkinMayNeedIt": "Offers retinol-like benefits with less irritation",
    "worksWellWith": "Peptides · Niacinamide · Ceramides",
    "whatToKnow": "Can often be used more frequently than retinol due to its gentler nature",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "The best retinol alternative currently available.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "ergothioneine",
    "ingredient": "ERGOTHIONEINE",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.01–0.5%",
    "whatItIs": "Protects cells from environmental damage and may help preserve collagen.",
    "bestFor": "Oxidative stress · Premature aging · Inflammation",
    "whyMenopausalSkinMayNeedIt": "Protects cells from environmental damage and may help preserve collagen",
    "worksWellWith": "Vitamin C · CoQ10 · Astaxanthin",
    "whatToKnow": "No major concerns",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "",
    "evidenceLevel": "Emerging Strong",
    "quickTake": "A longevity skincare ingredient to watch closely",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": ""
  },
  {
    "id": "astaxanthin",
    "ingredient": "ASTAXANTHIN",
    "suitabilityAMPM": "AM preferred",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.01–0.1%",
    "whatItIs": "Helps combat oxidative stress and UV-induced collagen breakdown.",
    "bestFor": "Photoaging · Wrinkles · Antioxidant protection",
    "whyMenopausalSkinMayNeedIt": "Helps combat oxidative stress and UV-induced collagen breakdown.",
    "worksWellWith": "Vitamin C · CoQ10 · Resveratrol",
    "whatToKnow": "Often paired with other antioxidants for broader environmental protection.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "yes",
    "evidenceLevel": "Emerging Strong",
    "quickTake": "One of the most powerful antioxidants in skincare",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": ""
  },
  {
    "id": "bee_venom",
    "ingredient": "BEE VENOM",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Sagging & Wrinkles"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.006–0.05%",
    "whatItIs": "May stimulate collagen production through controlled micro-inflammatory signalling.",
    "bestFor": "Firmness · Fine lines · Skin vitality",
    "whyMenopausalSkinMayNeedIt": "May stimulate collagen production through controlled micro-inflammatory signalling.",
    "worksWellWith": "Peptides · Hyaluronic Acid· Centella",
    "whatToKnow": "Patch test carefully and avoid if you have bee-related allergies.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Moderate",
    "evidenceLevel": "Moderate",
    "quickTake": "Interesting ingredient with some promising early evidence",
    "worthTheSpend": "Depends on formulation",
    "worthTheSpendDetail": ""
  },
  {
    "id": "alpha_arbutin",
    "ingredient": "ALPHA ARBUTIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Advanced",
    "effectivenessRange": "1–2%",
    "whatItIs": "Alpha arbutin helps suppress excess pigment production",
    "bestFor": "Melasma · Age spots · Uneven skin tone",
    "whyMenopausalSkinMayNeedIt": "Hormonal pigmentation often becomes more stubborn after 45. Alpha arbutin helps suppress excess pigment production.",
    "worksWellWith": "TXA · Niacinamide · Vitamin C · N-Acetyl Glucosamine",
    "whatToKnow": "Results require patience and consistent use. Visible improvement usually takes 8–12 weeks of consistent use.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Moderate",
    "evidenceLevel": "Strong",
    "quickTake": "One of the safest and most reliable pigment-fighting ingredients available.",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": ""
  },
  {
    "id": "licorice_root_extract",
    "ingredient": "LICORICE ROOT EXTRACT",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.5–2%",
    "whatItIs": "Helps reduce age spots and hormonal pigmentation while calming inflammation and flushing.",
    "bestFor": "Pigmentation · Redness · Sensitive skin",
    "whyMenopausalSkinMayNeedIt": "Helps reduce age spots and hormonal pigmentation while calming inflammation and flushing.",
    "worksWellWith": "TXA · Arbutin · Niacinamide · Vitamin C",
    "whatToKnow": "Particularly useful when pigmentation is accompanied by redness",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "One of the gentlest brightening ingredients available.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "10–20%",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "txa_tranexamic_acid",
    "ingredient": "TXA (Tranexamic Acid)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2–5%",
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
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "5–12%",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "n_acetyl_glucosamine_nag",
    "ingredient": "N-ACETYL GLUCOSAMINE (NAG)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Pigmentation & Brightening"
    ],
    "stage": "Advanced",
    "effectivenessRange": "2–5%",
    "whatItIs": "Helps brighten age-related pigmentation while supporting the skin's natural HA production.",
    "bestFor": "Pigmentation · Hydration · Uneven skin tone",
    "whyMenopausalSkinMayNeedIt": "Helps brighten age-related pigmentation while supporting the skin's natural HA production.",
    "worksWellWith": "Niacinamide · TXA · Arbutin · Vitamin C",
    "whatToKnow": "Frequently paired with niacinamide for enhanced brightening results.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Moderate",
    "evidenceLevel": "Strong Emerging Evidence",
    "quickTake": "One of skincare's most underrated brightening ingredients",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "colloidal_oatmeal",
    "ingredient": "COLLOIDAL OATMEAL",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.5–1% for maintenance\n1–5% for more intensive barrier support",
    "whatItIs": "Helps calm inflamed, itchy, or highly reactive skin.",
    "bestFor": "Itching · Sensitivity · Barrier repair",
    "whyMenopausalSkinMayNeedIt": "Helps calm inflamed, itchy, or highly reactive skin.",
    "worksWellWith": "Ceramides · Panthenol · Allantoin",
    "whatToKnow": "Ideal for skin that feels itchy, irritated, or reactive.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Dermatology's gold standard for irritated skin.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "squalane",
    "ingredient": "Squalane",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "1–5% for lightweight hydration\n5–15% for richer moisturisers\n100% in facial oils",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "ceramides",
    "ingredient": "Ceramides",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.1–1%",
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
    "worthTheSpendDetail": ""
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
    "effectivenessRange": "0.1–0.5% for high molecular weight HA\nUp to 2% in multi-weight HA serums",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "centella_asiatica",
    "ingredient": "CENTELLA ASIATICA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.5–5%",
    "whatItIs": "Helps repair weakened barriers and calm reactive skin often seen during hormonal changes.",
    "bestFor": "Barrier repair · Sensitivity · Redness",
    "whyMenopausalSkinMayNeedIt": "Helps repair weakened barriers and calm reactive skin often seen during hormonal changes.",
    "worksWellWith": "Panthenol · Ceramides · Beta-Glucan · Madecassoside",
    "whatToKnow": "Particularly helpful after over-exfoliation or retinoid irritation.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "One of the best ingredients for calming stressed skin",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "propolis",
    "ingredient": "PROPOLIS",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "1–10%",
    "whatItIs": "Supports repair and hydration while calming irritation",
    "bestFor": "Healing · Redness · Barrier support",
    "whyMenopausalSkinMayNeedIt": "Supports repair and hydration while calming irritation.",
    "worksWellWith": "Honey · Centella · Panthenol",
    "whatToKnow": "Best avoided by anyone sensitive to bee-derived ingredients.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Excellent for stressed, irritated skin.",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": ""
  },
  {
    "id": "sea_buckthorn_oil",
    "ingredient": "SEA BUCKTHORN OIL",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "1–10%",
    "whatItIs": "Rich in omega fatty acids that support a lipid-depleted barrier",
    "bestFor": "Dryness · Barrier repair · Antioxidant support",
    "whyMenopausalSkinMayNeedIt": "Rich in omega fatty acids that support a lipid-depleted barrier.",
    "worksWellWith": "Ceramides · Squalane · Vitamin E",
    "whatToKnow": "Particularly beneficial for very dry, lipid-depleted skin.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate",
    "quickTake": "Wonderful for very dry post-menopausal skin.",
    "worthTheSpend": "Usually",
    "worthTheSpendDetail": ""
  },
  {
    "id": "urea",
    "ingredient": "UREA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Advanced",
    "effectivenessRange": "5–10% (face), 10–20% (body)",
    "whatItIs": "Urea hydrates while gently resurfacing skin.",
    "bestFor": "Extreme dryness · Crepey skin · Rough texture · Barrier support",
    "whyMenopausalSkinMayNeedIt": "Declining estrogen often causes severe dryness and texture changes. Urea hydrates while gently resurfacing skin.",
    "worksWellWith": "Ceramides · Glycerin · Panthenol · Squalane",
    "whatToKnow": "Lower strengths hydrate; higher strengths also help smooth rough texture",
    "beginnerFriendly": false,
    "beginnerFriendlyNotes": "Advanced users",
    "evidenceLevel": "Strong",
    "quickTake": "One of dermatology's best-kept secrets for mature skin.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "glycerin",
    "ingredient": "GLYCERIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "2–5% → light hydration\n5–10% → moisturisers and serums\n10–20% → intensive hydration products",
    "whatItIs": "Glycerin attracts moisture into the upper layers of the skin",
    "bestFor": "Dehydration · Tightness · Barrier support",
    "whyMenopausalSkinMayNeedIt": "Natural moisturising factors decline with age, making skin less able to retain water. Glycerin attracts moisture into the upper layers of the skin.",
    "worksWellWith": "Hyaluronic Acid· Ceramides · Urea · Panthenol · Polyglutamic Acid",
    "whatToKnow": "Rarely irritating. Can feel sticky in poorly formulated products.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "One of the most underrated ingredients in skincare. Cheap, effective, and clinically proven. Often appears near the top of excellent moisturiser formulas",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "panthenol_pro_vitamin_b5",
    "ingredient": "PANTHENOL (Pro-Vitamin B5)",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "1–5%",
    "whatItIs": "Panthenol supports healing and reduces inflammation",
    "bestFor": "Barrier repair · Redness · Sensitivity · Post-retinoid recovery",
    "whyMenopausalSkinMayNeedIt": "Hormonal skin often becomes reactive and slower to repair. Panthenol supports healing and reduces inflammation.",
    "worksWellWith": "Ceramides · Beta-Glucan · Ectoin · Centella · Hyaluronic Acid",
    "whatToKnow": "A great ingredient to reach for when your skin barrier feels stressed.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Every reactive menopause routine should contain some form of panthenol.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "ectoin",
    "ingredient": "ECTOIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.3–2%",
    "whatItIs": "Ectoin protects cells from stress while reducing inflammation and dehydration.",
    "bestFor": "Barrier repair · Sensitivity · Redness · Environmental stress",
    "whyMenopausalSkinMayNeedIt": "Menopausal skin often becomes thinner, more reactive, and less resilient. Ectoin protects cells from stress while reducing inflammation and dehydration.",
    "worksWellWith": "Ceramides · Panthenol · Beta-Glucan · HA · Niacinamide",
    "whatToKnow": "Often found in newer-generation barrier repair products.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong Emerging Evidence",
    "quickTake": "One of the most exciting barrier-repair ingredients available today.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "beta_glucan",
    "ingredient": "BETA-GLUCAN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1–2%",
    "whatItIs": "Supports healing and hydration while calming inflammation common in hormonally stressed skin.",
    "bestFor": "Barrier repair · Redness · Hydration · Post-treatment recovery",
    "whyMenopausalSkinMayNeedIt": "Supports healing and hydration while calming inflammation common in hormonally stressed skin.",
    "worksWellWith": "Panthenol · Ceramides · HA · Centella · Ectoin",
    "whatToKnow": "Excellent after procedures, retinoids, or periods of skin irritation.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Often outperforms hyaluronic acid for soothing and repair.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "madecassoside",
    "ingredient": "MADECASSOSIDE",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.05–0.5%",
    "whatItIs": "Calms inflammation and supports healing",
    "bestFor": "Redness · Sensitivity · Barrier repair · Rosacea-prone skin",
    "whyMenopausalSkinMayNeedIt": "Calms inflammation and supports healing when skin suddenly becomes reactive during hormonal shifts.",
    "worksWellWith": "Panthenol · Beta-Glucan · Ceramides · Centella",
    "whatToKnow": "Frequently paired with Centella Asiatica in calming formulations",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Ideal for women who say \"everything burns now.\"",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "polyglutamic_acid",
    "ingredient": "POLYGLUTAMIC ACID",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1–3%",
    "whatItIs": "Helps retain moisture and improve skin plumpness",
    "bestFor": "Dehydration · Plumping · Fine dehydration lines",
    "whyMenopausalSkinMayNeedIt": "Helps retain moisture and improve skin plumpness when natural hydration levels decline.",
    "worksWellWith": "HA · Glycerin · Ceramides · Peptides",
    "whatToKnow": "Works beautifully alongside hyaluronic acid and glycerin",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Moderate to High",
    "quickTake": "Think of it as hyaluronic acid's highly effective cousin.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "allantoin",
    "ingredient": "ALLANTOIN",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Dryness & Barrier Repair"
    ],
    "stage": "Supportive",
    "effectivenessRange": "0.1–2%",
    "whatItIs": "Helps calm skin that has become reactive",
    "bestFor": "Soothing · Irritation · Barrier support",
    "whyMenopausalSkinMayNeedIt": "Helps calm skin that has become reactive due to hormonal changes, actives, or environmental stress.",
    "worksWellWith": "Panthenol · Ceramides · Beta-Glucan · Oat Extract",
    "whatToKnow": "A quiet workhorse ingredient that appears in many barrier-repair formulas",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "Strong",
    "quickTake": "Not glamorous, but consistently effective.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  },
  {
    "id": "salicylic_acid_bha",
    "ingredient": "Salicylic Acid (BHA)",
    "suitabilityAMPM": "PM preferred",
    "concern": [
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.5–2%",
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
    "worthTheSpendDetail": ""
  },
  {
    "id": "zinc_pca",
    "ingredient": "ZINC PCA",
    "suitabilityAMPM": "AM or PM",
    "concern": [
      "Hormonal Breakouts & Congestion"
    ],
    "stage": "Start Here",
    "effectivenessRange": "0.1–1%",
    "whatItIs": "Helps with oil regulation and enlatged pores",
    "bestFor": "Hormonal acne · Oil regulation · Enlarged pores",
    "whyMenopausalSkinMayNeedIt": "Particularly useful for menopausal skin that feels both dry and breakout-prone.",
    "worksWellWith": "Niacinamide · Azelaic Acid · Salicylic Acid",
    "whatToKnow": "Can feel drying if overused.",
    "beginnerFriendly": true,
    "beginnerFriendlyNotes": "Yes",
    "evidenceLevel": "High",
    "quickTake": "Excellent for the menopausal woman battling both dryness and breakouts.",
    "worthTheSpend": "High",
    "worthTheSpendDetail": ""
  }
];
