'use client';

import React, { useState, useEffect } from 'react';
import { EventWatch } from '../types';
import AddWatchForm from '../components/AddWatchForm';
import WatchCard from '../components/WatchCard';
import { apiService } from '../services/apiService';
import PlusIcon from '../components/icons/PlusIcon';
import Introduction from '../components/Introduction';
import ConfirmationModal from '../components/ConfirmationModal';
import { loadWatchesFromStorage, saveWatchesToStorage } from '../utils/storage';

export default function Home() {
  const [watches, setWatches] = useState<EventWatch[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingWatches, setLoadingWatches] = useState<Set<string>>(new Set());
  const [watchToDelete, setWatchToDelete] = useState<EventWatch | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load watches from localStorage after mount to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    const loadedWatches = loadWatchesFromStorage();
    setWatches(loadedWatches);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const success = saveWatchesToStorage(watches);
      if (!success) {
        setError('Failed to save watches to storage. Your data may not persist.');
        setTimeout(() => setError(null), 5000);
      }
    }
  }, [watches, isMounted]);

  const handleAddWatch = async (watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>) => {
    try {
      setError(null);
      const { currentPrice, broker } = await apiService.createWatch(watchData);
      
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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create watch. Please try again.';
      setError(errorMessage);
      console.error('Error adding watch:', err);
      throw err;
    }
  };

  const handleRefreshWatch = async (id: string) => {
    const watchToUpdate = watches.find(w => w.id === id);
    if (!watchToUpdate) return;

    setLoadingWatches(prev => new Set(prev).add(id));
    
    try {
      const { currentPrice, broker } = await apiService.updateWatchPrice(watchToUpdate);
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Vibey Tickets
          </h1>
          {error && (
            <div className="mt-4 max-w-2xl mx-auto bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}
        </header>

        <Introduction />

        <div className="text-center mb-8">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center mx-auto"
            aria-label="Add new watch"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Watch
          </button>
        </div>
        
        {watches.length > 0 ? (
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
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-400">You're not watching any events yet.</p>
            <p className="text-gray-500 text-sm mt-2">Click "Add New Watch" to get started.</p>
          </div>
        )}

        {isAddModalOpen && (
          <AddWatchForm onAddWatch={handleAddWatch} onClose={() => setIsAddModalOpen(false)} />
        )}
        
        <ConfirmationModal
          isOpen={!!watchToDelete}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteWatch}
          title="Delete Watch"
        >
          <p>Are you sure you want to stop watching this event? This action cannot be undone.</p>
        </ConfirmationModal>

      </main>
      <footer className="text-center py-4 mt-8 border-t border-gray-800">
        <p className="text-xs text-gray-600">Your watches are saved locally in this browser.</p>
      </footer>

    </div>
  );
}

