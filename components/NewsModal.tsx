'use client';

import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import NewsCard from './NewsCard';
import AiCard from './AiCard';

interface NewsItem {
  title: string;
  summary: string;
  source_link: string;
  timestamp: Date;
  type?: string;
}

interface NewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewsModal({ isOpen, onClose }: NewsModalProps) {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsRef = collection(db, 'ai_news');
        const q = query(newsRef, orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(q);
        
        const items = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            timestamp: data.timestamp?.toDate() || new Date(),
          };
        }) as NewsItem[];

        setNewsItems(items);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchNews();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const newsTypes = [
    'Model Release',
    'Research',
    'Tooling & Frameworks',
    'Datasets',
    'Economy',
    'Regulation & Policy',
    'Company Strategies',
    'GitHub Projects',
    'Competitions & Benchmarks',
    'Conferences & Events',
    'AI Safety & Alignment',
    'Bias & Fairness',
    'Misinformation & Deepfakes',
    'Other'
  ];

  const groupedNews = newsTypes.reduce<Record<string, NewsItem[]>>((acc, type) => {
    acc[type] = newsItems.filter(item => item.type === type);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <div className="inline-block w-full max-w-4xl my-8 text-left align-middle transition-all transform">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <AiCard>
            <div className="space-y-8">
              {/* Header Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  Latest AI News
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Stay updated with the most recent developments in AI, Machine Learning, and Large Language Models
                </p>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-400">Loading news...</p>
                </div>
              ) : newsItems.length === 0 ? (
                <div className="text-center py-8">
                  <h2 className="text-xl text-gray-400">No news items available at the moment</h2>
                </div>
              ) : (
                <div className="space-y-12">
                  {newsTypes.map((type) => (
                    groupedNews[type].length > 0 && (
                      <div key={type} className="space-y-4">
                        <div className="flex items-center gap-3">
                          <h2 className="text-2xl font-semibold text-white">{type}</h2>
                          <div className="h-px flex-grow bg-gradient-to-r from-blue-500/50 to-transparent" />
                        </div>
                        <div className="grid gap-6">
                          {groupedNews[type].map((news, index) => (
                            <div 
                              key={`${type}-${index}`} 
                              className="animate-fade-in" 
                              style={{ animationDelay: `${index * 0.1}s` }}
                            >
                              <NewsCard news={news} />
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>
          </AiCard>
        </div>
      </div>
    </div>
  );
} 