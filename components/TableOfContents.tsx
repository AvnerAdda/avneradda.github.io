"use client";
import React, { useEffect } from 'react';

interface Section {
  id: string;
  title: string;
  icon: string;
}

const sections: Section[] = [
  { id: 'profile', title: 'Profile', icon: '👤' },
  { id: 'education', title: 'Education', icon: '🎓' },
  { id: 'experience', title: 'Experience', icon: '💼' },
  { id: 'projects', title: 'Projects', icon: '🚀' },
  { id: 'articles', title: 'Articles', icon: '📝' },
];

export default function TableOfContents() {
  const [activeSection, setActiveSection] = React.useState('profile');

  useEffect(() => {
    const observers = new Map();

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Adjust these values to change when sections become active
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
        observers.set(id, observer);
      }
    });

    // Cleanup
    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 space-y-4 hidden lg:block">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
        {sections.map((section) => (
          <div
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md cursor-pointer transition-all duration-200 ${
              activeSection === section.id
                ? 'bg-blue-500/20 text-blue-400'
                : 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'
            }`}
          >
            <span>{section.icon}</span>
            <span className="text-sm">{section.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 