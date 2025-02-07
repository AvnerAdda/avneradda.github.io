import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy } from 'firebase/firestore';

interface Metric {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  description: string;
}

export default function RecruiterMetrics() {
  const [metrics, setMetrics] = useState<Metric[]>([
    {
      label: 'Profile Views',
      value: 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
          <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Total profile views in the last 30 days'
    },
    {
      label: 'Meeting Requests',
      value: 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 000 1.5v16.5h-.75a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5h-.75V3.75a.75.75 0 000-1.5h-15zM9 6a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm-.75 3.75A.75.75 0 019 9h1.5a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM9 12a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5H9zm3.75-5.25A.75.75 0 0113.5 6H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM13.5 9a.75.75 0 000 1.5H15A.75.75 0 0015 9h-1.5zm-.75 3.75a.75.75 0 01.75-.75H15a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM9 19.5v-2.25a.75.75 0 01.75-.75h4.5a.75.75 0 01.75.75v2.25a.75.75 0 01-.75.75h-4.5A.75.75 0 019 19.5z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Number of meeting requests from recruiters'
    },
    {
      label: 'Resume Downloads',
      value: 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Total resume downloads'
    },
    {
      label: 'Chat Conversations',
      value: 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.192.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.223zM8.25 10.875a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25zM10.875 12a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0zm4.875-1.125a1.125 1.125 0 100 2.25 1.125 1.125 0 000-2.25z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Number of chatbot conversations'
    },
    {
      label: 'Avg. Response Time',
      value: '24h',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
      ),
      description: 'Average response time to inquiries'
    },
    {
      label: 'Newsletter Subs',
      value: 0,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
          <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
        </svg>
      ),
      description: 'Newsletter subscribers'
    }
  ]);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // Fetch views from the metrics collection
        const viewsRef = collection(db, 'metrics');
        const viewsSnapshot = await getDocs(viewsRef);
        const viewsCount = viewsSnapshot.docs.find(doc => doc.id === 'views')?.data()?.count || 0;
        
        // Fetch meetings from recruiter_submissions collection
        const meetingsRef = collection(db, 'recruiter_submissions');
        const meetingsSnapshot = await getDocs(meetingsRef);
        const meetingsCount = meetingsSnapshot.size;
        
        // Fetch downloads from metrics collection
        const downloadsCount = viewsSnapshot.docs.find(doc => doc.id === 'downloads')?.data()?.count || 0;
        
        // Fetch chat conversations from generate collection
        const chatsRef = collection(db, 'generate');
        const chatsSnapshot = await getDocs(chatsRef);
        const chatsCount = chatsSnapshot.size;

        // Fetch subscribers count
        const subscribersCount = viewsSnapshot.docs.find(doc => doc.id === 'subscribers')?.data()?.count || 0;

        setMetrics(prev => prev.map(metric => {
          switch(metric.label) {
            case 'Profile Views':
              return { ...metric, value: viewsCount };
            case 'Meeting Requests':
              return { ...metric, value: meetingsCount };
            case 'Resume Downloads':
              return { ...metric, value: downloadsCount };
            case 'Chat Conversations':
              return { ...metric, value: chatsCount };
            case 'Newsletter Subs':
              return { ...metric, value: subscribersCount };
            default:
              return metric;
          }
        }));
      } catch (error) {
        console.error('Error fetching metrics:', error);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <div 
          key={metric.label}
          className="p-4 bg-gradient-to-br from-gray-800/50 to-gray-700/50 
            rounded-xl border border-gray-700/50 hover:border-blue-500/30 
            transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 
              group-hover:scale-110 transition-transform duration-300">
              {metric.icon}
            </div>
            <h3 className="text-sm text-gray-400">{metric.label}</h3>
          </div>
          <p className="text-2xl font-bold text-blue-400 mb-1">{metric.value}</p>
          <p className="text-xs text-gray-500">{metric.description}</p>
        </div>
      ))}
    </div>
  );
} 