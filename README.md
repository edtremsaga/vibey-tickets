<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Vibey Tickets

A smart price-watching web application that helps budget-conscious fans track ticket prices for live events and get notified when prices drop to their target level.

## Features

- **Create Vibe Watches**: Set up price alerts for any event with your target price
- **Real-time Monitoring**: Track prices across major ticket brokers (simulated in MVP)
- **Smart Notifications**: Get alerted when prices drop to or below your target
- **Persistent Storage**: Your watches are saved locally and persist between sessions

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (for price simulation in MVP)
- **Storage**: localStorage (Phase 1 MVP)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Gemini API key ([Get one here](https://aistudio.google.com/apikey))

## Setup & Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/edtremsaga/vibey-tickets.git
   cd vibey-tickets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
vibey-tickets/
├── components/          # React components
│   ├── AddWatchForm.tsx
│   ├── WatchCard.tsx
│   └── ...
├── services/           # Service layer (API calls, etc.)
│   └── geminiService.ts
├── types.ts           # TypeScript type definitions
├── App.tsx            # Main application component
└── index.tsx          # Application entry point
```

## Development Phases

### Phase 1: Frontend MVP (Current)
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

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

Private project - All rights reserved
