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

const statusConfig = {
  watching: {
    label: 'Watching',
    bgColor: 'bg-blue-900/50 border-blue-700',
    textColor: 'text-blue-300',
    dotColor: 'bg-blue-400',
    message: 'Price is above your target. We\'re keeping an eye on it.'
  },
  alert: {
    label: 'Price Alert!',
    bgColor: 'bg-green-900/50 border-green-700',
    textColor: 'text-green-300',
    dotColor: 'bg-green-400 animate-pulse',
    message: 'Price is at or below your target! Now might be a good time to buy.'
  },
  error: {
    label: 'Error',
    bgColor: 'bg-red-900/50 border-red-700',
    textColor: 'text-red-300',
    dotColor: 'bg-red-400',
    message: 'There was an error checking the price. Please try again.'
  }
};


const WatchCard: React.FC<WatchCardProps> = ({ watch, onRefresh, onDelete, isRefreshing }) => {
  const { eventName, venueName, venueLocation, date, targetPrice, numTickets, currentPrice, broker, status, lastChecked } = watch;
  const config = statusConfig[status];

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Treat date string as UTC to avoid off-by-one day errors
  });

  const timeSinceCheck = lastChecked ? new Date(lastChecked).toLocaleString() : 'Never';
  
  const priceDifference = currentPrice - targetPrice;
  const isPriceGood = priceDifference <= 0;

  return (
    <div className={`flex flex-col rounded-2xl border p-5 transition-shadow hover:shadow-lg hover:shadow-purple-900/20 ${config.bgColor}`}>
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white">{eventName}</h3>
            <p className="text-sm text-gray-400">{venueName}, {venueLocation}</p>
            <p className="text-sm text-gray-400">{formattedDate}</p>
          </div>
          <div className={`flex items-center gap-2 text-sm font-medium py-1 px-3 rounded-full ${config.bgColor} ${config.textColor}`}>
            <span className={`w-2 h-2 rounded-full ${config.dotColor}`}></span>
            {config.label}
          </div>
        </div>

        <div className="my-4 grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 uppercase font-semibold">Current Price</p>
                <p className="text-2xl font-bold text-white">${currentPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">via {broker}</p>
            </div>
            <div className="bg-gray-800/50 p-3 rounded-lg">
                <p className="text-xs text-gray-400 uppercase font-semibold">Target Price</p>
                <p className="text-2xl font-bold text-purple-400">${targetPrice.toFixed(2)}</p>
                <p className="text-xs text-gray-500">for {numTickets} ticket{numTickets > 1 ? 's' : ''}</p>
            </div>
        </div>

        <div className={`p-3 rounded-lg text-center text-sm mb-4 ${isPriceGood ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
          {isPriceGood
            ? `Price is $${Math.abs(priceDifference).toFixed(2)} below your target!`
            : `Price is $${priceDifference.toFixed(2)} above your target.`
          }
        </div>
        
        <p className="text-xs text-center text-gray-500 italic mb-4">{config.message}</p>
      </div>

      <div className="border-t border-gray-700 pt-4 mt-auto">
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">Last checked: {timeSinceCheck}</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onRefresh(watch.id)}
              disabled={isRefreshing}
              className="p-2 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
              aria-label="Refresh price"
            >
              {isRefreshing ? <LoadingSpinner className="w-4 h-4" /> : <RefreshIcon className="w-4 h-4" />}
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
      </div>
    </div>
  );
};

export default WatchCard;
