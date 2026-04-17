"use client";

import { useState, useEffect } from 'react';
import { useChatbot } from '../lib/context/ChatbotContext';

export default function ChatNotificationIndicator() {
  const { showChatNotification, setShowChatNotification, setNotificationDismissed } = useChatbot();
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Consider "at top" if scroll position is less than 100px from top
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsAtTop(scrollTop < 100);
    };

    // Initial check
    handleScroll();

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show if notification is not active OR if user is at the top
  if (!showChatNotification || isAtTop) return null;

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
      <div 
        onClick={handleScrollToTop}
        className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white text-xs px-4 py-2 rounded-full shadow-lg border border-blue-400/30 flex items-center gap-2 cursor-pointer hover:from-blue-700 hover:to-emerald-700 transition-all duration-300"
      >
        <span className="animate-bounce">👆</span>
        <span className="font-medium">Scroll up to see the notification!</span>
        <div
          onClick={(e) => {
            e.stopPropagation();
            setShowChatNotification(false);
            setNotificationDismissed(true);
          }}
          className="ml-2 text-white/80 hover:text-white transition-colors cursor-pointer hover:bg-white/10 rounded-full w-4 h-4 flex items-center justify-center"
        >
          ×
        </div>
      </div>
    </div>
  );
}