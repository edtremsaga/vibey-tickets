import React from 'react';

const Introduction: React.FC = () => {
  return (
    <div className="text-left max-w-3xl mx-auto bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50">
      <h2 className="text-xl font-bold text-gray-100 mb-4 tracking-tight sr-only">Introduction & Vision</h2>
      <div className="space-y-4 text-gray-300 leading-relaxed">
        <div>
          <h3 className="font-semibold text-purple-300">Problem:</h3>
          <p className="text-gray-400">Budget-conscious fans struggle to find affordable tickets for live events. Prices are a) expensive, b) volatile and c) the total "all in" cost that the consumer is asked to pay at check out time often includes costly broker fees. This makes buying event tickets a) difficult due to the expense of the tickets and b) doing direct comparison across brokers to find the best price (like SeatGeek, Ticketmaster, and StubHub) frustrating and time-consuming.</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300">Solution:</h3>
          <p className="text-gray-400">Vibey Tickets is a smart price-watching web application, accessible via a browser, that automates the search for the best event ticket deal. Users define an event and a target price, and the app monitors major brokers, notifying the user the moment tickets are available at (or below) their desired price point, with a focus on the total, "all-in" cost. The total "all-in" cost includes the price of the tickets and broker fees.</p>
        </div>
        <div>
          <h3 className="font-semibold text-purple-300">Target Audience (MVP):</h3>
          <p className="text-gray-400">Music event enthusiasts that are willing to wait for event prices to drop to their level of affordability on the resale market.</p>
        </div>
      </div>
    </div>
  );
};

export default Introduction;