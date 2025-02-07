"use client";

import RecruiterMetrics from './RecruiterMetrics';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MetricsModal({ isOpen, onClose }: MetricsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] transition-all duration-300">
      <div 
        className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl 
          w-full max-w-2xl shadow-2xl relative overflow-hidden border border-gray-700/50
          transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm" />
          <div className="relative p-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Profile Metrics
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors group"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 group-hover:text-gray-200 transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <RecruiterMetrics />
        </div>
      </div>
    </div>
  );
} 