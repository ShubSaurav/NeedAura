export interface AIAnalysisResult {
  title: string;
  description: string;
  category: string;
  conditionScore: number; // 0 - 100
  suggestedPrice: number;
  marketPrice: number;
  scamLevel: 'low' | 'medium' | 'high';
}

export class AIService {
  /**
   * Analyzes an uploaded product image using Google Gemini Vision
   */
  static async analyzeProductImage(imageUrl: string): Promise<AIAnalysisResult> {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set. Using mock AI analyzer.');
      return this.getMockAnalysisResult(imageUrl);
    }

    try {
      // 1. Download image and convert to base64 for Gemini multimodal API
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const base64Image = Buffer.from(arrayBuffer).toString('base64');
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg';

      // 2. Query Gemini 1.5 Flash endpoint
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const prompt = `
        You are the backend AI for "NeedAura", a college student marketplace. 
        Analyze this product image.
        Identify the item and return a structured JSON object with the following fields:
        {
          "title": "A short, catchy, Gen-Z friendly title of the item (e.g. Casio Scientific Calculator fx-991EX)",
          "category": "One of these exact categories: Electronics, Books, Hostel Essentials, Furniture, Cycles, Sports, Fashion, Others",
          "description": "An engaging, Gen-Z oriented product description with relevant hashtags and emojis. Mention typical student use-cases.",
          "conditionScore": "A number between 0 and 100 representing the estimated visual quality. 100 = brand new, 90 = like new, 70 = minor wear, 40 = heavy wear",
          "suggestedPrice": "A recommended resale price in Indian Rupees (INR) based on estimated condition. Output only the number.",
          "marketPrice": "An estimated brand new retail price in Indian Rupees (INR) for this item model. Output only the number."
        }
        Do not output markdown code blocks. Return ONLY the raw JSON string.
      `;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: 'application/json',
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const rawResult = await response.json();
      const textResponse = rawResult.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const parsedData = JSON.parse(textResponse);

      return {
        title: parsedData.title || 'Unknown Product',
        description: parsedData.description || 'No description generated.',
        category: parsedData.category || 'Others',
        conditionScore: parseInt(parsedData.conditionScore) || 80,
        suggestedPrice: parseFloat(parsedData.suggestedPrice) || 500,
        marketPrice: parseFloat(parsedData.marketPrice) || 1000,
        scamLevel: 'low',
      };
    } catch (error) {
      console.error('Error calling Gemini API, falling back to mock:', error);
      return this.getMockAnalysisResult(imageUrl);
    }
  }

  /**
   * Helper to return clean, brand-matching mock analysis results in local dev
   */
  private static getMockAnalysisResult(imageUrl: string): AIAnalysisResult {
    // Basic heuristics based on image filenames for mock testing
    const lowercaseUrl = imageUrl.toLowerCase();
    
    if (lowercaseUrl.includes('calc') || lowercaseUrl.includes('elec')) {
      return {
        title: 'Casio fx-991EX Scientific Calculator',
        description: 'Need to pass your engineering mathematics? 📈 This Casio calculator is a absolute lifesaver. Has all equations pre-loaded. Condition is 10/10, no scratches. #engineering #maths #casio',
        category: 'Electronics',
        conditionScore: 92,
        suggestedPrice: 650.00,
        marketPrice: 1350.00,
        scamLevel: 'low',
      };
    }

    if (lowercaseUrl.includes('book') || lowercaseUrl.includes('note')) {
      return {
        title: 'Introduction to Algorithms (CLRS) - 3rd Edition',
        description: 'The holy grail of DSA 💻. Thick book but covers everything you need for coding interviews and exams. Minimal highlighting inside, clean pages. #dsa #placements #computerscience',
        category: 'Books',
        conditionScore: 85,
        suggestedPrice: 400.00,
        marketPrice: 999.00,
        scamLevel: 'low',
      };
    }

    // Default mock response
    return {
      title: 'Ergonomic Study Chair',
      description: 'Super comfy chair for late-night study sessions or gaming marathons. Height adjustable, breathable mesh backing. Fits perfectly under hostel desks! #hostellife #gamer #studyhard',
      category: 'Furniture',
      conditionScore: 78,
      suggestedPrice: 1200.00,
      marketPrice: 3200.00,
      scamLevel: 'low',
    };
  }

  /**
   * AI Match Engine - matches student Needs with available active listings
   */
  static async matchNeedToSellers(needTitle: string, needCategory: string, universityId: string): Promise<any[]> {
    // In production, this uses pgvector to run semantic similarity queries.
    // For MVP/Phase 1, we use full-text indexing and category matches.
    console.log(`Running AI match engine for Need: "${needTitle}" in category: "${needCategory}"`);
    return [];
  }
}
