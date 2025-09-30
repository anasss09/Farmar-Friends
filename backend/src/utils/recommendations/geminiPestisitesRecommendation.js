import { model } from "../../config/gemini.js";
import recommendPesticide from '../API/Pestisites.js'

export async function getPesticideRecommendation(data) {
  const { crop, pest, severity } = data;
  console.log(crop, pest, severity)
  const prompt = `
  You are an agricultural pest management expert.
  Based on the following input, recommend a pesticide and give a short reasoning:

  Crop: ${crop}
  Pest: ${pest}
  Severity: ${severity || "not specified"}

  Respond with:
  - Pesticide name (prefer safe options first)
  - Application method (spray, soil application, etc.)
  - 1 short reason
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("⚠️ Gemini failed, using fallback:", error.message);
    return recommendPesticide(data); // fallback
  }
}
