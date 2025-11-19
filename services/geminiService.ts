import { GoogleGenAI } from "@google/genai";
import { CashCount, Currency } from '../types';

export const getFinancialInsight = async (
  total: number,
  counts: CashCount,
  currency: Currency
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return "Please configure your API Key to use AI insights.";
  }

  const ai = new GoogleGenAI({ apiKey });

  // Construct a text representation of the breakdown
  const breakdownText = currency.denominations
    .filter(d => counts[d.value] > 0)
    .map(d => `${counts[d.value]} x ${currency.symbol}${d.label}`)
    .join(', ');

  const prompt = `
    I have counted cash with a total value of ${currency.symbol}${total.toLocaleString()}.
    The currency is ${currency.name} (${currency.code}).
    
    Here is the breakdown of notes and coins:
    ${breakdownText || "No cash counted yet."}

    Please provide a short, fun, and insightful comment about this amount in one or two sentences. 
    Examples of what to mention:
    - What this amount could buy in the local context (e.g., India for INR).
    - A fun fact about the denomination composition (e.g., "That's a lot of coins!").
    - A savings tip.
    
    Keep it friendly, concise, and strictly text (no markdown formatting).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insight at this time.";
  } catch (error) {
    console.error("Error fetching AI insight:", error);
    return "Unable to reach the financial brain right now. Try again later.";
  }
};
