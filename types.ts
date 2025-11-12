
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