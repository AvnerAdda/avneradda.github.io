import { db } from '../../lib/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import NewsCard from '../../components/NewsCard';
import AiCard from '../../components/AiCard';
import Link from 'next/link';


interface NewsItem {
  title: string;
  summary: string;
  source_link: string;
  timestamp: Date;
  type?: string;
}

async function getNewsFromFirebase(): Promise<NewsItem[]> {
  const newsRef = collection(db, 'ai_news');
  const q = query(newsRef, orderBy('timestamp', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    ...doc.data(),
    timestamp: doc.data().timestamp?.toDate(),
  })) as NewsItem[];
}

export default async function LatestNews() {
  const newsItems = await getNewsFromFirebase();

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Back to Home Button */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-lg 
            bg-gray-800/50 hover:bg-gray-700/50 transition-colors text-gray-300
            hover:text-white group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
          >
            <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" />
          </svg>
          Back to Home
        </Link>

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

            {/* News Grid */}
            <div className="grid gap-6">
              {newsItems.map((news, index) => (
                <div 
                  key={index} 
                  className="animate-fade-in hover:transform hover:scale-[1.02] transition-all duration-300" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <NewsCard news={news} />
                </div>
              ))}
            </div>

            {/* Footer Section */}
            <div className="text-center space-y-2">
              <div className="text-sm text-gray-400">
                Last updated: {newsItems[0]?.timestamp?.toLocaleString() || 'Loading...'}
              </div>
              <div className="flex justify-center gap-2 text-sm text-gray-500">
                <span>•</span>
                <span>Auto-refreshes daily</span>
                <span>•</span>
                <span>Powered by Perplexity AI API</span>
              </div>
            </div>
          </div>
        </AiCard>
      </div>
    </main>
  );
} 