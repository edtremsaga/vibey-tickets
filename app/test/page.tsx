'use client';

import React, { useState } from 'react';

interface TicketmasterEvent {
  name: string;
  id: string;
  url: string;
  dates: {
    start: {
      localDate: string;
      localTime: string;
    };
  };
  _embedded: {
    venues: Array<{
      name: string;
      city: { name: string };
      state: { name: string };
      address: { line1: string };
    }>;
  };
  priceRanges?: Array<{
    type: string;
    currency: string;
    min: number;
    max: number;
  }>;
}

export default function TicketmasterTestPage() {
  const [keyword, setKeyword] = useState('Taylor Swift');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState<number | null>(null);

  const searchEvents = async () => {
    setLoading(true);
    setError(null);
    setEvents([]);

    try {
      const params = new URLSearchParams({
        keyword: keyword,
      });
      
      if (city) {
        params.append('city', city);
      }

      const response = await fetch(`/api/ticketmaster?${params.toString()}`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch events');
      }

      setEvents(data.events || []);
      setTotalResults(data.totalResults || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Ticketmaster API Test
        </h1>
        <p className="text-gray-400 mb-8">
          Test the Ticketmaster Discovery API integration
        </p>

        {/* Search Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="keyword" className="block text-sm font-medium text-gray-300 mb-2">
                Search Keyword
              </label>
              <input
                id="keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g., Taylor Swift, Concert"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                City (Optional)
              </label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g., New York, Los Angeles"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={searchEvents}
                disabled={loading || !keyword.trim()}
                className="w-full px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
              >
                {loading ? 'Searching...' : 'Search Events'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Results Count */}
        {totalResults !== null && (
          <div className="mb-4 text-gray-400">
            Found <strong className="text-white">{totalResults}</strong> event{totalResults !== 1 ? 's' : ''}
          </div>
        )}

        {/* Events List */}
        {events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-purple-500 transition-colors"
              >
                <h3 className="text-xl font-bold mb-2 text-white">{event.name}</h3>
                
                {event._embedded?.venues?.[0] && (
                  <div className="text-sm text-gray-400 mb-3">
                    <p className="font-medium text-gray-300">
                      {event._embedded.venues[0].name}
                    </p>
                    <p>
                      {event._embedded.venues[0].address?.line1}
                    </p>
                    <p>
                      {event._embedded.venues[0].city.name}, {event._embedded.venues[0].state.name}
                    </p>
                  </div>
                )}

                {event.dates?.start && (
                  <div className="text-sm text-gray-400 mb-3">
                    <p>
                      <strong className="text-gray-300">Date:</strong> {event.dates.start.localDate}
                    </p>
                    {event.dates.start.localTime && (
                      <p>
                        <strong className="text-gray-300">Time:</strong> {event.dates.start.localTime}
                      </p>
                    )}
                  </div>
                )}

                {event.priceRanges && event.priceRanges.length > 0 && (
                  <div className="text-sm mb-3">
                    <p className="text-gray-400">
                      <strong className="text-gray-300">Price Range:</strong>
                    </p>
                    {event.priceRanges.map((range, idx) => (
                      <p key={idx} className="text-purple-400">
                        ${range.min.toFixed(2)} - ${range.max.toFixed(2)} {range.currency}
                      </p>
                    ))}
                  </div>
                )}

                <a
                  href={event.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View on Ticketmaster →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && events.length === 0 && !error && totalResults === null && (
          <div className="text-center py-12 text-gray-400">
            <p>Enter a search term and click "Search Events" to test the Ticketmaster API</p>
          </div>
        )}
      </div>
    </div>
  );
}

