import { GoogleGenAI } from "@google/genai";
import { t } from '../lib/i18n';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this environment, we assume API_KEY is set.
  console.warn("API_KEY is not set. Gemini API calls will fail.");
}

// It's better to initialize it only when the key is available.
const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

export interface MarketAdviceResponse {
  text: string;
  groundingChunks?: any[];
}

export const getMarketAdvice = async (prompt: string, userLocation?: { latitude: number; longitude: number }): Promise<MarketAdviceResponse> => {
  if (!ai) {
    return { text: t('marketAssistant.gemini.unavailableError') };
  }

  try {
    // FIX: The 'tools' and 'toolConfig' properties must be placed inside the 'config' object.
    // This aligns with the Gemini API specification for grounding with Google Maps.
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: t('marketAssistant.gemini.systemInstruction'),
        tools: [{ googleMaps: {} }],
        ...(userLocation && {
          toolConfig: {
            retrievalConfig: {
              latLng: userLocation
            }
          }
        }),
      }
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

    return {
      text: response.text,
      groundingChunks: groundingChunks || [],
    };
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return { text: t('marketAssistant.gemini.apiError', { message: error.message }) };
    }
    return { text: t('marketAssistant.gemini.genericError') };
  }
};

export const generateVideo = async (prompt: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error(t('marketAssistant.gemini.apiKeyMissing'));
  }
  
  const videoAI = new GoogleGenAI({ apiKey });

  try {
    let operation = await videoAI.models.generateVideos({
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await videoAI.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!downloadLink) {
      throw new Error(t('marketAssistant.gemini.videoGenerationFailed'));
    }

    return `${downloadLink}&key=${apiKey}`;
  } catch (error) {
    console.error("Error calling Veo API:", error);
    if (error instanceof Error) {
        if (error.message.includes("Requested entity was not found.")) {
            // This specific error message indicates an invalid API key.
            throw new Error('API_KEY_INVALID');
        }
        return t('marketAssistant.gemini.apiError', { message: error.message });
    }
    return t('marketAssistant.gemini.genericError');
  }
};