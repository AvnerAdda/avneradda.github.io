"use client";
import { useState } from 'react';
import articlesData from '../public/articles.json';

export default function Articles() {
  const [displayCount, setDisplayCount] = useState(4);
  const articles = articlesData;

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        My Articles
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.slice(0, displayCount).map((article, index) => (
          <a 
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            key={article.title}
            className="group relative p-6 rounded-lg bg-gray-700/30 hover:glow-on-hover hover-float cursor-pointer"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* Decorative corner element */}
            <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
              <div className="absolute top-0 right-0 w-full h-full" 
                   style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                  {article.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric',
                    month: 'long'
                  })}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span 
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full bg-gray-600/50 text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-gray-400">{article.readTime}</span>
                <span className="text-blue-400 group-hover:text-blue-300 transition-colors">
                  Read more →
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>

      {displayCount < articles.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors hover:glow"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
}

