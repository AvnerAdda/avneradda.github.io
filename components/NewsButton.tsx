'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';

const NewsModal = dynamic(() => import('./NewsModal'), {
  ssr: false,
  loading: () => null,
});

const SubscribeModal = dynamic(() => import('./SubscribeModal'), {
  ssr: false,
  loading: () => null,
});

const GameModalWithAuth = dynamic(() => import('./GameModalWithAuth'), {
  ssr: false,
  loading: () => null,
});

export default function NewsButton() {
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isGameModalOpen, setIsGameModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-end gap-4 z-50">
      {/* Collapsible Menu Items */}
      <div className={`space-y-4 transition-all duration-300 transform origin-bottom-right flex flex-col items-end
        ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0'}`}>
        {/* Subscribe Newsletter Button */}
        <button
          onClick={() => setIsSubscribeModalOpen(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 
            text-white rounded-full shadow-lg hover:shadow-xl transition-all 
            duration-300 flex items-center justify-center
            md:rounded-lg md:px-4 md:py-2
            w-12 h-12 md:w-auto md:h-auto"
          aria-label="Subscribe to Newsletter"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <span className="hidden md:inline">Subscribe</span>
          </div>
        </button>

        {/* Game Button */}
        <button
          onClick={() => setIsGameModalOpen(true)}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 
            text-white rounded-full shadow-lg hover:shadow-xl transition-all 
            duration-300 flex items-center justify-center
            md:rounded-lg md:px-4 md:py-2
            w-12 h-12 md:w-auto md:h-auto"
          aria-label="Play Daily Quiz"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" 
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
              />
            </svg>
            <span className="hidden md:inline">Play</span>
          </div>
        </button>

        {/* Latest News Button */}
        <button
          onClick={() => setIsNewsModalOpen(true)}
          className="bg-gradient-to-r from-blue-500 to-emerald-500 
            text-white rounded-full shadow-lg hover:shadow-xl transition-all 
            duration-300 flex items-center justify-center
            md:rounded-lg md:px-4 md:py-2
            w-12 h-12 md:w-auto md:h-auto"
          aria-label="View Latest News"
        >
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" 
              />
            </svg>
            <span className="hidden md:inline">Latest News</span>
          </div>
        </button>
      </div>

      {/* Menu Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="bg-gradient-to-r from-blue-500 to-emerald-500 
          text-white rounded-full shadow-lg hover:shadow-xl transition-all 
          duration-300 flex items-center justify-center
          w-12 h-12"
        aria-label="Toggle Menu"
      >
        <svg className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-45' : ''}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>

      {isNewsModalOpen ? (
        <NewsModal
          isOpen={isNewsModalOpen}
          onClose={() => setIsNewsModalOpen(false)}
        />
      ) : null}
      {isSubscribeModalOpen ? (
        <SubscribeModal
          isOpen={isSubscribeModalOpen}
          onClose={() => setIsSubscribeModalOpen(false)}
        />
      ) : null}
      {isGameModalOpen ? (
        <GameModalWithAuth
          isOpen={isGameModalOpen}
          onClose={() => setIsGameModalOpen(false)}
        />
      ) : null}
    </div>
  );
} 
