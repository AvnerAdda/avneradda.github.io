"use client";

import { useChatbot } from '../lib/context/ChatbotContext';
import ChatbotDialog from './ChatbotDialog';

export default function ChatbotDialogWrapper() {
  const { isChatbotOpen, setIsChatbotOpen } = useChatbot();

  return (
    <ChatbotDialog
      isOpen={isChatbotOpen}
      onClose={() => setIsChatbotOpen(false)}
    />
  );
} 