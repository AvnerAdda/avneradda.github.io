"use client";

import Image from 'next/image'
import { useState } from 'react'
import ChatbotDialog from './ChatbotDialog'

// Move these arrays outside the component to prevent recreation on each render
const STATS = [
  { label: 'Experience', value: '6+ yrs' },
  { label: 'Projects', value: '10+' },
  { label: 'Languages', value: '3' }
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
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleDownloadResume = () => {
    // You'll need to add your resume file to the public folder
    const link = document.createElement('a');
    link.href = 'doc/Resume - Avner.docx'; // Update this with your actual resume file name
    link.download = 'Resume - Avner.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative">
      {/* AI-themed decorative elements */}
      <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-10" />

      <div className="relative space-y-4">
        {/* Profile header with image */}
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

          {/* Name and Title */}
          <div className="hover-float pt-2">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent">
              Avner Adda
            </h1>
            <p className="text-xl text-gray-300">Data Scientist</p>
          </div>
        </div>

        {/* Interactive stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          {STATS.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center p-3 rounded-lg bg-gray-700/30 hover:glow-on-hover cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-2xl font-bold text-blue-400">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tech stack with pulsing effect */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
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
        <div className="mt-6 flex flex-wrap gap-4">
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

        {/* Download Resume and Chatbot Buttons in one row */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handleDownloadResume}
            className="group relative px-6 py-3 rounded-full 
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
              Download Resume
            </div>
          </button>

          <button
            onClick={() => setIsChatbotOpen(true)}
            className="group relative px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold hover:scale-105 transition-all duration-300 z-10"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
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
              Speak to my chatbot
            </div>
          </button>
        </div>

        <ChatbotDialog
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      </div>
    </div>
  )
}

