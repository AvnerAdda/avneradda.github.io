"use client";

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useChatbot } from '../lib/context/ChatbotContext';
import { db } from '../lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { AnalyticsService } from '../lib/analytics';
import { trackIPBasedMetric, hasIPInteracted } from '../lib/ipBasedMetrics';
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
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 4a2 2 0 012-2h20a2 2 0 012 2v16a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2 0v.217l10 5.5 10-5.5V4H2zm20 2.383l-10 5.5-10-5.5V20h20V6.383z"/>
      </svg>
    ),
    label: 'Email',
    href: 'mailto:avner.adda@outlook.com'
  },
  { 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    ),
    label: 'Tel Aviv, Israel'
  },
  { 
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    label: 'GitHub',
    href: 'https://github.com/AvnerAdda'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/avneradda/'
  },
  {
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
      </svg>
    ),
    label: 'WhatsApp',
    href: 'https://wa.me/972533999137?text=Hey%21%20I%20saw%20your%20profile%2C%20nice%21%20I%27d%20love%20to%20connect%20and%20chat%20about%20your%20work.'
  }
];

export default function Profile() {
  const { 
    setIsChatbotOpen, 
    showChatNotification, 
    setShowChatNotification, 
    setNotificationDismissed 
  } = useChatbot();
  const [isLiked, setIsLiked] = useState(false);
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);

  // Add useEffect to listen to likes count and check IP status
  useEffect(() => {
    const feedbackRef = doc(db, 'ip_metrics', 'profile_likes');
    const unsubscribe = onSnapshot(feedbackRef, (doc) => {
      if (doc.exists()) {
        setLikeCount(doc.data()?.count || 0);
      }
    });

    // Check if current IP has already liked
    const checkIPStatus = async () => {
      const hasLiked = await hasIPInteracted('profile_likes');
      setHasUserLiked(hasLiked);
      setIsLiked(hasLiked);
    };

    checkIPStatus();
    return () => unsubscribe();
  }, []);

  // Track page view with IP-based tracking
  useEffect(() => {
    const trackPageView = async () => {
      try {
        const wasTracked = await trackIPBasedMetric('profile_views');
        if (wasTracked) {
          AnalyticsService.trackPageView('profile');
        }
      } catch (error) {
        console.error('Error tracking view:', error);
      }
    };

    trackPageView();
  }, []);


  const handleLike = async () => {
    if (!isLiked && !hasUserLiked) {
      try {
        const wasTracked = await trackIPBasedMetric('profile_likes');
        if (wasTracked) {
          setIsLiked(true);
          setHasUserLiked(true);
          setIsLikeAnimating(true);
          setTimeout(() => setIsLikeAnimating(false), 1000);
        }
      } catch (error) {
        console.error('Error updating likes:', error);
      }
    }
  };
 
  const handleDownloadResume = async () => {
    try {
      // Track download with IP-based tracking
      const wasTracked = await trackIPBasedMetric('resume_downloads');
      if (wasTracked) {
        AnalyticsService.trackDocumentAction('download', 'resume');
      }

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

        {/* Currently Working On section - logo version */}
        <div className="mt-5 text-center">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-3">Currently Working On</h3>
          <div className="flex items-center justify-center gap-4">
            {/* Deloitte AI Agent */}
            <a 
              href="https://endeavor.deloitte.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all duration-300 hover:scale-105">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </div>
            </a>

            {/* Generic AI Agent */}
            <div className="relative group">
              <div className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all duration-300 hover:scale-105">
                <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20,9V7c0-1.1-0.9-2-2-2h-3c0-1.66-1.34-3-3-3S9,3.34,9,5H6C4.9,5,4,5.9,4,7v2c-1.66,0-3,1.34-3,3s1.34,3,3,3v2 c0,1.1,0.9,2,2,2h3c0,1.66,1.34,3,3,3s3-1.34,3-3h3c1.1,0,2-0.9,2-2v-2c1.66,0,3-1.34,3-3S21.66,9,20,9z M12,17.5 c-0.83,0-1.5-0.67-1.5-1.5s0.67-1.5,1.5-1.5s1.5,0.67,1.5,1.5S12.83,17.5,12,17.5z M12,10.5c-0.83,0-1.5-0.67-1.5-1.5 S11.17,7.5,12,7.5S13.5,8.17,13.5,9S12.83,10.5,12,10.5z"/>
                </svg>
              </div>
            </div>

            {/* LadderAZ */}
            <a 
              href="https://ladderaz.web.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all duration-300 hover:scale-105">
                <Image
                  src="/images/ladderaz.svg"
                  alt="LadderAZ"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
            </a>

            {/* Lilmod */}
            <a 
              href="https://lilmod-ai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all duration-300 hover:scale-105">
                <Image
                  src="/images/lilmod.svg"
                  alt="Lilmod"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
            </a>

            {/* Kaspenu */}
            <a 
              href="https://www.kaspenu.org/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative group"
            >
              <div className="p-2 rounded-lg bg-gray-700/30 hover:bg-gray-600/30 transition-all duration-300 hover:scale-105">
                <Image
                  src="/images/kaspenu.avif"
                  alt="Kaspenu"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              </div>
            </a>
          </div>
        </div>

        {/* Contact section with hover effects and links */}
        <div className="text-center">
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            {CONTACT_INFO.map(({ icon, label, href }) => {
              const getButtonStyles = (label: string) => {
                switch (label) {
                  case 'Email':
                    return 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20 hover:border-blue-500/40 text-blue-300 hover:text-blue-200';
                  case 'GitHub':
                    return 'bg-gray-500/10 hover:bg-gray-500/20 border-gray-500/20 hover:border-gray-500/40 text-gray-300 hover:text-gray-200';
                  case 'LinkedIn':
                    return 'bg-blue-600/10 hover:bg-blue-600/20 border-blue-600/20 hover:border-blue-600/40 text-blue-400 hover:text-blue-300';
                  case 'WhatsApp':
                    return 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/40 text-green-400 hover:text-green-300';
                  default:
                    return 'bg-gray-700/30 hover:bg-gray-600/30 text-gray-300 hover:text-gray-200';
                }
              };

              return (
                <button
                  key={label}
                  onClick={() => href && window.open(href, '_blank')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg border
                    ${href ? 'cursor-pointer' : 'cursor-default'}
                    ${getButtonStyles(label)}
                    hover:scale-105 transition-all duration-300
                  `}
                >
                  {typeof icon === 'string' ? <span>{icon}</span> : icon}
                  {/* <span>{label}</span> */}
                </button>
              );
            })}
          </div>
        </div>

        {/* Download Resume, Chatbot, and Like Buttons in one row */}
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
            onClick={() => {
              setIsChatbotOpen(true);
              setShowChatNotification(false);
              setNotificationDismissed(true);
            }}
            className="group relative px-4 py-2 md:px-6 md:py-3 rounded-full 
              bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 
              text-white font-semibold active:scale-95 md:hover:scale-105
              transition-all duration-300 z-10
              md:hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
              md:animate-shimmer bg-[length:200%_100%]
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900
              touch-manipulation min-h-[40px] min-w-[40px]"
            aria-label="Open chat"
          >
            <div className="absolute -inset-1 
              bg-gradient-to-r from-blue-500 to-purple-500 
              rounded-full blur opacity-30 
              group-hover:opacity-70 transition duration-500
              md:group-hover:animate-pulse"
            />
            <div className="relative flex items-center gap-2 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 md:group-hover:animate-bounce"
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
                <span className="text-sm md:text-base group-active:font-bold md:group-hover:font-bold">Let&apos;s chat!</span>
                <span className="absolute -top-1 -right-6 hidden md:group-hover:inline-block">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                  </span>
                </span>
              </div>
            </div>
            
            {/* Chat Notification Popup */}
            {showChatNotification && (
              <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg border border-blue-400/30">
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">💬</span>
                    <span className="font-medium">What if we talk together?</span>
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowChatNotification(false);
                        setNotificationDismissed(true);
                      }}
                      className="ml-2 text-white/80 hover:text-white transition-colors cursor-pointer hover:bg-white/10 rounded-full w-4 h-4 flex items-center justify-center"
                    >
                      ×
                    </div>
                  </div>
                  {/* Speech bubble tail */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-blue-600"></div>
                </div>
              </div>
            )}
          </button>

          <button
            onClick={handleLike}
            disabled={isLiked || hasUserLiked}
            className={`
              group relative px-4 py-2 rounded-lg
              transition-all duration-300 flex items-center gap-1.5
              ${(isLiked || hasUserLiked) 
                ? 'bg-gray-700/30 text-gray-400' 
                : 'bg-gray-700/30 hover:bg-gray-600/30 text-gray-300'
              }
            `}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor" 
              className={`w-4 h-4 ${(isLiked || hasUserLiked) ? 'text-blue-400' : ''}`}
            >
              <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
            </svg>
            <span className={`text-sm ${isLikeAnimating ? 'animate-bounce' : ''}`}>
              {likeCount > 0 ? likeCount : ''}
            </span>
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

