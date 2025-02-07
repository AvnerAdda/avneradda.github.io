"use client";
import React, { useEffect, useCallback, useMemo } from 'react';

interface Section {
  id: string;
  title: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'profile', title: 'Profile', icon: '👤' },
  { id: 'introduction', title: 'About Me', icon: '👋' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'experience', title: 'Experience', icon: '💼' },
  { id: 'projects', title: 'Projects', icon: '🚀' },
  { id: 'tools', title: 'Tools', icon: '🛠️' },
  { id: 'hobbies', title: 'Hobbies', icon: '🎯' },
  { id: 'articles', title: 'Articles', icon: '📝' },
];

export default function TableOfContents() {
  const [activeSection, setActiveSection] = React.useState('profile');

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveSection(entry.target.id);
      }
    });
  }, []);

  const observerOptions = useMemo(() => ({
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0,
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);
    
    elements.forEach(element => element && observer.observe(element));

    return () => observer.disconnect();
  }, [observerCallback, observerOptions]);

  const scrollToSection = useCallback((id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 space-y-4 hidden lg:block" aria-label="Table of contents">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`w-full flex items-center space-x-2 px-4 py-2 rounded-md transition-all duration-200 ${
              activeSection === section.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'
            }`}
            aria-current={activeSection === section.id ? 'true' : undefined}
          >
            <span role="img" aria-label={section.title}>{section.icon}</span>
            <span className="text-sm">{section.title}</span>
          </button>
        ))}
      </div>
    </nav>
  );
} 