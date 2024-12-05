"use client";

interface ChatbotDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatbotDialog({ isOpen, onClose }: ChatbotDialogProps) {
  if (!isOpen) return null;

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
          
          <div className="h-80 bg-gray-900/50 rounded-lg p-4 overflow-y-auto">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex-shrink-0 mt-1" />
              <p className="text-gray-300 bg-gray-700/50 rounded-lg p-3">
                Not available yet. Coming soon! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 