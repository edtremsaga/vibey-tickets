import React, { useState } from 'react';
import { EventWatch } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { validateWatchForm } from '../utils/validation';

interface AddWatchFormProps {
  onAddWatch: (watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>) => Promise<void>;
  onClose: () => void;
}

const AddWatchForm: React.FC<AddWatchFormProps> = ({ onAddWatch, onClose }) => {
  const [formData, setFormData] = useState({
    eventName: '',
    venueName: '',
    venueLocation: '',
    date: '',
    targetPrice: '',
    numTickets: '1',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const missingFields: string[] = [];
    (Object.keys(formData) as Array<keyof typeof formData>).forEach((key) => {
        if (formData[key].trim() === '') {
            let fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
            if (key === 'eventName') fieldName = 'Event Name';
            if (key === 'venueName') fieldName = 'Event Venue';
            if (key === 'venueLocation') fieldName = 'Venue Location';
            if (key === 'targetPrice') fieldName = 'Target Price';
            if (key === 'numTickets') fieldName = '# of Tickets';
            missingFields.push(fieldName);
        }
    });

    if (missingFields.length > 0) {
        setError(`Please fill in the following required fields: ${missingFields.join(', ')}.`);
        return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
        await onAddWatch({
            ...formData,
            eventName: formData.eventName.trim(),
            venueName: formData.venueName.trim(),
            venueLocation: formData.venueLocation.trim(),
            targetPrice: parseFloat(formData.targetPrice),
            numTickets: parseInt(formData.numTickets, 10),
        });
        // Reset form
        setFormData({
          eventName: '',
          venueName: '',
          venueLocation: '',
          date: '',
          targetPrice: '',
          numTickets: '1',
        });
    } catch (formError) {
        setError('An unexpected error occurred while creating the watch. Please try again.');
        console.error(formError);
        setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-40" onClick={onClose}>
      <div className="relative max-w-lg w-full mx-auto bg-gray-800 p-6 sm:p-8 rounded-2xl border border-gray-700 shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-2">Add New Watch</h2>
        <p className="text-gray-400 mb-6">Enter event details to start tracking.</p>

        <form onSubmit={handleSubmit} noValidate>
          {error && <p className="bg-red-900/50 text-red-300 border border-red-700 rounded-lg p-3 mb-4 text-sm">{error}</p>}
          
          <div className="space-y-4">
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-300 mb-1">Event Name</label>
              <input type="text" id="eventName" name="eventName" value={formData.eventName} onChange={handleChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="venueName" className="block text-sm font-medium text-gray-300 mb-1">Event Venue</label>
                  <input type="text" id="venueName" name="venueName" value={formData.venueName} onChange={handleChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" />
                </div>
                <div>
                  <label htmlFor="venueLocation" className="block text-sm font-medium text-gray-300 mb-1">Venue Location</label>
                  <input type="text" id="venueLocation" name="venueLocation" placeholder="e.g., Seattle, WA" value={formData.venueLocation} onChange={handleChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" />
                </div>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">Event Date</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="targetPrice" className="block text-sm font-medium text-gray-300 mb-1">Target Price ($)</label>
                    <input type="number" id="targetPrice" name="targetPrice" value={formData.targetPrice} onChange={handleChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" min="0" />
                </div>
                <div>
                    <label htmlFor="numTickets" className="block text-sm font-medium text-gray-300 mb-1"># of Tickets</label>
                    <input type="number" id="numTickets" name="numTickets" value={formData.numTickets} onChange={handleChange} className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-purple-500" min="1" />
                </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-white font-medium py-2 px-4 rounded-lg">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-purple-800 disabled:cursor-not-allowed flex items-center">
              {isSubmitting && <LoadingSpinner className="w-5 h-5 -ml-1 mr-2" />}
              {isSubmitting ? 'Adding...' : 'Add Watch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWatchForm;
