# Phase 2 Migration Guide

This document outlines the steps needed to migrate from Phase 1 (Frontend MVP) to Phase 2 (Backend & Full-Stack Integration).

## Overview

Phase 1 uses client-side simulation with Google Gemini AI. Phase 2 will integrate with a real backend API that monitors actual ticket prices from brokers.

## Architecture Changes

### Current (Phase 1)
- Frontend-only application
- Price simulation via Gemini AI
- localStorage for data persistence
- All logic runs in the browser

### Target (Phase 2)
- Full-stack application
- Backend API for price monitoring
- Database for persistent storage
- Real broker API integrations
- Background jobs for price checking
- Email/push notifications

## Migration Steps

### 1. Backend API Development

Create a backend API with the following endpoints:

#### Required Endpoints

**Create Watch**
```
POST /api/watches
Body: {
  eventName: string
  venueName: string
  venueLocation: string
  date: string (ISO format)
  targetPrice: number
  numTickets: number
}
Response: {
  id: string
  currentPrice: number
  broker: string
  status: 'watching' | 'alert'
}
```

**Update Watch Price**
```
GET /api/watches/:id/price
Response: {
  currentPrice: number
  broker: string
  lastChecked: string (ISO format)
}
```

**Get All Watches**
```
GET /api/watches
Response: EventWatch[]
```

**Delete Watch**
```
DELETE /api/watches/:id
```

### 2. Frontend Changes

#### Update API Service

1. Open `services/apiService.ts`
2. Uncomment the `Phase2ApiService` class
3. Update the export at the bottom:
   ```typescript
   export const apiService: IApiService = new Phase2ApiService();
   ```

#### Environment Variables

Add to `.env`:
```
API_BASE_URL=http://localhost:3001/api
```

For production:
```
API_BASE_URL=https://api.vibeytickets.com/api
```

#### Update App.tsx

The main `App.tsx` file should be updated to:
- Fetch watches from the API on mount
- Remove localStorage usage (or keep as backup/cache)
- Handle API errors appropriately

### 3. Database Schema

Design a database schema for storing watches:

```sql
CREATE TABLE watches (
  id UUID PRIMARY KEY,
  user_id UUID, -- For multi-user support
  event_name VARCHAR(255) NOT NULL,
  venue_name VARCHAR(255) NOT NULL,
  venue_location VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  target_price DECIMAL(10, 2) NOT NULL,
  num_tickets INTEGER NOT NULL,
  current_price DECIMAL(10, 2),
  broker VARCHAR(100),
  status VARCHAR(20) CHECK (status IN ('watching', 'alert', 'error')),
  last_checked TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 4. Background Jobs

Implement a background job system to:
- Periodically check prices for all active watches
- Update database with new prices
- Send notifications when prices drop below target
- Handle rate limiting for broker APIs

### 5. Broker API Integration

Integrate with real ticket broker APIs:
- SeatGeek API
- Ticketmaster API
- StubHub API

**Note**: Many brokers don't have public APIs. You may need to:
- Use web scraping (with proper rate limiting and respect for ToS)
- Use third-party aggregator services
- Partner with brokers for API access

### 6. Notification System

Implement:
- Email notifications (using SendGrid, AWS SES, etc.)
- Push notifications (if building a mobile app)
- In-app notifications
- SMS notifications (optional)

## Testing Strategy

1. **Unit Tests**: Test API service layer with mocked responses
2. **Integration Tests**: Test API endpoints with test database
3. **E2E Tests**: Test full flow from frontend to backend
4. **Load Tests**: Ensure backend can handle concurrent price checks

## Deployment

### Frontend
- Deploy to Vercel, Netlify, or similar
- Set `API_BASE_URL` environment variable

### Backend
- Deploy to AWS, Heroku, Railway, or similar
- Set up database (PostgreSQL recommended)
- Configure background job workers
- Set up monitoring and logging

## Rollback Plan

If issues arise:
1. Revert `apiService.ts` to use `Phase1ApiService`
2. Frontend will continue working with simulated data
3. No data loss if you keep localStorage as backup

## Timeline Estimate

- Backend API: 2-3 weeks
- Database setup: 1 week
- Broker integrations: 2-4 weeks (varies by broker)
- Background jobs: 1 week
- Testing & deployment: 1 week

**Total**: 7-10 weeks for full Phase 2 implementation

## Questions to Consider

1. **Authentication**: Will you need user accounts?
2. **Multi-user**: Single user or multiple users?
3. **Pricing**: Free or paid service?
4. **Rate Limits**: How often can you check prices?
5. **Legal**: Terms of service for broker APIs/scraping

