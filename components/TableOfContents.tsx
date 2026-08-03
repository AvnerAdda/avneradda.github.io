"use client";

import React, { useCallback, useEffect, useMemo } from 'react';

interface Section {
  id: string;
  title: string;
}

const sections: Section[] = [
  { id: 'profile', title: 'Home' },
  { id: 'introduction', title: 'About' },
  { id: 'experience', title: 'Experience' },
  { id: 'projects', title: 'Projects' },
  { id: 'tools', title: 'Tools' },
  { id: 'education', title: 'Education' },
  { id: 'articles', title: 'Articles' },
  { id: 'hobbies', title: 'Life' },
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
    rootMargin: '-18% 0px -68% 0px',
    threshold: 0,
  }), []);

  useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const elements = sections.map(({ id }) => document.getElementById(id)).filter(Boolean);

    elements.forEach((element) => element && observer.observe(element));

    return () => observer.disconnect();
  }, [observerCallback, observerOptions]);

  const scrollToSection = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav
      className="fixed left-1/2 top-4 z-40 w-[calc(100%-1rem)] max-w-6xl -translate-x-1/2"
      aria-label="Primary navigation"
    >
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/45 px-2 py-2 shadow-2xl shadow-black/25 backdrop-blur-xl">
        <button
          onClick={() => scrollToSection('profile')}
          className="hidden shrink-0 rounded-full px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-white/10 sm:inline-flex"
        >
          Avner Adda
        </button>

        <div className="no-scrollbar flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`shrink-0 rounded-full px-3 py-2 text-sm transition ${
                activeSection === section.id
                  ? 'bg-white text-stone-950'
                  : 'text-stone-300 hover:bg-white/10 hover:text-white'
              }`}
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              {section.title}
            </button>
          ))}
        </div>

        <a
          href="https://github.com/avneradda/avneradda.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-action hidden shrink-0 rounded-full sm:inline-flex"
          aria-label="View website source on GitHub"
          title="View source"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.05.13 3.01.4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </nav>
  );
}
