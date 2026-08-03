"use client";

/* eslint-disable @next/next/no-img-element */
import Image from 'next/image';
import { ReactNode, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { useChatbot } from '../lib/context/ChatbotContext';
import { AnalyticsService } from '../lib/analytics';
import { db, isFirebasePermissionError } from '../lib/firebase';
import { hasIPInteracted, trackIPBasedMetric } from '../lib/ipBasedMetrics';
import MetricsModal from './MetricsModal';

const STATS = [
  {
    label: 'Years in data science',
    shortLabel: 'Experience',
    value: '6+',
    id: 'experience',
  },
  {
    label: 'Production and advisory projects',
    shortLabel: 'Projects',
    value: '20+',
    id: 'projects',
  },
  {
    label: 'Languages for global teams',
    shortLabel: 'Languages',
    value: '3',
    id: 'hobbies',
  },
];

const TECH_STACK = [
  'Python',
  'GenAI',
  'RAG',
  'AWS',
  'GCP',
  'Spark',
  'SQL',
  'Docker',
  'LangChain',
  'Firebase',
];

const CURRENT_WORK = [
  {
    name: 'Deloitte AI agents',
    href: 'https://endeavor.deloitte.com/',
    logo: '/images/deloitte.svg',
  },
  {
    name: 'ShekelSync',
    href: 'https://www.shekelsync.com/',
    logo: '/images/shekelsync.svg',
  },
  {
    name: 'LadderAZ',
    href: 'https://ladderaz.web.app/',
    logo: '/images/ladderaz.svg',
  },
  {
    name: 'Lilmod',
    href: 'https://lilmod-ai.com',
    logo: '/images/lilmod.svg',
  },
  {
    name: 'Kaspenu',
    href: 'https://www.kaspenu.org/',
    logo: '/images/kaspenu.avif',
  },
];

const CONTACT_INFO: Array<{
  icon: ReactNode;
  label: string;
  href?: string;
}> = [
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M0 4a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2 0v.22l10 5.5 10-5.5V4H2Zm20 2.38-10 5.5-10-5.5V20h20V6.38Z" />
      </svg>
    ),
    label: 'Email',
    href: 'mailto:avner.adda@outlook.com',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5Z" />
      </svg>
    ),
    label: 'Tel Aviv',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.72-4.03-1.42-4.03-1.42-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.66-.31-5.47-1.34-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.05.13 3.01.4c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58A12.01 12.01 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
      </svg>
    ),
    label: 'GitHub',
    href: 'https://github.com/AvnerAdda',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13Zm1.78 13.02H3.56V9h3.56v11.45ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
      </svg>
    ),
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/avneradda/',
  },
  {
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.64.08-.3-.15-1.26-.46-2.39-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.07c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.69.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26C2.16 6.44 6.6 2 12.05 2c2.64 0 5.12 1.03 6.99 2.9a9.83 9.83 0 0 1 2.89 6.99c0 5.45-4.44 9.89-9.88 9.89ZM20.47 3.49A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.31-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9a11.82 11.82 0 0 0-3.48-8.41Z" />
      </svg>
    ),
    label: 'WhatsApp',
    href: 'https://wa.me/972533999137?text=Hey%21%20I%20saw%20your%20profile%20and%20would%20love%20to%20connect%20about%20your%20work.',
  },
];

