import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// Note: In a real extension, this might come from VS Code configuration settings
const getAiClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const analyzeAnnotation = async (base64Image: string, prompt: string) => {
  try {
    const ai = getAiClient();
    
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        systemInstruction: "You are an expert coding assistant integrated into an IDE. Analyze the screenshot provided by the user. Pay special attention to the red or highlighted annotations.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};