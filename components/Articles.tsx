"use client";
import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, increment, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import articlesData from '../public/articles.json';

// interface Article {
//   title: string;
//   date: string;
//   description: string;
//   tags: string[];
//   readTime: string;
//   link: string;
// }

export default function Articles() {
  const [displayCount, setDisplayCount] = useState(4);
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const articles = articlesData;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || subscribeStatus === 'loading') return;

    setSubscribeStatus('loading');
    try {
      // Add email to subscribers collection
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        timestamp: new Date(),
      });

      // Update metrics count
      const metricsRef = doc(db, 'metrics', 'subscribers');
      const metricsDoc = await getDoc(metricsRef);
      
      if (!metricsDoc.exists()) {
        await setDoc(metricsRef, { count: 1 });
      } else {
        await updateDoc(metricsRef, {
          count: increment(1)
        });
      }

      setSubscribeStatus('success');
      setEmail('');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setSubscribeStatus('error');
      setTimeout(() => setSubscribeStatus('idle'), 3000);
    }
  };

  const handleShowMore = () => {
    setDisplayCount(prev => prev + 4);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        My Articles
      </h2>

      {/* Newsletter subscription */}
      <div className="mt-8 p-6 rounded-lg bg-gray-700/30 hover:glow-on-hover">
        <form onSubmit={handleSubscribe} className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-blue-400">Stay Updated</h3>
            <p className="text-gray-300">Get the latest AI insights directly in your inbox</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-gray-300 
                focus:outline-none focus:border-blue-400 focus:glow w-full md:w-auto"
              disabled={subscribeStatus === 'loading'}
            />
            <button 
              type="submit"
              disabled={subscribeStatus === 'loading'}
              className={`px-4 py-2 rounded-lg transition-colors ${
                subscribeStatus === 'success' 
                  ? 'bg-green-500 hover:bg-green-400' 
                  : subscribeStatus === 'error'
                  ? 'bg-red-500 hover:bg-red-400'
                  : 'bg-blue-500 hover:bg-blue-400'
              } text-white hover:glow`}
            >
              {subscribeStatus === 'loading' ? 'Subscribing...' 
                : subscribeStatus === 'success' ? 'Subscribed!' 
                : subscribeStatus === 'error' ? 'Try Again' 
                : 'Subscribe'}
            </button>
          </div>
        </form>
      </div>
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

