import { model } from "../../config/gemini.js";

export async function getCropRecommendation( N, P, K, ph, temperature, humidity, rainfall ) {

  const prompt = `
  You are an agricultural expert. 
  Based on the following soil and climate data, recommend the best suitable crop:
  - Nitrogen: ${N}
  - Phosphorus: ${P}
  - Potassium: ${K}
  - pH: ${ph}
  - Temperature: ${temperature} °C
  - Humidity: ${humidity} %
  - Rainfall: ${rainfall} mm

  Give crop name and 1–2 short reasons.
  `;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
