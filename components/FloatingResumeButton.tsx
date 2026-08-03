"use client";

import { useState, useEffect } from 'react';
import { AnalyticsService } from '../lib/analytics';
import { trackIPBasedMetric } from '../lib/ipBasedMetrics';

export default function FloatingResumeButton() {
  const [isProfileVisible, setIsProfileVisible] = useState(true);

  useEffect(() => {
    const profileSection = document.getElementById('profile');
    if (!profileSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsProfileVisible(entry.isIntersecting);
      },
      {
        threshold: 0.1, // Trigger when 10% of profile is visible
        rootMargin: '0px 0px -50px 0px' // Add some margin for smoother transition
      }
    );

    observer.observe(profileSection);

    return () => observer.disconnect();
  }, []);

  const handleDownloadResume = async () => {
    try {
      // Track download with the same IP-based metric flow used in the profile.
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
      console.error('Error downloading resume:', error);
    }
  };

  return (
    <div 
      className={`fixed bottom-36 right-4 z-40 transition-all duration-500 ease-out ${
        isProfileVisible 
          ? 'translate-x-16 opacity-0 pointer-events-none' 
          : 'translate-x-0 opacity-100 pointer-events-auto'
      }`}
    >
      <button
        onClick={handleDownloadResume}
        className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-stone-950/80 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:border-white/25 hover:bg-stone-900"
        aria-label="Download Resume"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 h-6 w-6"
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
      </button>
    </div>
  );
}
