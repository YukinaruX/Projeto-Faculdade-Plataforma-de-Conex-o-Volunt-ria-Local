import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || 'YOUR_API_KEY_HERE'; // In a real app, this comes from env
const ai = new GoogleGenAI({ apiKey });

export const generateMatchExplanation = async (userName: string, userSkills: string[], oppTitle: string, reqSkills: string[]) => {
  if (!process.env.API_KEY) {
    return "API Key não configurada. Configure process.env.API_KEY para análises reais.";
  }

  try {
    const prompt = `
      Atue como um especialista em recrutamento de voluntários.
      O voluntário ${userName} possui as habilidades: ${userSkills.join(', ')}.
      A oportunidade "${oppTitle}" requer: ${reqSkills.join(', ')}.
      
      Escreva um parágrafo curto (max 50 palavras) e motivador explicando por que essa é uma boa combinação. Fale diretamente com o voluntário.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar a análise de IA no momento.";
  }
};