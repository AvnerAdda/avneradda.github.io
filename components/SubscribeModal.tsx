'use client';

import { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, doc, increment, updateDoc, getDoc, setDoc } from 'firebase/firestore';
import AiCard from './AiCard';
import { AnalyticsService } from '../lib/analytics';

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscribeModal({ isOpen, onClose }: SubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
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

      // Track in analytics
      AnalyticsService.trackProfileInteraction('newsletter_subscription');

      setStatus('success');
      setMessage('Successfully subscribed to the newsletter!');
      setEmail('');
      setTimeout(() => {
        onClose();
        setStatus('idle');
        setMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error subscribing:', error);
      setStatus('error');
      setMessage('Error subscribing to newsletter. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform">
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
              <div className="text-center space-y-4">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-500">
                  Subscribe to Newsletter
                </h1>
                <p className="text-gray-400">
                  Get the latest AI news and updates delivered to your inbox
                </p>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="block w-full px-3 py-2 border border-gray-600 rounded-md 
                        shadow-sm bg-gray-700 text-white placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm font-medium text-white 
                    bg-gradient-to-r from-green-500 to-emerald-500 
                    hover:from-green-600 hover:to-emerald-600 
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
                    ${status === 'loading' ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {status === 'loading' ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    'Subscribe'
                  )}
                </button>

                {message && (
                  <p className={`text-sm text-center ${
                    status === 'success' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {message}
                  </p>
                )}
              </form>
            </div>
          </AiCard>
        </div>
      </div>
    </div>
  );
} 