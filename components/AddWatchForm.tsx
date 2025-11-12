import React, { useState } from 'react';
import { EventWatch } from '../types';
import PlusIcon from './icons/PlusIcon';
import LoadingSpinner from './LoadingSpinner';

interface AddWatchFormProps {
  onAddWatch: (watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>) => Promise<void>;
  onClose: () => void;
}

const AddWatchForm: React.FC<AddWatchFormProps> = ({ onAddWatch, onClose }) => {
  const [eventName, setEventName] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueLocation, setVenueLocation] = useState('');
  const [date, setDate] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [numTickets, setNumTickets] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const missingFields: string[] = [];
    if (!eventName) missingFields.push('Event Name');
    if (!venueName) missingFields.push('Venue');
    if (!venueLocation) missingFields.push('Venue Location');
    if (!date) missingFields.push('Date');
    if (!targetPrice) missingFields.push('Target Price ($)');
    if (!numTickets) missingFields.push('Number of Tickets');

    if (missingFields.length > 0) {
      setError(`Please fill in the following required fields: ${missingFields.join(', ')}.`);
      return;
    }

    setError(null);
    setIsSubmitting(true);
    
    try {
        await onAddWatch({
            eventName,
            venueName,
            venueLocation,
            date,
            targetPrice: parseFloat(targetPrice),
            numTickets: parseInt(numTickets, 10),
        });
        // Parent component will close the modal
    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setIsSubmitting(false); // only keep submitting state on success
    }
  };

  return (
    <div className="relative max-w-2xl w-full mx-auto bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-1">Add New Watch</h2>
      <p className="text-gray-400 mb-6">Enter event details to start tracking.</p>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
          <input
            type="text"
            id="eventName"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            placeholder="e.g., Taylor Swift: The Eras Tour"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500 transition"
            
          />
        </div>
        <div>
          <label htmlFor="venueName" className="block text-sm font-medium text-gray-300 mb-1">Venue</label>
          <input
            type="text"
            id="venueName"
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            placeholder="e.g., SoFi Stadium"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500 transition"
            
          />
        </div>
        <div>
          <label htmlFor="venueLocation" className="block text-sm font-medium text-gray-300 mb-1">Venue Location</label>
          <input
            type="text"
            id="venueLocation"
            value={venueLocation}
            onChange={(e) => setVenueLocation(e.target.value)}
            placeholder="e.g., Inglewood, CA"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500 transition"
            
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500 transition"
            
          />
        </div>
        <div>
          <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-300 mb-1">Target Price ($)</label>
          <input
            type="number"
            id="targetPrice"
            value={targetPrice}
            onChange={(e) => setTargetPrice(e.target.value)}
            placeholder="e.g., 350"
            min="0"
            className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500 transition"
            
          />
        </div>
        <div className="md:col-span-2">
           <label htmlFor="numTickets" className="block text-sm font-medium text-gray-300 mb-1">Number of Tickets</label>
            <input
                type="number"
                id="numTickets"
                value={numTickets}
                onChange={(e) => setNumTickets(e.target.value)}
                min="1"
                className="w-full bg-gray-900/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-purple-500 focus:border-purple-500 transition"
                
            />
        </div>
        {error && <p className="text-red-400 md:col-span-2 text-sm text-center bg-red-900/20 py-2 px-4 rounded-md border border-red-500/30">{error}</p>}
        <div className="md:col-span-2 flex justify-end items-center gap-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="flex justify-center items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-900 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
          >
            {isSubmitting ? <LoadingSpinner /> : <PlusIcon className="w-5 h-5" />}
            <span>{isSubmitting ? 'Adding...' : 'Add Watch'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddWatchForm;