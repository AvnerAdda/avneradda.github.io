'use client';

import { useState } from 'react';
import NewsModal from './NewsModal';
import SubscribeModal from './SubscribeModal';

export default function NewsButton() {
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
      {/* Subscribe Newsletter Button */}
      <button
        onClick={() => setIsSubscribeModalOpen(true)}
        className="bg-gradient-to-r from-green-500 to-emerald-500 
          text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all 
          duration-300 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
          />
        </svg>
        Subscribe Newsletter
      </button>

      {/* Latest News Button */}
      <button
        onClick={() => setIsNewsModalOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 
          text-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all 
          duration-300 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v12a2 2 0 01-2 2z" 
          />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M16 2v4M8 2v4M3 10h18" 
          />
        </svg>
        Latest News
      </button>

      <NewsModal 
        isOpen={isNewsModalOpen}
        onClose={() => setIsNewsModalOpen(false)}
      />
      <SubscribeModal 
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
      />
    </div>
  );
} 