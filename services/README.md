# Services Layer

This directory contains service layer abstractions for API calls and external integrations.

## Current Implementation (Phase 1)

- **`apiService.ts`**: Abstraction layer that currently uses Gemini AI for price simulation
- **`geminiService.ts`**: Direct implementation using Google Gemini API for simulated price data

## Phase 2 Migration

When ready to integrate with a backend API:

1. Update `apiService.ts` to use the `Phase2ApiService` class instead of `Phase1ApiService`
2. Implement the backend API endpoints:
   - `POST /api/watches` - Create a new watch
   - `GET /api/watches/:id/price` - Get updated price for a watch
3. Set the `API_BASE_URL` environment variable to point to your backend
4. The frontend code in `App.tsx` will automatically use the new implementation without changes

## Benefits of This Architecture

- **Clean separation**: Frontend components don't need to know about implementation details
- **Easy migration**: Switch from Phase 1 to Phase 2 by changing one line
- **Testable**: Can easily mock the API service for testing
- **Type-safe**: TypeScript interfaces ensure consistency

