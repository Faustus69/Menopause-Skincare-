/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
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

      const { text, image, userProfile } = req.body;

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
        name: ing.ingredient
      }));

      const profileContext = userProfile ? `
User Profile:
- Barrier Type: ${userProfile.barrierType || 'Unknown'}
- Concerns: ${userProfile.concerns?.join(', ') || 'None'}
- Recommended Ingredients: ${userProfile.recommendedIngredients?.join(', ') || 'None'}
` : 'No user profile provided.';

      // Base chemical prompt
      const textPrompt = `You are "The Menopause Skincare Decoder", an expert cosmetic chemist specializing in skincare for women over 45 (peri-menopausal, menopausal, and post-menopausal skin).
Analyze the provided skin product ingredient list and detect active or key ingredients.

${profileContext}

First, detect the overall brand or skincare product name from the text or image if visible. If none is clear, use "Skincare Treatment".
Second, identify all primary active and secondary supportive ingredients.
For each ingredient found:
1. Determine if it corresponds to one of our app's defined core ingredients in the database list below.
   - Core Database list of ingredients: ${JSON.stringify(knownIngredientsContext)}
   - If there is a clear match, set "isMatchInDatabase" to true and "matchedIngredientId" to the EXACT id string from the list (e.g. "niacinamide", "ceramides", etc.).
   - If there's no match, set "isMatchInDatabase" to false and "matchedIngredientId" to null.
2. Determine if a specific percentage/concentration is mentioned on the product (e.g. Niacinamide 10%, Glycolic Acid 5%). If none, set "percentage" to null or empty.
3. Compare the ingredients found to the User Profile.
   - If the ingredient is a match for their concerns or barrier type, add it to "goodMatches".
   - If the ingredient might be irritating given their barrier type or concerns, add it to "useWithCare".

Third, write an "overallSummary": a highly tailored review of the product focusing heavily on the User Profile (how it impacts their specific barrier type and concerns).
Fourth, output the structured good matches and use with care items to match the expected format exactly.`;

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
              overallSummary: {
                type: Type.STRING,
                description: "Professional cosmetic science overview tailored to the user's specific barrier type and concerns"
              },
              goodMatches: {
                type: Type.OBJECT,
                properties: {
                  ingredientNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of matched ingredient names, e.g. ['Niacinamide', 'Glycerin']" },
                  bestFor: { type: Type.STRING, description: "Short summary of benefits tailored to user, e.g. 'Barrier support, hydration, redness'" }
                },
                required: ['ingredientNames', 'bestFor']
              },
              useWithCare: {
                type: Type.OBJECT,
                properties: {
                  ingredientNames: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of caution ingredient names, e.g. ['Glycolic Acid']" },
                  reason: { type: Type.STRING, description: "Reason to be careful based on user profile, e.g. 'May be too active if your barrier is reactive today.'" }
                },
                required: ['ingredientNames', 'reason']
              },
              ingredientsFound: {
                type: Type.ARRAY,
                description: "Array of detected skincare ingredients with database linkage",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    isMatchInDatabase: { type: Type.BOOLEAN },
                    matchedIngredientId: { type: Type.STRING },
                    percentage: { type: Type.STRING }
                  },
                  required: ['name', 'isMatchInDatabase']
                }
              }
            },
            required: ['productName', 'overallSummary', 'goodMatches', 'useWithCare', 'ingredientsFound']
          }
        }
      });

      const responseText = response.text || '{}';
      const analysisResult = JSON.parse(responseText.trim());

      res.json({ success: true, result: analysisResult });
    } catch (error: any) {
      console.error('Ingredient analysis error:', error);
      res.status(500).json({
        error: error?.message || 'An error occurred during ingredient analysis. Please try again.'
      });
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
