import { model } from "../../config/gemini.js";

export async function getIrrigationRecommendation({ crop, soilMoisture, temperature, rainfall }) {
  const prompt = `
  You are an agricultural irrigation advisor.
  Recommend irrigation schedule for the crop: ${crop}
  Conditions:
  - Soil Moisture: ${soilMoisture} %
  - Temperature: ${temperature} °C
  - Rainfall: ${rainfall} mm

  Suggest how much water (liters/hectare) and frequency (per week).
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
