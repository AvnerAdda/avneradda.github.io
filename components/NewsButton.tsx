'use client';

import { useState, useEffect } from 'react';
import NewsModal from './NewsModal';
import SubscribeModal from './SubscribeModal';

export default function NewsButton() {
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 flex flex-col gap-4 z-50">
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
        {isMobile ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
            />
          </svg>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            Subscribe
          </div>
        )}
      </button>

      {/* Latest News Button */}
      <button
        onClick={() => setIsNewsModalOpen(true)}
        className="bg-gradient-to-r from-blue-500 to-purple-500 
          text-white rounded-full shadow-lg hover:shadow-xl transition-all 
          duration-300 flex items-center justify-center
          md:rounded-lg md:px-4 md:py-2
          w-12 h-12 md:w-auto md:h-auto"
        aria-label="View Latest News"
      >
        {isMobile ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" 
            />
          </svg>
        ) : (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" 
              />
            </svg>
            Latest News
          </div>
        )}
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