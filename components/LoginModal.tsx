'use client';

import { useState } from 'react';
import { useAuth } from '../lib/context/AuthContext';
import AiCard from './AiCard';
import Image from 'next/image';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signInWithGoogle, signInWithEmail, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      onClose();
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onClose} />
        
        <div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <AiCard>
            <div className="space-y-6 p-6">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h2>
                <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
              </div>

              {error && (
                <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                className="w-full p-3 flex items-center justify-center gap-3 bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-center mb-6">
                  <Image
                    src="/google-icon.png"
                    alt="Google Sign In"
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                </div>
                Continue with Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-400">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 w-full p-3 bg-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  {isSignUp ? 'Sign Up' : 'Sign In'}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-blue-400 hover:underline"
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </AiCard>
        </div>
      </div>
    </div>
  );
} 