import { GoogleGenerativeAI } from '@google/generative-ai';

export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY || '';
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.warn('GEMINI_API_KEY is not configured in environment. The agent will run with fallback responses if unavailable.');
  }

  const genAI = new GoogleGenerativeAI(apiKey || 'DUMMY_KEY_FOR_BUILD');
  // Use verified available Gemini 2.5 Flash
  return genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    generationConfig: {
      temperature: 0.3,
      topP: 0.8,
    }
  });
}
