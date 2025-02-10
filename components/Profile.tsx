"use client";

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useChatbot } from '../lib/context/ChatbotContext';
import { db } from '../lib/firebase';
import { doc, increment, updateDoc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { AnalyticsService } from '../lib/analytics';
import MetricsModal from './MetricsModal';

// Move these arrays outside the component to prevent recreation on each render
const STATS = [
  { 
    label: 'Experience', 
    value: '6+ yrs',
    id: 'experience'
  },
  { 
    label: 'Projects', 
    value: '10+',
    id: 'projects'
  },
  { 
    label: 'Languages', 
    value: '3',
    id: 'hobbies'
  }
];

const TECH_STACK = [
  'Python',
  'AWS',
  'GCP',
  'Spark',
  'SQL',
  'Docker',
  'Git',
  'LLMs'
];

const CONTACT_INFO = [
  { 
    icon: '📧', 
    label: 'Email',
    href: 'mailto:avner.adda@outlook.com'
  },
  { icon: '📍', label: 'Tel Aviv, Israel' },
  { 
    icon: '🐙', 
    label: 'GitHub',
    href: 'https://github.com/AvnerAdda'
  },
  {
    icon: '💼',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/avneradda/'
  }
];

export default function Profile() {
  const { setIsChatbotOpen } = useChatbot();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  // Add useEffect to listen to likes count
  useEffect(() => {
    const feedbackRef = doc(db, 'feedback', 'profile');
    const unsubscribe = onSnapshot(feedbackRef, (doc) => {
      if (doc.exists()) {
        setLikeCount(doc.data()?.likes || 0);
      }
    });

    return () => unsubscribe();
  }, []);

  // Add this useEffect at the top of your Profile component
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const viewsRef = doc(db, 'metrics', 'views');
        const viewsDoc = await getDoc(viewsRef);
        
        if (!viewsDoc.exists()) {
          // Create initial document if it doesn't exist
          await setDoc(viewsRef, { count: 1 });
        } else {
          // Increment existing count
          await updateDoc(viewsRef, {
            count: increment(1)
          });
        }

        // Track in analytics
        AnalyticsService.trackPageView('profile');
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackPageView();
  }, []); // Run once when component mounts

  const handleLike = async () => {
    if (!isLiked) {
      try {
        const feedbackRef = doc(db, 'feedback', 'profile');
        
        const docSnap = await getDoc(feedbackRef);
        if (!docSnap.exists()) {
          await setDoc(feedbackRef, { likes: 0 });
        }
        
        await updateDoc(feedbackRef, {
          likes: increment(1)
        });
        
        setIsLiked(true);
        setIsLikeAnimating(true);
        setTimeout(() => setIsLikeAnimating(false), 1000);
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };

  const handleDownloadResume = async () => {
    try {
      // Track download in metrics collection
      const downloadsRef = doc(db, 'metrics', 'downloads');
      const downloadsDoc = await getDoc(downloadsRef);
      
      if (!downloadsDoc.exists()) {
        // Create initial document if it doesn't exist
        await setDoc(downloadsRef, { count: 1 });
      } else {
        // Increment existing count
        await updateDoc(downloadsRef, {
          count: increment(1)
        });
      }

      // Track in analytics
      AnalyticsService.trackDocumentAction('download', 'resume');

      // Download the file
      const link = document.createElement('a');
      link.href = 'doc/Resume - Avner.docx';
      link.download = 'Resume - Avner.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const handleScrollToArticles = () => {
    // Scroll to articles section
    const articlesSection = document.getElementById('articles');
    articlesSection?.scrollIntoView({ behavior: 'smooth' });

    // Find and highlight the Stay Updated div
    const stayUpdatedDiv = document.querySelector('.hover\\:glow-on-hover');
    if (stayUpdatedDiv) {
      stayUpdatedDiv.classList.add('animate-pulse', 'ring-2', 'ring-blue-400');
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        stayUpdatedDiv.classList.remove('animate-pulse', 'ring-2', 'ring-blue-400');
      }, 3000);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="relative">
      {/* AI-themed decorative elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-10" />

      <div className="relative space-y-4">
        {/* Profile header with image and like button */}
        <div className="flex items-start gap-6 md:gap-8">
          {/* Profile Image */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
            <div className="relative h-28 w-28 md:h-32 md:w-32">
              <Image
                src="/images/profile-picture.jpg" // You'll need to add your image to the public folder
                alt="Profile"
                width={128}
                height={128}
                className="rounded-full object-cover border-2 border-gray-700/50"
                priority
              />
            </div>
          </div>

          {/* Name, Title and Company Badge */}
          <div className="flex flex-col gap-2 pt-2">
            <div className="hover-float">
              <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Avner Adda
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <p className="text-lg md:text-xl text-gray-300">Data Scientist</p>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full 
                  bg-white/5 border border-gray-700/50 hover:border-gray-600/50">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Image
                    src="/images/deloitte.svg"
                    alt="Deloitte"
                    width={60}
                    height={18}
                    className="opacity-90"
                  />
                </div>
              </div>
              
              {/* New Metrics Button */}
              <button
                onClick={() => {
                  AnalyticsService.trackProfileInteraction('metrics_view');
                  setIsMetricsOpen(true);
                }}
                className="mt-2 px-3 py-1.5 text-sm rounded-full 
                  bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                  hover:from-blue-500/20 hover:to-purple-500/20
                  border border-blue-500/20 hover:border-blue-500/30
                  text-blue-400 hover:text-blue-300
                  transition-all duration-300 group flex items-center gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="currentColor" 
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                >
                  <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875V8.625zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75z" />
                </svg>
                <span className="group-hover:translate-x-0.5 transition-transform">
                  View Metrics
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {STATS.map((stat, index) => (
            <div 
              key={stat.label}
              onClick={() => scrollToSection(stat.id)}
              className="text-center p-3 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 hover:glow-on-hover cursor-pointer transform hover:scale-105 transition-all duration-300"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tech stack with pulsing effect */}
        <div className="mt-6 text-center">
          <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {TECH_STACK.map((tech, index) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-full bg-gray-700/50 text-sm animate-pulse"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Contact section with hover effects and links */}
        <div className="text-center">
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {CONTACT_INFO.map(({ icon, label, href }) => (
              <button
                key={label}
                onClick={() => href && window.open(href, '_blank')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg 
                  ${href ? 'cursor-pointer' : 'cursor-default'}
                  bg-gray-700/30 hover:glow hover:scale-105 transition-all duration-300
                `}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Download Resume, Chatbot, Like, and Newsletter Buttons in one row */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleDownloadResume}
            className="group relative px-6 py-3 md:px-6 md:py-3 px-4 py-2 rounded-full 
              bg-gradient-to-r from-green-500 to-emerald-500 
              text-white font-semibold hover:scale-105 
              transition-all duration-300"
          >
            <div className="absolute -inset-1 
              bg-gradient-to-r from-green-500 to-emerald-500 
              rounded-full blur opacity-30 
              group-hover:opacity-70 transition duration-500"
            />
            <div className="relative flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span className="hidden md:inline">Download Resume</span>
            </div>
          </button>

          <button
            onClick={() => setIsChatbotOpen(true)}
            className="group relative px-6 py-3 md:px-6 md:py-3 px-4 py-2 rounded-full 
              bg-gradient-to-r from-blue-500 to-purple-500 
              text-white font-semibold hover:scale-105 
              transition-all duration-300 z-10"
          >
            <div className="absolute -inset-1 
              bg-gradient-to-r from-blue-500 to-purple-500 
              rounded-full blur opacity-30 
              group-hover:opacity-70 transition duration-500"
            />
            <div className="relative flex items-center gap-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <div className="relative">
                <span className="hidden md:inline">Let&apos;s chat!</span>
              </div>
            </div>
          </button>

          <button
            onClick={handleLike}
            disabled={isLiked}
            className={`
              group relative px-4 py-2 rounded-lg
              transition-all duration-300 flex items-center gap-1.5
              ${isLiked 
                ? 'bg-gray-700/30 text-gray-400' 
                : 'bg-gray-700/30 hover:bg-gray-600/30 text-gray-300'
              }
            `}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`w-4 h-4 ${isLiked ? 'text-blue-400' : ''}`}
            >
              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
            </svg>
            <span className={`text-sm ${isLikeAnimating ? 'animate-bounce' : ''}`}>
              {likeCount > 0 ? likeCount : ''}
            </span>
          </button>

          {/* New Newsletter Button */}
          <button
            onClick={handleScrollToArticles}
            className={`
              group relative px-4 py-2 rounded-lg
              transition-all duration-300 flex items-center gap-1.5
              bg-gray-700/30 hover:bg-gray-600/30 text-gray-300
              hover:scale-105
            `}
          >
            <span role="img" aria-label="newspaper" className="text-lg">📰</span>
            <span className="text-sm hidden md:inline">Newsletter</span>
          </button>
        </div>
      </div>

      <MetricsModal 
        isOpen={isMetricsOpen} 
        onClose={() => setIsMetricsOpen(false)} 
      />
    </div>
  )
}

