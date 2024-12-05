import React from 'react';

export default function AiDecorations() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      {/* Neural network nodes */}
      <div className="absolute top-20 right-20 w-3 h-3 rounded-full bg-blue-400 opacity-70 animate-pulse" />
      <div className="absolute top-40 right-40 w-2 h-2 rounded-full bg-green-400 opacity-70 animate-pulse" style={{ animationDelay: '0.5s' }} />
      <div className="absolute top-60 right-30 w-4 h-4 rounded-full bg-purple-400 opacity-70 animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Floating binary */}
      <div className="absolute top-1/4 left-10 text-sm text-gray-600 opacity-30 animate-pulse">
        01001010
      </div>
      <div className="absolute bottom-1/4 right-10 text-sm text-gray-600 opacity-30 animate-pulse" style={{ animationDelay: '0.7s' }}>
        10101101
      </div>
    </div>
  );
} 