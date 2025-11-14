/**
 * Mock Service for Price Simulation
 * 
 * This service provides mock price data without requiring any external API.
 * Perfect for development and testing without API keys.
 */

import { EventWatch } from '../types';

/**
 * Generate a mock price that's higher than target (for initial watch)
 */
const generateInitialPrice = (targetPrice: number): number => {
  // Generate a price 20-50% higher than target
  const multiplier = 1.2 + Math.random() * 0.3; // 1.2 to 1.5
  return Math.round(targetPrice * multiplier * 100) / 100;
};

/**
 * Generate a new price update (can be higher, lower, or at target)
 */
const generatePriceUpdate = (targetPrice: number, lastPrice: number): number => {
  // 25% chance to be at or below target
  if (Math.random() < 0.25) {
    // Price at or below target (alert!)
    const discount = Math.random() * 0.15; // 0-15% below target
    return Math.round(targetPrice * (1 - discount) * 100) / 100;
  } else {
    // Price variation: ±10% from last price, but still above target
    const variation = (Math.random() - 0.5) * 0.2; // -10% to +10%
    const newPrice = lastPrice * (1 + variation);
    // Ensure it's still above target (unless we hit the 25% case above)
    return Math.max(targetPrice * 1.05, Math.round(newPrice * 100) / 100);
  }
};

const brokers = ['SeatGeek', 'Ticketmaster', 'StubHub', 'Vivid Seats'];

export const createInitialWatchData = async (
  watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>
): Promise<{ currentPrice: number, broker: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentPrice = generateInitialPrice(watchData.targetPrice);
  const broker = brokers[Math.floor(Math.random() * brokers.length)];
  
  return { currentPrice, broker };
};

export const fetchPriceUpdate = async (
  watch: EventWatch
): Promise<{ currentPrice: number, broker: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const currentPrice = generatePriceUpdate(watch.targetPrice, watch.currentPrice);
  // Sometimes change broker, sometimes keep the same
  const broker = Math.random() < 0.3 
    ? brokers[Math.floor(Math.random() * brokers.length)]
    : watch.broker;
  
  return { currentPrice, broker };
};