export default function Profile() {
  const {
    setIsChatbotOpen,
    showChatNotification,
    setShowChatNotification,
    setNotificationDismissed,
  } = useChatbot();
  const [isLiked, setIsLiked] = useState(false);
  const [hasUserLiked, setHasUserLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);
  const [isMetricsOpen, setIsMetricsOpen] = useState(false);
  const [likesAvailable, setLikesAvailable] = useState(true);

  useEffect(() => {
    const feedbackRef = doc(db, 'ip_metrics', 'profile_likes');
    const unsubscribe = onSnapshot(
      feedbackRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setLikeCount(docSnapshot.data()?.count || 0);
        }
      },
      (error) => {
        if (isFirebasePermissionError(error)) {
          setLikesAvailable(false);
          setLikeCount(0);
          return;
        }

        console.error('Error listening to like metrics:', error);
      }
    );

    const checkIPStatus = async () => {
      const hasLiked = await hasIPInteracted('profile_likes');
      setHasUserLiked(hasLiked);
      setIsLiked(hasLiked);
    };

    checkIPStatus();
    return () => unsubscribe();
  }, []);

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
    if (!likesAvailable || isLiked || hasUserLiked) {
      return;
    }

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
  };

  const handleDownloadResume = async () => {
    try {
      const wasTracked = await trackIPBasedMetric('resume_downloads');
      if (wasTracked) {
        AnalyticsService.trackDocumentAction('download', 'resume');
      }

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
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const openChat = () => {
    setIsChatbotOpen(true);
    setShowChatNotification(false);
    setNotificationDismissed(true);
  };

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]">
      <div className="max-w-3xl">
        <p className="section-eyebrow">Data Scientist & AI Engineer</p>
        <h1 className="text-4xl font-bold leading-tight text-stone-50 sm:text-5xl">
          Building AI products that move from notebook to production.
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-300">
          I am Avner Adda, a Tel Aviv based data scientist focused on applied
          machine learning, GenAI systems, RAG, and analytics products across
          consulting, healthcare, financial services, and consumer platforms.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={handleDownloadResume} className="primary-action">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4-4 4m0 0-4-4m4 4V4" />
            </svg>
            Download resume
          </button>

          <div className="relative inline-flex">
            <button type="button" onClick={openChat} className="secondary-action w-full sm:w-auto" aria-label="Open chat">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-5 5v-5Z" />
              </svg>
              Ask the portfolio
            </button>

            {showChatNotification && (
              <div className="absolute -top-16 left-1/2 z-20 w-56 -translate-x-1/2 rounded-lg border border-white/15 bg-stone-950 px-3 py-2 text-xs text-stone-100 shadow-2xl">
                <div className="flex items-center justify-between gap-3">
                  <span>Ask about projects or experience.</span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowChatNotification(false);
                      setNotificationDismissed(true);
                    }}
                    className="rounded-full px-1 text-stone-400 transition hover:bg-white/10 hover:text-white"
                    aria-label="Dismiss chat prompt"
                  >
                    x
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              AnalyticsService.trackProfileInteraction('metrics_view');
              setIsMetricsOpen(true);
            }}
            className="secondary-action"
          >
            View metrics
          </button>
        </div>

        <div className="mt-7 flex flex-wrap gap-2">
          {CONTACT_INFO.map(({ icon, label, href }) => {
            if (!href) {
              return (
                <span key={label} className="icon-action w-auto gap-2 px-3 text-sm">
                  {icon}
                  {label}
                </span>
              );
            }

            return (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel={href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                className="icon-action w-auto gap-2 px-3 text-sm"
                aria-label={label}
              >
                {icon}
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {TECH_STACK.map((tech) => (
            <span key={tech} className="chip">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <aside className="space-y-4">
        <div className="surface-card overflow-hidden p-0">
          <div className="relative h-80 overflow-hidden">
            <Image
              src="/images/profile-picture.jpg"
              alt="Avner Adda"
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-sm text-stone-100 backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Data Scientist at
                <img
                  src="/images/deloitte.svg"
                  alt="Deloitte"
                  className="h-5 w-auto"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat) => (
            <button
              key={stat.label}
              type="button"
              onClick={() => scrollToSection(stat.id)}
              className="metric-card text-left"
              aria-label={`Go to ${stat.shortLabel}`}
            >
              <span className="block text-2xl font-bold text-white">{stat.value}</span>
              <span className="mt-1 block text-xs leading-5 text-stone-400">{stat.shortLabel}</span>
            </button>
          ))}
        </div>

        <div className="surface-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-stone-50">Current focus</h2>
              <p className="mt-1 text-sm text-stone-400">AI agents, finance apps, and learning products.</p>
            </div>
            <button
              type="button"
              onClick={handleLike}
              disabled={!likesAvailable || isLiked || hasUserLiked}
              title={likesAvailable ? 'Like this profile' : 'Likes are unavailable while Firebase access is disabled'}
              className={`inline-flex h-10 min-w-10 items-center justify-center gap-1 rounded-lg border px-3 text-sm transition ${
                !likesAvailable || isLiked || hasUserLiked
                  ? 'border-white/10 bg-white/5 text-stone-400'
                  : 'border-white/15 bg-white/5 text-stone-200 hover:bg-white/10'
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className={`h-4 w-4 ${!likesAvailable || isLiked || hasUserLiked ? 'text-emerald-300' : ''}`}
                aria-hidden="true"
              >
                <path d="M7.49 18.75c-.43 0-.82-.24-.98-.63A7.48 7.48 0 0 1 6 15.38c0-1.75.6-3.36 1.6-4.64.15-.19.37-.31.6-.4.47-.18.89-.51 1.21-.92a9.04 9.04 0 0 1 2.86-2.4c.72-.38 1.35-.96 1.65-1.72.21-.52.32-1.09.32-1.67V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.15-.26 2.24-.72 3.22-.27.56.11 1.28.73 1.28h3.12c1.03 0 1.95.69 2.06 1.72.04.42.07.85.07 1.28 0 2.85-.99 5.48-2.65 7.52-.39.48-.99.73-1.61.73h-5.02c-.48 0-.96-.08-1.42-.23l-3.11-1.04a4.5 4.5 0 0 0-1.43-.23h-.77ZM2.33 10.98a11.97 11.97 0 0 0-.83 4.4c0 1.22.18 2.4.52 3.5.26.85 1.08 1.37 1.97 1.37h.91c.45 0 .72-.5.52-.9a8.96 8.96 0 0 1-.92-3.97c0-1.71.48-3.31 1.3-4.67.25-.4-.03-.96-.5-.96H4.25c-.83 0-1.61.45-1.92 1.23Z" />
              </svg>
              <span className={isLikeAnimating ? 'animate-bounce' : ''}>
                {likeCount > 0 ? likeCount : ''}
              </span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {CURRENT_WORK.map((work) => (
              <a
                key={work.name}
                href={work.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-sm text-stone-200 transition hover:border-white/20 hover:bg-white/[0.07]"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-white/90 p-1">
                  <img
                    src={work.logo}
                    alt=""
                    className="h-7 w-7 object-contain"
                  />
                </span>
                <span>{work.name}</span>
              </a>
            ))}
          </div>
        </div>
      </aside>

      <MetricsModal isOpen={isMetricsOpen} onClose={() => setIsMetricsOpen(false)} />
    </div>
  );
}
