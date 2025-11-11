import React, { useState, useEffect } from 'react';
import { EventWatch } from './types';
import { createInitialWatchData, fetchPriceUpdate } from './services/geminiService';
import AddWatchForm from './components/AddWatchForm';
import WatchCard from './components/WatchCard';
import Introduction from './components/Introduction';
import SparklesIcon from './components/icons/SparklesIcon';
import PlusIcon from './components/icons/PlusIcon';

function App() {
  const [watches, setWatches] = useState<EventWatch[]>(() => {
    try {
      const savedWatches = localStorage.getItem('vibey-ticket-watches');
      return savedWatches ? JSON.parse(savedWatches) : [];
    } catch (error) {
      console.error("Could not parse watches from localStorage", error);
      return [];
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('vibey-ticket-watches', JSON.stringify(watches));
  }, [watches]);

  const handleAddWatch = async (
    watchData: Omit<EventWatch, 'id' | 'currentPrice' | 'broker' | 'status' | 'lastChecked'>
  ) => {
    const initialPriceData = await createInitialWatchData(watchData);
    const newWatch: EventWatch = {
      ...watchData,
      id: crypto.randomUUID(),
      ...initialPriceData,
      status: 'watching',
      lastChecked: new Date().toISOString(),
    };
    setWatches(prevWatches => [newWatch, ...prevWatches]);
    setIsModalOpen(false); // Close modal on success
  };

  const handleRemoveWatch = (id: string) => {
    setWatches(prevWatches => prevWatches.filter(watch => watch.id !== id));
  };

  const handleRefreshWatch = async (id: string) => {
    const watchToUpdate = watches.find(w => w.id === id);
    if (!watchToUpdate) return;

    try {
      const updatedPriceData = await fetchPriceUpdate(watchToUpdate);
      setWatches(prevWatches =>
        prevWatches.map(watch =>
          watch.id === id
            ? {
                ...watch,
                ...updatedPriceData,
                lastChecked: new Date().toISOString(),
                status: updatedPriceData.currentPrice <= watch.targetPrice ? 'alert' : 'watching',
              }
            : watch
        )
      );
    } catch (error) {
      console.error("Failed to refresh watch", error);
      setWatches(prevWatches =>
        prevWatches.map(watch =>
          watch.id === id
            ? {
                ...watch,
                status: 'error',
                lastChecked: new Date().toISOString(),
              }
            : watch
        )
      );
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
            <div className="flex justify-center items-center gap-4 mb-2">
              <SparklesIcon className="w-10 h-10 text-purple-400" />
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Vibey Tickets
              </h1>
            </div>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Your personal AI-powered scout for the best ticket prices on the resale market. Set your price, and we'll watch for the drop.
            </p>
        </header>

        <Introduction />
        
        <div className="my-12 text-center">
            <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/30"
            >
                <PlusIcon className="w-5 h-5" />
                <span>Add New Watch</span>
            </button>
        </div>

        {isModalOpen && (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" aria-modal="true">
                <AddWatchForm 
                    onAddWatch={handleAddWatch} 
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        )}


        <section>
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Active Watches</h2>
          {watches.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {watches.map(watch => (
                <WatchCard
                  key={watch.id}
                  watch={watch}
                  onRemove={handleRemoveWatch}
                  onRefresh={handleRefreshWatch}
                />
              ))}
            </div>
          ) : (
            <div className="text-center bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-700">
                <p className="text-gray-400">You're not watching any events yet.</p>
                <p className="text-gray-500 text-sm mt-2">Click "Add New Watch" to get started!</p>
            </div>
          )}
        </section>
      </main>
      <footer className="text-center mt-12 py-6 border-t border-gray-800">
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Vibey Tickets. Powered by Gemini.</p>
      </footer>
    </div>
  );
}

export default App;