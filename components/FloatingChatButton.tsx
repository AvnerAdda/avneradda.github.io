"use client";

import { useState, useEffect } from 'react';
import { useChatbot } from '../lib/context/ChatbotContext';

export default function FloatingChatButton() {
  const { setIsChatbotOpen, setShowChatNotification, setNotificationDismissed } = useChatbot();
  const [isProfileVisible, setIsProfileVisible] = useState(true);

  useEffect(() => {
    const profileSection = document.getElementById('profile');
    if (!profileSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProfileVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of profile is visible
        rootMargin: '0px 0px -50px 0px' // Add some margin for smoother transition
      }
    );

    observer.observe(profileSection);

    return () => observer.disconnect();
  }, []);

  const handleChatOpen = () => {
    setIsChatbotOpen(true);
    setShowChatNotification(false);
    setNotificationDismissed(true);
  };

  return (
    <div 
      className={`fixed bottom-20 right-4 z-40 transition-all duration-500 ease-out ${
        isProfileVisible 
          ? 'translate-x-16 opacity-0 pointer-events-none' 
          : 'translate-x-0 opacity-100 pointer-events-auto'
      }`}
    >
      <button
        onClick={handleChatOpen}
        className="group bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 
          text-white rounded-full shadow-lg hover:shadow-xl transition-all 
          duration-300 flex items-center justify-center
          w-12 h-12 hover:scale-110 animate-shimmer bg-[length:200%_100%]
          hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        aria-label="Open chat"
      >
        <div className="absolute -inset-1 
          bg-gradient-to-r from-blue-500 to-purple-500 
          rounded-full blur opacity-30 
          group-hover:opacity-70 transition duration-500
          group-hover:animate-pulse"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-6 h-6 group-hover:animate-bounce"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
      </button>
    </div>
  );
}