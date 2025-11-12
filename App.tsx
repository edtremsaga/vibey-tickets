import React, { useState, useEffect } from 'react';
import { EventWatch } from './types';
import AddWatchForm from './components/AddWatchForm';
import WatchCard from './components/WatchCard';
import { createInitialWatchData, fetchPriceUpdate } from './services/geminiService';
import PlusIcon from './components/icons/PlusIcon';
import Introduction from './components/Introduction';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [watches, setWatches] = useState<EventWatch[]>(() => {
    try {
      const savedWatches = localStorage.getItem('ticketWatches');
      return savedWatches ? JSON.parse(savedWatches) : [];
    } catch (error) {
      console.error("Failed to parse watches from localStorage", error);
      return [];
    }
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingWatches, setLoadingWatches] = useState<Set<string>>(new Set());
  const [watchToDelete, setWatchToDelete] = useState<EventWatch | null>(null);

  useEffect(() => {
    localStorage.setItem('ticketWatches', JSON.stringify(watches));
  }, [watches]);

  const handleAddWatch = async (watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>) => {
    const { currentPrice, broker } = await createInitialWatchData(watchData);
    
    const newWatch: EventWatch = {
      ...watchData,
      id: crypto.randomUUID(),
      currentPrice,
      broker,
      status: currentPrice <= watchData.targetPrice ? 'alert' : 'watching',
      lastChecked: new Date().toISOString(),
    };

    setWatches(prevWatches => [newWatch, ...prevWatches]);
    setIsAddModalOpen(false);
  };

  const handleRefreshWatch = async (id: string) => {
    const watchToUpdate = watches.find(w => w.id === id);
    if (!watchToUpdate) return;

    setLoadingWatches(prev => new Set(prev).add(id));
    
    try {
      const { currentPrice, broker } = await fetchPriceUpdate(watchToUpdate);
      setWatches(prevWatches => 
        prevWatches.map(w => 
          w.id === id 
            ? { 
                ...w, 
                currentPrice,
                broker,
                status: currentPrice <= w.targetPrice ? 'alert' : 'watching',
                lastChecked: new Date().toISOString(),
              } 
            : w
        )
      );
    } catch (error) {
      console.error("Failed to refresh watch:", error);
      setWatches(prevWatches =>
        prevWatches.map(w =>
          w.id === id ? { ...w, status: 'error', lastChecked: new Date().toISOString() } : w
        )
      );
    } finally {
      setLoadingWatches(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  const handleDeleteWatch = () => {
    if (!watchToDelete) return;
    setWatches(prevWatches => prevWatches.filter(w => w.id !== watchToDelete.id));
    setWatchToDelete(null);
  };
  
  const openDeleteModal = (watch: EventWatch) => {
    setWatchToDelete(watch);
  };

  const closeDeleteModal = () => {
    setWatchToDelete(null);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-2">
            Vibey Tickets
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Never miss a price drop. Set your target price for any event, and let our AI-powered watcher alert you when it's time to buy.
          </p>
        </header>

        <div className="text-center mb-10">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex mx-auto items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105"
          >
            <PlusIcon className="w-5 h-5"/>
            Add New Watch
          </button>
        </div>

        {watches.length === 0 ? (
          <Introduction />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watches.map(watch => (
              <WatchCard 
                key={watch.id}
                watch={watch}
                onRefresh={handleRefreshWatch}
                onDelete={() => openDeleteModal(watch)}
                isRefreshing={loadingWatches.has(watch.id)}
              />
            ))}
          </div>
        )}
        
      </main>

      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
           <AddWatchForm onAddWatch={handleAddWatch} onClose={() => setIsAddModalOpen(false)} />
        </div>
      )}

      {watchToDelete && (
        <ConfirmationModal
          isOpen={!!watchToDelete}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteWatch}
          title="Delete Watch"
        >
          Are you sure you want to delete the watch for <span className="font-bold">{watchToDelete.eventName}</span>? This action cannot be undone.
        </ConfirmationModal>
      )}

    </div>
  );
};

export default App;