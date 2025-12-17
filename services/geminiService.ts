
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Always use process.env.API_KEY directly in the constructor for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export interface AIPlanResponse {
  themeSuggestions: string[];
  checklist: string[];
  estimatedBudgetMZN: {
    low: number;
    high: number;
    breakdown: Record<string, number>;
  };
  tips: string;
}

export const generateEventPlan = async (
  eventType: string,
  guests: number,
  location: string,
  vibe: string
): Promise<AIPlanResponse | null> => {
  // Fix: Removed the null check for 'ai' as it is initialized directly with the environment variable

  const prompt = `
    Aja como um organizador de eventos experiente em Moçambique (Plataforma NKHUVO).
    Crie um plano rápido para um evento com os seguintes detalhes:
    - Tipo: ${eventType}
    - Convidados: ${guests}
    - Localização: ${location}
    - Vibe/Estilo: ${vibe}
    
    A resposta DEVE ser um JSON válido com esta estrutura exata, sem markdown:
    {
      "themeSuggestions": ["tema 1", "tema 2"],
      "checklist": ["tarefa 1", "tarefa 2", "tarefa 3", "tarefa 4", "tarefa 5"],
      "estimatedBudgetMZN": {
        "low": number (total minimo em Meticais),
        "high": number (total maximo em Meticais),
        "breakdown": { "Catering": number, "Venue": number, "Decor": number, "Music": number }
      },
      "tips": "Uma dica curta e valiosa para este tipo de evento em Moçambique."
    }
  `;

  try {
    const response = await ai.models.generateContent({
      // Fix: Use gemini-3-flash-preview for general text tasks as recommended by guidelines
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        // Fix: Use responseSchema to define the expected structure for more robust JSON extraction
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            themeSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            checklist: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedBudgetMZN: {
              type: Type.OBJECT,
              properties: {
                low: { type: Type.NUMBER },
                high: { type: Type.NUMBER },
                breakdown: {
                  type: Type.OBJECT,
                  properties: {
                    Catering: { type: Type.NUMBER },
                    Venue: { type: Type.NUMBER },
                    Decor: { type: Type.NUMBER },
                    Music: { type: Type.NUMBER }
                  },
                  required: ["Catering", "Venue", "Decor", "Music"]
                }
              },
              required: ["low", "high", "breakdown"]
            },
            tips: { type: Type.STRING }
          },
          required: ["themeSuggestions", "checklist", "estimatedBudgetMZN", "tips"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text) as AIPlanResponse;
  } catch (error) {
    console.error("Error generating event plan:", error);
    return null;
  }
};
