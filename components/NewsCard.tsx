import React from 'react';

interface NewsItem {
  title: string;
  summary: string;
  source_link: string;
  timestamp?: Date;
  type?: string;
}

export default function NewsCard({ news }: { news: NewsItem }) {
  return (
    <div className="group relative bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 
      hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/50
      hover:border-gray-600/50">
      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 
        rounded-lg blur opacity-0 group-hover:opacity-20 transition-opacity"/>
      
      <div className="relative">
        {/* Type Badge */}
        {news.type && (
          <span className="inline-block px-2 py-1 text-xs rounded-full bg-blue-500/20 
            text-blue-400 mb-3">
            {news.type}
          </span>
        )}

        {/* Title */}
        <h3 className="text-xl font-semibold text-blue-400 mb-3 group-hover:text-blue-300 
          transition-colors line-clamp-2">
          {news.title}
        </h3>

        {/* Summary */}
        <p className="text-gray-300 mb-4 line-clamp-3">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center">
          <a
            href={news.source_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 
              transition-colors group/link"
          >
            Read more 
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor" 
              className="w-4 h-4 group-hover/link:translate-x-0.5 transition-transform"
            >
              <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" />
            </svg>
          </a>
          {news.timestamp && (
            <span className="text-sm text-gray-400">
              {news.timestamp.toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 