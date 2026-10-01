/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import Stripe from 'stripe';
import { INGREDIENTS_DATA } from './src/data';
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON parsing with a 10MB limit to handle base64 image payloads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // API router endpoint: Analyze ingredient list from photo or text
  app.post('/api/analyze-ingredients', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'Gemini API key is not configured. Please add GEMINI_API_KEY to your Secrets panel inside AI Studio Settings.'
        });
      }

      const { text, image, userProfile, routine } = req.body;

      if (!text && !image) {
        return res.status(400).json({
          error: 'Please provide either raw ingredients text or an image payload to analyze.'
        });
      }

      // Initialize the Google GenAI client with correct headers for AI Studio environment
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build'
          }
        }
      });

      // Prepare a list of our database ingredients for Gemini context matching
      const knownIngredientsContext = INGREDIENTS_DATA.map((ing) => ({
        id: ing.id,
        name: ing.ingredient,
        role: ing.role || 'Barrier Repair',
        stage: ing.stage,
        suitabilityAMPM: ing.suitabilityAMPM || 'AM or PM',
        whatToKnow: ing.whatToKnow || ''
      }));

      const routineContext = routine && Object.keys(routine).length > 0
        ? Object.entries(routine).map(([ingId, slot]) => {
            const ing = INGREDIENTS_DATA.find((i) => i.id === ingId);
            return ing ? `${ing.ingredient} [Role: ${ing.role || 'Active'}, Stage: ${ing.stage}] (${String(slot).toUpperCase()} Routine)` : `${ingId} (${String(slot).toUpperCase()})`;
          }).join(', ')
        : 'None currently set';

      const profileContext = userProfile ? `
User Profile Context:
- Barrier Type: ${userProfile.barrierType || 'Unknown'} (Moisture-Impaired, Inflammation-Reactive, Lipid-Depleted, or Unknown)
- Current Concerns: ${userProfile.concerns?.join(', ') || 'None specified'}
- Saved / Recommended Ingredients: ${userProfile.recommendedIngredients?.join(', ') || 'None'}
- Existing Daily Routine: ${routineContext}
` : `Existing Daily Routine: ${routineContext}`;

      // Base assistant prompt strictly adopting the menopausal skin routine and ingredient-layering guidelines
      const textPrompt = `You are the Menopausal Skin Routine and Ingredient-Layering Assistant.
Your job is to create simple, safe AM/PM skincare layering guidance using only the ingredient information provided in the app’s ingredient database. Do not invent ingredient benefits, percentages, warnings, or product claims that are not supported by the database.

The app is designed for menopausal and perimenopausal skin, where the main priorities are barrier support, dryness, sensitivity, pigmentation, dullness, loss of firmness, fine lines, hormonal breakouts, and congestion.

${profileContext}

CORE RULES:
1. Always prioritise barrier comfort first, especially for menopausal skin.
2. Build routines by product role, not by random ingredient lists.
   Ingredient roles: Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, or Formulation Support.
3. Recommend a maximum of 3 core ingredients plus 1 treatment focus unless the user asks for more detail.
4. Keep advice short, practical, and easy to understand.
5. Do not say an ingredient is present at an effective percentage unless the product clearly states the percentage.
6. If ingredient strength is unknown, say “contains” or “look for,” not “this will deliver.”
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
- Exfoliating acids should usually be suggested 1–3 nights weekly, not every night.
- Retinoids should usually start 1–2 nights weekly and increase only if tolerated.
- SPF is essential every morning, especially when using retinoids, acids, vitamin C, azelaic acid, tranexamic acid, alpha arbutin, kojic acid, or pigmentation-focused routines.

WHEN ANALYSING THIS SCANNED PRODUCT:
1. Identify product name/brand or use "Skincare Treatment".
2. Match detected ingredients against the Core Database (${knownIngredientsContext.length} ingredients).
   Assign each detected ingredient its role (Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, or Formulation Support).
3. Evaluate compatibility:
   - "Good Match": Product supports barrier health and matches user concerns without conflicting with current routine.
   - "Possible Match": Beneficial, but requires mindful placement or alternate-day scheduling.
   - "Use With Care": Contains ingredients that may irritate the user's barrier type or clash with their existing routine.
4. Recommend where the product fits in the routine: AM, PM, treatment step, moisturiser step, SPF step, occasional use (1–3 nights/week), or avoid for now.
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
     Step 3: One treatment active only (if calm) — place scanned product here if it is an active treatment/serum
     Step 4: Barrier Cream (Ceramides + Fatty Acids & Cholesterol) — essential to restore barrier lipids
     Step 5: Moisture Seal / Balm (Squalane, lipid oil, or barrier balm) — seals dry/tight areas overnight.
     NEVER return only 2 or 3 steps for the evening protocol. All 5 steps must be explicitly listed so the user sees the complete regimen.`;

      const contents: any[] = [];

      if (image) {
        // Parse base64 image data URL
        const regex = /^data:(image\/\w+);base64,(.+)$/;
        const matches = image.match(regex);
        if (matches) {
          const mimeType = matches[1];
          const data = matches[2];
          contents.push({
            inlineData: { mimeType, data }
          });
        } else {
          return res.status(400).json({ error: 'Invalid base64 image data URL format.' });
        }
      }

      contents.push({ text: textPrompt + (text ? `\n\nAnalyzable Raw Ingredient Text:\n${text}` : '') });

      // Call Gemini 3.5-flash model with a highly structured JSON response schema
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              productName: {
                type: Type.STRING,
                description: "Brand name or product title, e.g. 'Olay Regenerist Serum' or 'Skincare Treatment'"
              },
              matchLevel: {
                type: Type.STRING,
                enum: ['Good Match', 'Possible Match', 'Use With Care'],
                description: "Compatibility classification for this user"
              },
              routinePlacement: {
                type: Type.STRING,
                description: "Recommended placement, e.g. 'AM Routine · Hydrate / Soothe step' or 'PM Routine · Treatment step (1–2 nights weekly)'"
              },
              overallSummary: {
                type: Type.STRING,
                description: "Warm, reassuring, practical cosmetic review using the specified tone and rules"
              },
              goodMatches: {
                type: Type.OBJECT,
                properties: {
                  ingredientNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Helpful ingredients detected" },
                  bestFor: { type: Type.STRING, description: "Short summary of benefits supported by database" }
                },
                required: ['ingredientNames', 'bestFor']
              },
              useWithCare: {
                type: Type.OBJECT,
                properties: {
                  ingredientNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Caution ingredients or potential conflicts" },
                  reason: { type: Type.STRING, description: "Gentle reason based on user's barrier type or existing routine" }
                },
                required: ['ingredientNames', 'reason']
              },
              layeringTip: {
                type: Type.STRING,
                description: "One simple, practical, relevant layering tip adhering to assistant guidelines"
              },
              isRecoveryModeRecommended: {
                type: Type.BOOLEAN,
                description: "True if user reports stinging, burning, or product is unsuitable for compromised barrier"
              },
              recoveryModeAdvice: {
                type: Type.STRING,
                description: "Recovery mode message if applicable"
              },
              ingredientsFound: {
                type: Type.ARRAY,
                description: "Array of detected skincare ingredients with role and database linkage",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    role: { type: Type.STRING, description: "Ingredient role (Hydrator, Barrier Repair, Antioxidant, Brightener, Exfoliant, Retinoid, Breakout Support, Occlusive, Soothing, Formulation Support)" },
                    isMatchInDatabase: { type: Type.BOOLEAN },
                    matchedIngredientId: { type: Type.STRING },
                    percentage: { type: Type.STRING }
                  },
                  required: ['name', 'isMatchInDatabase']
                }
              },
              suggestedAMRoutine: {
                type: Type.ARRAY,
                description: "Step-by-step morning layering guide",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    stepName: { type: Type.STRING },
                    productOrActive: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'stepName', 'productOrActive', 'reason']
                }
              },
              suggestedPMRoutine: {
                type: Type.ARRAY,
                description: "Step-by-step evening layering guide",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    stepName: { type: Type.STRING },
                    productOrActive: { type: Type.STRING },
                    reason: { type: Type.STRING }
                  },
                  required: ['stepNumber', 'stepName', 'productOrActive', 'reason']
                }
              }
            },
            required: [
              'productName',
              'matchLevel',
              'routinePlacement',
              'overallSummary',
              'goodMatches',
              'useWithCare',
              'layeringTip',
              'ingredientsFound',
              'suggestedAMRoutine',
              'suggestedPMRoutine'
            ]
          }
        }
      });

      const responseText = response.text || '{}';
      const analysisResult = JSON.parse(responseText.trim());

      // Ensure Evening Protocol Sequence ALWAYS contains all 5 steps:
      // 1. Cleanse, 2. Hydrating/Soothing, 3. One Treatment Active, 4. Barrier Cream (Ceramides + Fatty Acids), 5. Moisture Seal / Balm (Squalane etc.)
      if (!Array.isArray(analysisResult.suggestedPMRoutine) || analysisResult.suggestedPMRoutine.length < 4) {
        const existingSteps = Array.isArray(analysisResult.suggestedPMRoutine) ? analysisResult.suggestedPMRoutine : [];
        const activeStep = existingSteps.find((s: any) => 
          /active|treatment|serum|retin|acid|peptid/i.test(s.stepName || '') || 
          /active|treatment|serum|retin|acid|peptid/i.test(s.productOrActive || '')
        ) || existingSteps[1] || {
          stepNumber: 3,
          stepName: 'Target Active Treatment',
          productOrActive: analysisResult.productName || 'One treatment active only (if skin is calm)',
          reason: 'Introduce slowly 1–3 nights weekly to avoid sensitizing menopausal skin.'
        };

        analysisResult.suggestedPMRoutine = [
          {
            stepNumber: 1,
            stepName: 'Gentle Cleanse',
            productOrActive: 'Gentle hydrating or cream cleanser',
            reason: 'Removes daily impurities, pollutants, and SPF without disrupting barrier lipids.'
          },
          {
            stepNumber: 2,
            stepName: 'Hydrating / Soothing Step',
            productOrActive: 'Glycerin, Panthenol, or Hyaluronic Acid serum',
            reason: 'Water-based humectants replenish dermal hydration before applying treatment.'
          },
          {
            stepNumber: 3,
            stepName: activeStep.stepName || 'Target Active Treatment',
            productOrActive: activeStep.productOrActive || analysisResult.productName || 'One treatment active only',
            reason: activeStep.reason || 'Use maximum 1–3 nights weekly; avoid layering conflicting acids or retinoids.'
          },
          {
            stepNumber: 4,
            stepName: 'Barrier Cream',
            productOrActive: 'Ceramides + Fatty Acids & Cholesterol',
            reason: 'Essential physiological lipid replacement to seal the skin barrier and prevent trans-epidermal moisture loss.'
          },
          {
            stepNumber: 5,
            stepName: 'Moisture Seal / Balm',
            productOrActive: 'Squalane, lipid oil, or rich barrier balm',
            reason: 'Optional final occlusive layer to soothe dry or tight areas overnight.'
          }
        ];
      } else {
        // Verify Step 4 (Barrier Cream) and Step 5 (Moisture Seal / Balm) are explicitly present
        const hasBarrierCream = analysisResult.suggestedPMRoutine.some((s: any) => 
          /barrier|ceramide|fatty acid|moisturi/i.test(s.stepName + ' ' + s.productOrActive)
        );
        const hasMoistureSeal = analysisResult.suggestedPMRoutine.some((s: any) => 
          /seal|balm|squalane|oil|occlusive/i.test(s.stepName + ' ' + s.productOrActive)
        );

        if (!hasBarrierCream) {
          analysisResult.suggestedPMRoutine.splice(3, 0, {
            stepNumber: 4,
            stepName: 'Barrier Cream',
            productOrActive: 'Ceramides + Fatty Acids & Cholesterol',
            reason: 'Crucial for menopausal skin to replenish lipid architecture and fortify against moisture loss.'
          });
        }
        if (!hasMoistureSeal) {
          analysisResult.suggestedPMRoutine.push({
            stepNumber: analysisResult.suggestedPMRoutine.length + 1,
            stepName: 'Moisture Seal / Balm',
            productOrActive: 'Squalane, facial oil, or occlusive balm',
            reason: 'Final protective lipid seal for extra dry, sensitive, or flaky patches overnight.'
          });
        }
        // Re-number steps sequentially 1..N
        analysisResult.suggestedPMRoutine.forEach((step: any, idx: number) => {
          step.stepNumber = idx + 1;
        });
      }

      res.json({ success: true, result: analysisResult });
    } catch (error: any) {
      console.error('Ingredient analysis error:', error);
      res.status(500).json({
        error: error?.message || 'An error occurred during ingredient analysis. Please try again.'
      });
    }
  });

  // Stripe Checkout Session Creation
  app.post('/api/stripe/create-checkout-session', async (req, res) => {
    try {
      const { plan = 'lifetime', userEmail, origin } = req.body;
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

      const baseHost = origin || req.headers.referer?.replace(/\/$/, '') || 'https://wisebloom.co.uk';

      // Plan pricing configurations in GBP (£)
      const plansData: Record<string, { name: string; amount: number; description: string; interval?: 'month' | 'year' }> = {
        lifetime: {
          name: 'Wise Bloom Pro • Lifetime Access Pass',
          amount: 999, // £9.99 in pence
          description: 'Unlimited lifetime access to all 50+ ingredients, clinical evidence dossiers, AI scanner, and routine builder.'
        },
        annual: {
          name: 'Wise Bloom Pro • Annual Membership',
          amount: 2499, // £24.99 in pence
          description: 'Full 1-year access with monthly ingredient updates and routine builder.',
          interval: 'year'
        },
        monthly: {
          name: 'Wise Bloom Pro • Monthly Membership',
          amount: 399, // £3.99 in pence
          description: 'Flexible monthly access with ongoing clinical updates and scanner.',
          interval: 'month'
        }
      };

      const selectedPlan = plansData[plan] || plansData.lifetime;

      // If no Stripe Secret Key configured yet, provide a mock simulation checkout so testing works seamlessly
      if (!stripeSecretKey) {
        return res.json({
          success: true,
          mode: 'simulation',
          message: 'Stripe Secret Key not configured in .env yet. Running in simulation mode.',
          checkoutUrl: `${baseHost}?payment=success&session_id=sim_${Date.now()}&plan=${plan}`,
          plan: selectedPlan
        });
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16' as any
      });

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: selectedPlan.name,
              description: selectedPlan.description
            },
            unit_amount: selectedPlan.amount,
            ...(selectedPlan.interval ? { recurring: { interval: selectedPlan.interval } } : {})
          },
          quantity: 1
        }
      ];

      const session = await stripe.checkout.sessions.create({
        mode: selectedPlan.interval ? 'subscription' : 'payment',
        line_items: lineItems,
        customer_email: userEmail || undefined,
        success_url: `${baseHost}?payment=success&session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
        cancel_url: `${baseHost}?payment=cancelled`,
        metadata: {
          plan,
          source: 'wisebloom.co.uk'
        }
      });

      return res.json({
        success: true,
        mode: 'live',
        checkoutUrl: session.url,
        sessionId: session.id
      });
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      res.status(500).json({
        error: error?.message || 'Failed to create Stripe checkout session'
      });
    }
  });

  // Stripe Session Verification
  app.get('/api/stripe/verify-session', async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

      if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
      }

      // If simulated session
      if (sessionId.startsWith('sim_')) {
        return res.json({
          paid: true,
          status: 'complete',
          plan: (req.query.plan as string) || 'lifetime',
          simulated: true
        });
      }

      if (!stripeSecretKey) {
        return res.json({ paid: true, status: 'complete', simulated: true });
      }

      const stripe = new Stripe(stripeSecretKey, {
        apiVersion: '2023-10-16' as any
      });

      const session = await stripe.checkout.sessions.retrieve(sessionId);

      return res.json({
        paid: session.payment_status === 'paid' || session.status === 'complete',
        status: session.status,
        customerEmail: session.customer_details?.email,
        plan: session.metadata?.plan || 'lifetime'
      });
    } catch (error: any) {
      console.error('Stripe verification error:', error);
      res.status(500).json({ error: error?.message || 'Verification failed' });
    }
  });

  // Setup Vite development server or production environment
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    // Serve SPA index.html for unknown routes
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`The Menopause Skincare Decoder server running at http://localhost:${PORT}`);
  });
}

startServer();
