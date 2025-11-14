/**
 * API Service Layer
 * 
 * This abstraction layer allows easy switching between:
 * - Phase 1: Client-side simulation (using Gemini AI)
 * - Phase 2: Backend API integration
 * 
 * To switch to Phase 2, update the implementation to call your backend API
 * instead of the Gemini service.
 */

import { EventWatch } from '../types';
// Use mock service by default (no API key required)
// To use Gemini AI instead, change this import to: import { createInitialWatchData, fetchPriceUpdate } from './geminiService';
import { createInitialWatchData, fetchPriceUpdate } from './mockService';

export interface CreateWatchRequest {
  eventName: string;
  venueName: string;
  venueLocation: string;
  date: string;
  targetPrice: number;
  numTickets: number;
}

export interface CreateWatchResponse {
  currentPrice: number;
  broker: string;
}

export interface PriceUpdateResponse {
  currentPrice: number;
  broker: string;
}

/**
 * API Service Interface
 * Implement this interface for Phase 2 backend integration
 */
export interface IApiService {
  createWatch(data: CreateWatchRequest): Promise<CreateWatchResponse>;
  updateWatchPrice(watch: EventWatch): Promise<PriceUpdateResponse>;
}

/**
 * Phase 1 Implementation: Client-side simulation
 * Currently using mock data (no API key required)
 * To use Gemini AI, change the import above to use geminiService
 */
class Phase1ApiService implements IApiService {
  async createWatch(data: CreateWatchRequest): Promise<CreateWatchResponse> {
    return await createInitialWatchData(data);
  }

  async updateWatchPrice(watch: EventWatch): Promise<PriceUpdateResponse> {
    return await fetchPriceUpdate(watch);
  }
}

/**
 * Phase 2 Implementation: Backend API calls
 * 
 * Uncomment and implement this when ready for Phase 2:
 * 
 * class Phase2ApiService implements IApiService {
 *   private baseUrl: string;
 * 
 *   constructor(baseUrl: string = process.env.API_BASE_URL || 'http://localhost:3001/api') {
 *     this.baseUrl = baseUrl;
 *   }
 * 
 *   async createWatch(data: CreateWatchRequest): Promise<CreateWatchResponse> {
 *     const response = await fetch(`${this.baseUrl}/watches`, {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify(data),
 *     });
 * 
 *     if (!response.ok) {
 *       throw new Error(`Failed to create watch: ${response.statusText}`);
 *     }
 * 
 *     return await response.json();
 *   }
 * 
 *   async updateWatchPrice(watch: EventWatch): Promise<PriceUpdateResponse> {
 *     const response = await fetch(`${this.baseUrl}/watches/${watch.id}/price`, {
 *       method: 'GET',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *     });
 * 
 *     if (!response.ok) {
 *       throw new Error(`Failed to update price: ${response.statusText}`);
 *     }
 * 
 *     return await response.json();
 *   }
 * }
 */

// Export the current implementation (Phase 1)
// To switch to Phase 2, change this to: export const apiService = new Phase2ApiService();
export const apiService: IApiService = new Phase1ApiService();

