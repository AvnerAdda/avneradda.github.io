"use client";

import { createContext, useContext, useState, useEffect } from 'react';

interface ChatbotContextType {
  isChatbotOpen: boolean;
  setIsChatbotOpen: (isOpen: boolean) => void;
  showChatNotification: boolean;
  setShowChatNotification: (show: boolean) => void;
  notificationDismissed: boolean;
  setNotificationDismissed: (dismissed: boolean) => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

export function ChatbotProvider({ children }: { children: React.ReactNode }) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [showChatNotification, setShowChatNotification] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  // Chat notification timer
  useEffect(() => {
    if (notificationDismissed) return;
    
    const timer = setTimeout(() => {
      setShowChatNotification(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, [notificationDismissed]);

  return (
    <ChatbotContext.Provider value={{ 
      isChatbotOpen, 
      setIsChatbotOpen,
      showChatNotification,
      setShowChatNotification,
      notificationDismissed,
      setNotificationDismissed
    }}>
      {children}
    </ChatbotContext.Provider>
  );
}

export function useChatbot() {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
} 