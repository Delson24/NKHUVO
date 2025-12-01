
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safe initialization
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

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
  if (!ai) {
    console.error("Gemini API Key missing");
    return null;
  }

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
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
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
