import React from 'react';

const Introduction: React.FC = () => {
  return (
    <div className="my-10 max-w-4xl mx-auto grid md:grid-cols-3 gap-6 text-center">
      <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
        <h3 className="font-bold text-lg text-purple-300 mb-2">Set Your Watch</h3>
        <p className="text-gray-400 text-sm">Tells you to add an event and your target price.</p>
      </div>
      <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
        <h3 className="font-bold text-lg text-purple-300 mb-2">We Scan the Market</h3>
        <p className="text-gray-400 text-sm">Explains that the app will check prices for you.</p>
      </div>
      <div className="bg-gray-800/40 p-6 rounded-xl border border-gray-700/50">
        <h3 className="font-bold text-lg text-purple-300 mb-2">Get the Price Alert</h3>
        <p className="text-gray-400 text-sm">Describes the email notification you'll receive.</p>
      </div>
    </div>
  );
};

export default Introduction;