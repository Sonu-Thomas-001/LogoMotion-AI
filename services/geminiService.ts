import { GoogleGenAI, Type } from "@google/genai";
import { LogoRequest, LogoData } from "../types";

const parseJSON = (text: string): any => {
  try {
    // Attempt standard parse
    return JSON.parse(text);
  } catch (e) {
    // Fallback: remove markdown code blocks if present
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleaned);
  }
};

export const generateLogo = async (request: LogoRequest): Promise<LogoData> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found in environment variables");
  }

  const ai = new GoogleGenAI({ apiKey });

  const systemPrompt = `
    You are a world-class svg logo designer. 
    Your goal is to create a clean, modern, and professional SVG logo based on the user's description.
    
    Rules:
    1. Return ONLY valid JSON.
    2. The 'svg' field must contain a FULL valid SVG string (starting with <svg and ending with </svg>).
    3. The SVG viewBox should be "0 0 512 512".
    4. Ensure the SVG is optimized, using paths, circles, rects, etc. 
    5. Do not use external images or fonts. All text must be converted to paths or use standard sans-serif fonts if absolutely necessary (but paths are preferred for logos).
    6. Design for the requested style (e.g., Minimalist, geometric, abstract).
    7. Include a color palette used in the logo.
    8. Provide a short explanation of the design choices.
    
    Response Schema:
    {
      "svg": "string (the raw svg code)",
      "palette": ["#hex1", "#hex2"],
      "explanation": "string",
      "companyName": "string"
    }
  `;

  const userPrompt = `
    Company Name: ${request.companyName}
    Industry: ${request.industry}
    Description: ${request.description}
    Style Preference: ${request.stylePreference}
    Color Preferences: ${request.colors}
    
    Create a unique, memorable logo for this brand.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            svg: { type: Type.STRING },
            palette: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            explanation: { type: Type.STRING },
            companyName: { type: Type.STRING }
          },
          required: ["svg", "palette", "explanation", "companyName"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response text received from Gemini");

    return parseJSON(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate logo. Please try again.");
  }
};