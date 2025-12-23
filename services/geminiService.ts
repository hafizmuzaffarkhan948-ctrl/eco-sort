
import { GoogleGenAI, Type } from "@google/genai";
import { WasteAnalysis } from "../types";

const API_KEY = process.env.API_KEY || "";

export const analyzeWaste = async (base64Image: string): Promise<WasteAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are an expert Waste Management Assistant. Analyze the image and classify the waste based on these STRICT rules:
    - GREEN (Recycle): Clean plastic bottles, Metal cans, Clean cardboard.
    - YELLOW (Compost): Food waste, Organic waste, Paper/cardboard with food or grease (e.g. dirty pizza box).
    - RED (Hazard): Batteries, Electronics, Chemicals, Medical waste. Hazard overrides all other rules.
    - GREY (Trash): Soft plastics (wrappers), unrecognizable items, or anything not clearly fitting GREEN, YELLOW, or RED.
    
    Priority: Hazard (RED) > Compost (YELLOW) > Recycle (GREEN) > Trash (GREY).
    If grease/food is present, it MUST be YELLOW.
    If unsure, default to GREY.
    
    Provide labels and explanations in both English and Urdu.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
        { text: "Classify this item for disposal. Return as JSON." }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "GREEN, YELLOW, RED, or GREY" },
          binNameEn: { type: Type.STRING },
          binNameUr: { type: Type.STRING },
          explanationEn: { type: Type.STRING },
          explanationUr: { type: Type.STRING },
          identifiedItem: { type: Type.STRING }
        },
        required: ["category", "binNameEn", "binNameUr", "explanationEn", "explanationUr", "identifiedItem"]
      }
    }
  });

  try {
    return JSON.parse(response.text) as WasteAnalysis;
  } catch (e) {
    throw new Error("Failed to parse AI response");
  }
};
