"use client";

import Image from 'next/image';
import { useState } from 'react';

type Project = {
  title: string;
  description: string;
  tech: string[];
  metrics: string;
};

const featuredProjects = [
  {
    title: 'Lilmod',
    subtitle: 'AI language learning platform',
    description: 'Personalized learning paths, adaptive quizzes, and news-based content for language practice.',
    href: 'https://lilmod-ai.com',
    logo: '/images/lilmod.svg',
    metric: '93% user progress improvement',
    tech: ['GCP', 'GenAI', 'SQL', 'Next.js', 'TypeScript'],
    accent: 'from-amber-400/25 to-orange-500/10 border-amber-300/25 text-amber-200',
  },
  {
    title: 'LadderAZ',
    subtitle: 'Gamified learning platform',
    description: 'Learning challenges, team competitions, and personalized insights for sustained practice.',
    href: 'https://ladderaz.web.app/',
    logo: '/images/ladderaz.svg',
    metric: 'Continuous learning for 95% of users',
    tech: ['Firebase', 'Python', 'Next.js', 'ML', 'LLM'],
    accent: 'from-sky-400/25 to-cyan-500/10 border-sky-300/25 text-sky-200',
  },
  {
    title: 'Kaspenu',
    subtitle: 'Smart consumer platform',
    description: 'Transparent recommendations that help Israeli consumers compare price, value, and health signals.',
    href: 'https://www.kaspenu.org/',
    logo: '/images/kaspenu.avif',
    metric: '50,000+ users reached',
    tech: ['Python', 'Data Science', 'ML', 'RecSys', 'LLM'],
    accent: 'from-emerald-400/25 to-lime-500/10 border-emerald-300/25 text-emerald-200',
  },
];

const additionalProjects = [
  {
    title: 'Energy Leads Phone',
    label: 'Voice AI',
    description: 'Real-time phone conversation system for energy-sector lead routing and qualification.',
    tech: ['Python', 'Twilio', 'Real-time', 'AI'],
  },
  {
    title: 'ShekelSync',
    label: 'Fintech desktop app',
    description: 'Personal finance desktop app for Israeli banks, credit cards, and portfolio tracking.',
    href: 'https://www.shekelsync.com/',
    logo: '/images/shekelsync.svg',
    tech: ['Electron', 'React', 'Vite', 'SQLite', 'Fintech'],
  },
];

const projectsData: Record<string, Project[]> = {
  'Financial technology': [
    {
      title: 'Forecasting critical KPIs',
      description: 'Predicted bank KPI threshold crossings for proactive decision-making.',
      tech: ['Python', 'Time Series', 'Forecasting'],
      metrics: '76% forecasting accuracy',
    },
    {
      title: 'Credit prediction',
      description: 'Machine learning model for creditworthiness based on bank account data.',
      tech: ['R', 'Machine Learning', 'Financial Analysis'],
      metrics: '85% accuracy, 76% recall',
    },
    {
      title: 'Asset management platform',
      description: 'Prototype platform for investment optimization.',
      tech: ['R', 'Azure', 'Portfolio Analysis'],
      metrics: 'Deployed in 3 months',
    },
    {
      title: 'Cryptocurrency analysis dashboard',
      description: 'Real-time crypto portfolio optimization dashboard.',
      tech: ['API Integration', 'Sharpe Ratio', 'HFT'],
      metrics: 'Active production use',
    },
    {
      title: 'Actuarial risk application',
      description: 'Catastrophe risk analysis tool optimized for operational efficiency.',
      tech: ['R', 'Risk Modeling', 'Optimization'],
      metrics: '25% efficiency increase',
    },
  ],
  'Healthcare and life sciences': [
    {
      title: 'RAG application',
      description: 'Retrieval-augmented generation for healthcare data exploration.',
      tech: ['Python', 'RAG', 'Healthcare Analytics'],
      metrics: 'Improved decision speed',
    },
    {
      title: 'Healthcare provider profiling',
      description: 'Provider segmentation for improved drug accessibility.',
      tech: ['Python', 'Clustering', 'Healthcare'],
      metrics: '5% proposal rate improvement',
    },
    {
      title: 'Patient medication analysis',
      description: 'Behavior analysis for medication adherence.',
      tech: ['Data Analysis', 'Healthcare', 'Python'],
      metrics: '3% adherence improvement',
    },
    {
      title: 'COVID-19 KPI dashboard',
      description: 'Real-time dashboard for cases and vaccination trends.',
      tech: ['R', 'SQL', 'Data Visualization'],
      metrics: '100+ daily users',
    },
    {
      title: 'Healthcare KPI dashboard',
      description: 'Interactive dashboard for healthcare professionals.',
      tech: ['Python', 'BI Tools', 'Healthcare'],
      metrics: 'High user satisfaction',
    },
  ],
  'Natural language processing': [
    {
      title: 'Confidential information masking',
      description: 'Automated sensitive information masking using AI models.',
      tech: ['Python', 'Hugging Face', 'NLP'],
      metrics: '92% accuracy, 50 docs/day',
    },
    {
      title: 'Product recommendation engine',
      description: 'Clustered Israeli products by nutritional value and price optimization.',
      tech: ['Python', 'NLP', 'Clustering'],
      metrics: '95% segmentation accuracy, under 1s processing',
    },
    {
      title: 'Tech article analysis',
      description: 'NLP analysis of technology articles for trend extraction.',
      tech: ['Python', 'NLP', 'SQL'],
      metrics: 'Improved user engagement',
    },
  ],
  'Machine learning and AI': [
    {
      title: 'AI agent automation platform',
      description: 'Agent platform that identifies optimal tools for consultants handling complex tasks.',
      tech: ['Python', 'LLM', 'GenAI', 'FastAPI', 'Docker', 'LangChain'],
      metrics: '82% user satisfaction, dramatic time reduction',
    },
    {
      title: 'Anomaly detection system',
      description: 'Real-time anomaly detection for SaaS KPI monitoring.',
      tech: ['Python', 'Time Series', 'ML'],
      metrics: 'Reduced downtime significantly',
    },
    {
      title: 'Musical genre prediction',
      description: 'Genre prediction using audio spectrograms.',
      tech: ['Python', 'Computer Vision', 'ML'],
      metrics: '72% accuracy',
    },
  ],
};

