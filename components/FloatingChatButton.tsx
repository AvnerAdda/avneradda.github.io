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
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-stone-950/80 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:border-white/25 hover:bg-stone-900"
        aria-label="Open chat"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 h-6 w-6"
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
