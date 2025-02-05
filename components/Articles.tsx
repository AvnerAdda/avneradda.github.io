"use client";
import { useState, useEffect } from 'react';
import articlesData from '../public/articles.json';

interface Article {
  title: string;
  date: string;
  description: string;
  tags: string[];
  readTime: string;
  link: string;
}

interface ArticlesProps {
  initialArticles?: Article[];
}

export default function Articles({ initialArticles = [] }: ArticlesProps) {
  const [isLoading, setIsLoading] = useState(!initialArticles.length);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [displayCount, setDisplayCount] = useState(4);

  useEffect(() => {
    if (!initialArticles.length) {
      setArticles(articlesData);
    }
    setIsLoading(false);
  }, [initialArticles]);

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        My Articles
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          // Loading skeleton
          [...Array(2)].map((_, index) => (
            <div key={index} className="p-6 rounded-lg bg-gray-700/30 animate-pulse">
              <div className="h-6 bg-gray-600 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-600 rounded w-5/6"></div>
            </div>
          ))
        ) : (
          articles.slice(0, displayCount).map((article, index) => (
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
          ))
        )}
      </div>

      {!isLoading && displayCount < articles.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleShowMore}
            className="px-6 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors hover:glow"
          >
            Show More
          </button>
        </div>
      )}

      {/* Newsletter subscription */}
      <div className="mt-8 p-6 rounded-lg bg-gray-700/30 hover:glow-on-hover">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-blue-400">Stay Updated</h3>
            <p className="text-gray-300">Get the latest AI insights directly in your inbox</p>
          </div>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 focus:outline-none focus:border-blue-400 focus:glow"
            />
            <button className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400 text-white transition-colors hover:glow">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

