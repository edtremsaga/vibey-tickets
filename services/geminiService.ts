import { GoogleGenAI, Type } from '@google/genai';
import { EventWatch } from '../types';

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const model = 'gemini-2.5-flash';

const priceCheckSchema = {
    type: Type.OBJECT,
    properties: {
      currentPrice: {
        type: Type.NUMBER,
        description: 'The simulated current price for a single ticket.',
      },
      broker: {
        type: Type.STRING,
        description: 'The name of a major ticket broker, like Ticketmaster, SeatGeek, or StubHub.',
      }
    },
    required: ['currentPrice', 'broker'],
  };

export const createInitialWatchData = async (
  watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>
): Promise<{ currentPrice: number, broker: string }> => {
  try {
    const prompt = `Simulate initial price data for a user watching a ticket.
    Event: ${watchData.eventName} at ${watchData.venueName}, ${watchData.venueLocation} on ${watchData.date}.
    User's target price per ticket: $${watchData.targetPrice}.
    Number of tickets: ${watchData.numTickets}.
    
    For this MVP, please provide initial price data for SeatGeek only. This initial price should be HIGHER than the user's target price to simulate the "watching" phase. For example, 20-50% higher.
    Return a JSON object with the current price per ticket and the broker name "SeatGeek".`;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: priceCheckSchema,
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);

  } catch (error) {
    console.error("Error creating initial watch data:", error);
    throw new Error("Failed to communicate with the Gemini API to initialize the watch.");
  }
};


export const fetchPriceUpdate = async (
    watch: EventWatch
  ): Promise<{ currentPrice: number, broker: string }> => {
    try {
      const prompt = `Simulate a new price check for a user watching a ticket from SeatGeek.
      Event: ${watch.eventName} at ${watch.venueName}, ${watch.venueLocation} on ${watch.date}.
      User's target price per ticket: $${watch.targetPrice}.
      The last known price was: $${watch.currentPrice}.
      
      Please provide a new, realistic price from SeatGeek. Ticket prices are volatile. The new price could be slightly higher, slightly lower, or, importantly, it could now be AT or BELOW the user's target price.
      Make it reasonably likely (about a 25% chance) that the new price meets or beats the target.
      Return a JSON object with the new current price per ticket and the broker name "SeatGeek".`;
  
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: priceCheckSchema,
        },
      });
  
      const jsonText = response.text.trim();
      return JSON.parse(jsonText);
  
    } catch (error) {
      console.error("Error fetching price update:", error);
      throw new Error("Failed to communicate with the Gemini API for a price update.");
    }
  };