export default function Projects() {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayCount = isExpanded ? Number.POSITIVE_INFINITY : 2;

  return (
    <div>
      <p className="section-eyebrow">Projects</p>
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <h2 className="section-title">Selected products and data systems</h2>
          <p className="section-lede">
            A mix of public products, consulting delivery, and machine learning
            systems across finance, healthcare, NLP, and AI automation.
          </p>
        </div>
        <a
          href="https://github.com/AvnerAdda"
          target="_blank"
          rel="noopener noreferrer"
          className="secondary-action"
        >
          View GitHub
        </a>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {featuredProjects.map((project) => (
          <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className="group block">
            <article className={`surface-card h-full bg-gradient-to-br ${project.accent}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold">{project.subtitle}</p>
                  <h3 className="mt-3 text-2xl font-bold text-white">{project.title}</h3>
                </div>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/90 p-2">
                  <Image src={project.logo} alt="" width={42} height={42} className="max-h-10 w-auto object-contain" />
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-stone-200">{project.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="chip bg-black/20">
                    {tech}
                  </span>
                ))}
              </div>
              <p className="mt-5 text-sm font-semibold text-white">{project.metric}</p>
            </article>
          </a>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {additionalProjects.map((project) => {
          const card = (
            <article className="surface-card h-full">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-amber-200">{project.label}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{project.description}</p>
                </div>
                {project.logo ? (
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/90 p-2">
                    <Image src={project.logo} alt="" width={42} height={42} className="max-h-10 w-auto object-contain" />
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <span key={tech} className="chip">
                    {tech}
                  </span>
                ))}
              </div>
            </article>
          );

          return project.href ? (
            <a key={project.title} href={project.href} target="_blank" rel="noopener noreferrer" className="block">
              {card}
            </a>
          ) : (
            <div key={project.title}>{card}</div>
          );
        })}
      </div>

      <div className="surface-card mt-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">GitHub contributions</h3>
            <p className="mt-1 text-sm text-stone-400">Recent public contribution activity.</p>
          </div>
        </div>
        <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-white/90 p-3">
          <Image
            src="https://ghchart.rshah.org/gradient/AvnerAdda"
            alt="GitHub contributions graph"
            width={800}
            height={128}
            className="h-auto w-full rounded-md"
            unoptimized
          />
        </div>
      </div>

      <div className="mt-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-2xl font-semibold text-white">Project archive</h3>
            <p className="mt-2 text-sm text-stone-400">Grouped by domain and delivery type.</p>
          </div>
          <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="secondary-action">
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        </div>

        <div className="mt-6 space-y-8">
          {Object.entries(projectsData).map(([category, categoryProjects]) => (
            <div key={category}>
              <h4 className="text-lg font-semibold text-stone-100">{category}</h4>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                {categoryProjects.slice(0, displayCount).map((project) => (
                  <article key={project.title} className="surface-card">
                    <h5 className="text-lg font-semibold text-white">{project.title}</h5>
                    <p className="mt-2 text-sm leading-6 text-stone-300">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <span key={tech} className="chip">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-sm font-semibold text-emerald-200">{project.metrics}</p>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
