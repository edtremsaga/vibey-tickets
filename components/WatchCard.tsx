import React from 'react';
import { EventWatch } from '../types';
import RefreshIcon from './icons/RefreshIcon';
import TrashIcon from './icons/TrashIcon';
import LoadingSpinner from './LoadingSpinner';

interface WatchCardProps {
  watch: EventWatch;
  onRefresh: (id: string) => void;
  onDelete: (id: string) => void;
  isRefreshing: boolean;
}

const WatchCard: React.FC<WatchCardProps> = ({ watch, onRefresh, onDelete, isRefreshing }) => {
  const { eventName, venueName, venueLocation, date, targetPrice, numTickets, currentPrice, broker, status, lastChecked } = watch;

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC'
  });

  const timeSinceCheck = lastChecked ? new Date(lastChecked).toLocaleString() : 'Never';
  
  const isPriceAlert = status === 'alert';
  const isChecking = isRefreshing;

  const statusStyles = {
    watching: 'border-blue-700/50',
    alert: 'border-green-700/50 shadow-lg shadow-green-900/50',
    error: 'border-red-700/50',
  };

  const borderClass = isChecking ? 'border-yellow-700/50 animate-pulse' : statusStyles[status];

  return (
    <div className={`flex flex-col bg-gray-800/50 p-5 rounded-2xl border ${borderClass} transition-all`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white lowercase">{eventName.toLowerCase()}</h3>
            <p className="text-sm text-gray-400 lowercase">{venueName.toLowerCase()}</p>
            <p className="text-sm text-gray-400 lowercase">{venueLocation.toLowerCase()}</p>
            <p className="text-sm text-gray-400 mt-1">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefresh(watch.id)}
              disabled={isRefreshing || isChecking}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 transition-colors"
              aria-label="Refresh price"
            >
              {isRefreshing || isChecking ? <LoadingSpinner className="w-4 h-4" /> : <RefreshIcon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDelete(watch.id)}
              className="p-2 rounded-full text-gray-400 hover:bg-red-800/50 hover:text-red-300 transition-colors"
              aria-label="Delete watch"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`my-4 p-4 rounded-lg grid grid-cols-2 gap-4 text-center border ${isPriceAlert ? 'bg-green-900/20 border-green-800' : 'bg-gray-900/30 border-gray-700/50'}`}>
            <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">YOUR TARGET</p>
                <p className="text-2xl font-bold text-purple-400">${targetPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">(${ (targetPrice * numTickets).toFixed(2) } total for {numTickets})</p>
            </div>
            <div>
                <p className="text-xs text-gray-400 uppercase font-semibold">CURRENT PRICE</p>
                <p className={`text-2xl font-bold ${isPriceAlert ? 'text-green-400' : 'text-white'}`}>${currentPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">(@ {broker})</p>
            </div>
        </div>
      </div>
      
      <div className="border-t border-gray-700/50 pt-3 mt-auto">
          <p className="text-xs text-gray-500 text-center">Last checked: {timeSinceCheck}</p>
      </div>
    </div>
  );
};

export default WatchCard;
