# Product Requirements Document: Vibey Tickets
## (MVP) - v5.3-PHASED-MVP

---

## 1. Introduction & Vision

### Problem
Budget-conscious fans struggle to find affordable tickets for live events because:
- **Prices are expensive**: Ticket prices are often prohibitively high
- **Prices are volatile**: Ticket prices fluctuate significantly over time
- **Hidden costs**: The total "all-in" cost often includes costly broker fees, making it difficult to compare prices across different brokers (like SeatGeek, Ticketmaster, and StubHub)
- **Time-consuming**: Manually checking and comparing prices across multiple brokers is frustrating and time-consuming

### Solution
Vibey Tickets is a smart price-watching web application, accessible via a browser, that automates the search for the best event ticket deal. Users define an event and a target price, and the app monitors major brokers, notifying the user when tickets are available at or below their desired price point. The focus is on the total "all-in" cost, which includes ticket price and broker fees.

### Target Audience (MVP)
Music event enthusiasts who are willing to wait for event prices to drop to their level of affordability on the resale market.

---

## 2. Phased Development Plan

The Minimum Viable Product (MVP) will be built in two distinct phases:

### Phase 1 - Frontend MVP
Build a fully interactive, client-side web application with simulated backend logic. The purpose is to allow for complete development and testing of the user interface and user experience.

### Phase 2 - Backend & Full-Stack Integration
Create the backend services and integrate them with the frontend to build a complete, functional application.

---

## 3. Phase 1: Frontend MVP Features

### 3.1. Create & Manage Vibe Watches (UI)

#### Creation Methods (Prioritized for UI)

The user interface will support three methods for creating a "watch" (for tracking ticket prices), in the following order of priority:

**Priority 1 - Manual Form Entry**
- This will be a clean, straightforward form
- Designated as the primary and most prominent action
- ✅ **Status: Implemented**

**Priority 2 - Screenshot Parsing**
- This is a secondary option where the user can upload a screenshot
- **Note**: "No development for this option until manual form entry is working"
- ⏳ **Status: Pending** (Manual form is now working, ready for development)

**Priority 3 (nice to have) - URL Parsing**
- This is a tertiary, less prominent option where the user can provide a URL
- **Note**: "No initial development on this option"
- ⏳ **Status: Not Started**

---

## Development Status

### Phase 1: Frontend MVP
- ✅ Manual form entry for creating watches
- ✅ Client-side price simulation
- ✅ Local storage persistence
- ⏳ Screenshot parsing (Priority 2)
- ⏳ URL parsing (Priority 3)

### Phase 2: Backend & Full-Stack Integration
- Backend API for price monitoring
- Database integration
- Real broker API connections
- Email/push notifications

---

## Notes

- Focus on total "all-in" cost (ticket price + broker fees)
- Monitor major brokers: SeatGeek, Ticketmaster, StubHub
- Notify users when prices drop to or below target price
- MVP targets music event enthusiasts

