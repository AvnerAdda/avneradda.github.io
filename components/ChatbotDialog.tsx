"use client";

import { useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to API
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Add assistant response to chat
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: data.response,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      // Add error message to chat
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md p-6 shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Dialog content */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
            <h2 className="text-xl font-bold">AI Assistant</h2>
          </div>
          
          {/* Chat messages */}
          <div className="h-80 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div key={index} className="flex items-start gap-3 mb-4">
                <div className={`w-6 h-6 rounded-full flex-shrink-0 mt-1 ${
                  message.role === 'assistant' 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gray-600'
                }`} />
                <p className="text-gray-300 bg-gray-700/50 rounded-lg p-3">
                  {message.content}
                </p>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="flex-1 bg-gray-700/50 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 