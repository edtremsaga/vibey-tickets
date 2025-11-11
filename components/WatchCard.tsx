import React, { useState } from 'react';
import { EventWatch } from '../types';
import RefreshIcon from './icons/RefreshIcon';
import TrashIcon from './icons/TrashIcon';
import LoadingSpinner from './LoadingSpinner';

interface WatchCardProps {
  watch: EventWatch;
  onRemove: (id: string) => void;
  onRefresh: (id:string) => void;
}

const WatchCard: React.FC<WatchCardProps> = ({ watch, onRemove, onRefresh }) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await onRefresh(watch.id);
        setIsRefreshing(false);
    }

    const statusClasses = {
        watching: 'bg-gray-800 border-gray-700',
        alert: 'bg-green-900/50 border-green-600 animate-pulse',
        error: 'bg-red-900/50 border-red-700',
    };
    
    const totalCurrentPrice = watch.currentPrice * watch.numTickets;
    const totalTargetPrice = watch.targetPrice * watch.numTickets;

    return (
        <div className={`p-5 rounded-xl border flex flex-col justify-between transition-all duration-300 shadow-lg ${statusClasses[watch.status]}`}>
            <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-white leading-tight pr-2">{watch.eventName}</h3>
                    <div className="flex space-x-2 flex-shrink-0">
                        <button onClick={handleRefresh} disabled={isRefreshing} className="text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors p-1">
                            <span className="sr-only">Refresh Price</span>
                            {isRefreshing ? <LoadingSpinner className="w-5 h-5" /> : <RefreshIcon className="w-5 h-5" />}
                        </button>
                        <button onClick={() => onRemove(watch.id)} className="text-gray-400 hover:text-red-400 transition-colors p-1">
                            <span className="sr-only">Delete Watch</span>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <div className="text-sm text-gray-400 mb-4">
                    <p>{watch.venueName}</p>
                    <p>{watch.venueLocation}</p>
                    <p className="font-medium text-gray-300 mt-1">{new Date(watch.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>


                <div className="grid grid-cols-2 gap-4 text-center my-4 py-4 border-y border-gray-700">
                    <div>
                        <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Your Target</p>
                        <p className="text-3xl font-bold text-white">${watch.targetPrice}</p>
                        <p className="text-xs text-gray-400">(${totalTargetPrice} total for {watch.numTickets})</p>
                    </div>
                    <div>
                        <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Current Price</p>
                        <p className={`text-3xl font-bold ${watch.status === 'alert' ? 'text-green-400' : 'text-white'}`}>
                            ${watch.currentPrice}
                        </p>
                        <p className="text-xs text-gray-400">(@ {watch.broker})</p>
                    </div>
                </div>
            </div>

            <div className="text-xs text-gray-500 mt-2 text-center">
                {watch.status === 'alert' && <p className="text-green-400 font-semibold mb-2">Price alert! Your target has been met or beaten.</p>}
                {watch.status === 'error' && <p className="text-red-400 font-semibold mb-2">Error checking price. Please try again.</p>}
                <p>Last checked: {new Date(watch.lastChecked).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default WatchCard;