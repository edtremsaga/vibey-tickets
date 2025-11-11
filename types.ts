// Fix: Define and export the EventWatch interface based on its usage in the application.
export interface EventWatch {
  id: string;
  eventName: string;
  venueName: string;
  venueLocation: string;
  date: string;
  targetPrice: number;
  numTickets: number;
  currentPrice: number;
  broker: string;
  status: 'watching' | 'alert' | 'error';
  lastChecked: string;
}
