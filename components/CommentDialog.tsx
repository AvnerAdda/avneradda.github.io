"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { db } from '../lib/firebase';
import { collection, addDoc, query, orderBy, where, onSnapshot, Timestamp } from 'firebase/firestore';
import MarkdownPreview from '@uiw/react-markdown-preview';

interface CommentDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Comment {
  id: string;
  text: string;
  userName: string;
  userEmail: string;
  timestamp: Timestamp;
  response?: string;
  responseTimestamp?: Timestamp;
}

export default function CommentDialog({ isOpen, onClose }: CommentDialogProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const commentsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(
      collection(db, 'comments'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newComments = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(newComments);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newComment.trim() || !userName.trim() || !userEmail.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!userEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        text: newComment,
        userName,
        userEmail,
        timestamp: Timestamp.now()
      });

      setNewComment('');
      setUserName('');
      setUserEmail('');
    } catch (error) {
      console.error('Error posting comment:', error);
      setError('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div 
        className="bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-md rounded-2xl 
          w-full max-w-2xl shadow-2xl border border-gray-700/50
          transform transition-all duration-300 flex flex-col h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-[72px] flex-shrink-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm" />
          <div className="relative p-4 border-b border-gray-700/50 h-full">
            <div className="flex items-center justify-between h-full">
              <h2 className="text-xl font-semibold text-gray-200">Comments</h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* User Comment */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                  <span className="text-sm text-gray-300">
                    {comment.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-300">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {comment.timestamp.toDate().toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{comment.text}</p>
                  </div>
                </div>
              </div>

              {/* Avner's Response */}
              {comment.response && (
                <div className="flex gap-3 ml-8">
                  <div className="flex-shrink-0 relative w-8 h-8">
                    <Image
                      src="/images/profile-picture.jpg"
                      alt="Avner"
                      width={32}
                      height={32}
                      className="rounded-full object-cover border border-gray-700/50"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="bg-blue-600/10 rounded-lg p-3 border border-blue-500/30">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-blue-400">Avner Adda</span>
                        <span className="text-xs text-gray-500">
                          {comment.responseTimestamp?.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <MarkdownPreview
                        source={comment.response}
                        style={{
                          backgroundColor: 'transparent',
                          color: 'rgb(229 231 235)',
                          fontSize: '0.875rem',
                        }}
                        wrapperElement={{
                          "data-color-mode": "dark"
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={commentsEndRef} />
        </div>

        {/* Comment Form */}
        <div className="border-t border-gray-700/50 p-4 bg-gradient-to-b from-gray-800/50 to-gray-900/50">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm 
                  text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                disabled={isSubmitting}
              />
              <input
                type="email"
                placeholder="Your email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                className="flex-1 bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm 
                  text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                disabled={isSubmitting}
              />
            </div>
            <div className="relative">
              <textarea
                placeholder="Ask your question..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg px-3 py-2 text-sm 
                  text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500/50"
                rows={2}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 bottom-2 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 
                  hover:bg-blue-500/20 transition-colors disabled:opacity-50"
              >
                Post
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 