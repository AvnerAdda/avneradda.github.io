"use client";

import dynamic from 'next/dynamic';
import { useChatbot } from '../lib/context/ChatbotContext';

const ChatbotDialog = dynamic(() => import('./ChatbotDialog'), {
  ssr: false,
  loading: () => null,
});

export default function ChatbotDialogWrapper() {
  const { isChatbotOpen, setIsChatbotOpen } = useChatbot();

  if (!isChatbotOpen) {
    return null;
  }

  return (
    <ChatbotDialog
      isOpen={isChatbotOpen}
      onClose={() => setIsChatbotOpen(false)}
    />
  );
}
