"use client";

import { useState } from 'react';
import Image from 'next/image';

// Move the projects data outside the component
const projectsData = {
  "Financial Technology": [
    {
      title: "Forecasting Critical KPIs",
      description: "Predicted bank KPIs threshold crossings for proactive decision-making",
      tech: ["Python", "Time Series", "Forecasting"],
      metrics: "76% forecasting accuracy"
    },
    {
      title: "Credit Prediction",
      description: "ML model predicting creditworthiness based on bank account data",
      tech: ["R", "Machine Learning", "Financial Analysis"],
      metrics: "85% accuracy, 76% recall"
    },
    {
      title: "Asset Management Platform",
      description: "Prototype platform for investment optimization",
      tech: ["R", "Azure", "Portfolio Analysis"],
      metrics: "Deployed in 3 months"
    },
    {
      title: "Cryptocurrency Analysis Dashboard",
      description: "Real-time crypto portfolio optimization dashboard",
      tech: ["API Integration", "Sharpe Ratio", "HFT"],
      metrics: "Active production use"
    },
    {
      title: "Actuarial Risk Application",
      description: "Optimized catastrophe risk analysis tool for improved efficiency",
      tech: ["R", "Risk Modeling", "Optimization"],
      metrics: "25% efficiency increase"
    }
  ],
  "Healthcare & Life Sciences": [
    {
      title: "RAG Application",
      description: "Retrieval-augmented generation for healthcare data",
      tech: ["Python", "RAG", "Healthcare Analytics"],
      metrics: "Improved decision speed"
    },
    {
      title: "Healthcare Provider Profiling",
      description: "Provider segmentation for improved drug accessibility",
      tech: ["Python", "Clustering", "Healthcare"],
      metrics: "5% proposal rate improvement"
    },
    {
      title: "Patient Medication Analysis",
      description: "Behavior analysis for medication adherence",
      tech: ["Data Analysis", "Healthcare", "Python"],
      metrics: "3% adherence improvement"
    },
    {
      title: "COVID-19 KPI Dashboard",
      description: "Real-time dashboard for COVID-19 cases and vaccination trends",
      tech: ["R", "SQL", "Data Visualization"],
      metrics: "100+ daily users"
    },
    {
      title: "Healthcare KPI Dashboard",
      description: "Interactive dashboard for healthcare professionals",
      tech: ["Python", "BI Tools", "Healthcare"],
      metrics: "High user satisfaction"
    }
  ],
  "Natural Language Processing": [
    {
      title: "Confidential Information Masking",
      description: "Automated sensitive information masking using AI models",
      tech: ["Python", "Hugging Face", "NLP"],
      metrics: "92% accuracy, 50 docs/day"
    },
    {
      title: "Product Recommendation Engine",
      description: "Clustered Israeli products based on nutritional value and price optimization",
      tech: ["Python", "NLP", "Clustering"],
      metrics: "95% segmentation accuracy, <1s processing"
    },
    {
      title: "Tech Article Analysis",
      description: "Deep NLP analysis of tech articles for trend extraction",
      tech: ["Python", "NLP", "SQL"],
      metrics: "Improved user engagement"
    }
  ],
  "Machine Learning & AI": [
    {
      title: "AI Agent Automation Platform",
      description: "End-to-end automation platform using AI agents to identify optimal tools for consultants handling complex tasks",
      tech: ["Python", "LLM", "GenAI", "FastAPI", "Docker", "Langchain"],
      metrics: "82% user satisfaction, dramatic time reduction"
    },
    {
      title: "Anomaly Detection System",
      description: "Real-time anomaly detection for SaaS KPI monitoring",
      tech: ["Python", "Time Series", "ML"],
      metrics: "Reduced downtime significantly"
    },
    {
      title: "Musical Genre Prediction",
      description: "Genre prediction using audio spectrograms",
      tech: ["Python", "Computer Vision", "ML"],
      metrics: "72% accuracy"
    }
  ]
} as const; // Make it a constant to ensure consistency

export default function Projects() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayCount, setDisplayCount] = useState(2);

  const handleShowMore = () => {
    setIsExpanded(!isExpanded);
    setDisplayCount(isExpanded ? 2 : Infinity);
  };

  return (
    <div className="space-y-12">
      {/* GitHub Contributions with enhanced styling */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">GitHub Contributions</h3>
        <div className="w-full overflow-hidden rounded-lg bg-gray-700/30 hover:bg-gray-700/40 transition-all duration-300 p-4 group">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative">
              <Image
                src="https://ghchart.rshah.org/gradient/AvnerAdda"
                alt="GitHub Contributions Graph"
                width={800}
                height={128}
                className="w-full h-auto rounded-md hover:scale-[1.01] transition-transform duration-300"
                unoptimized // Since this is an external dynamic image
              />
            </div>
          </div>
        </div>
      </div>

      {/* Featured Projects - Now in a single row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Featured Lilmod Project */}
        <a 
          href="https://lilmod-ai.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block group"
        >
          <div className="relative p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 
            transition-all duration-300 hover:from-orange-500/20 hover:to-orange-600/20 hover:border-orange-500/30 hover:shadow-lg h-full">
            <div className="absolute top-3 right-3 w-16 h-16 opacity-20">
              <Image
                src="/images/lilmod.svg"
                alt="Lilmod Logo"
                width={64}
                height={64}
                className="w-full h-full text-orange-500"
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-400 text-xs font-semibold tracking-wider uppercase">
                  Featured Project
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-bold text-orange-500">
                Lilmod - AI Language Learning Platform
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Full-stack AI-powered language learning platform with personalized learning paths, 
                adaptive quizzes, and news-based content
              </p>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {["GCP", "AI/ML/GenAI", "SQL", "Next.js", "TypeScript"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-orange-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-sm font-semibold">93% user progress improvement</span>
              </div>
            </div>
          </div>
        </a>

        {/* Featured LadderAZ Project */}
        <a 
          href="https://ladderaz.web.app/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block group"
        >
          <div className="relative p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-blue-500/20 
            transition-all duration-300 hover:from-blue-500/20 hover:to-purple-600/20 hover:border-blue-500/30 hover:shadow-lg h-full">
            <div className="absolute top-3 right-3 w-16 h-16 opacity-20">
              <Image
                src="/images/ladderaz.svg"
                alt="LadderAZ Logo"
                width={64}
                height={64}
                className="w-full h-full text-blue-500"
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-400 text-xs font-semibold tracking-wider uppercase">
                  Featured Project
                </span>
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-bold text-blue-500">
                LadderAZ - Gamified Learning Platform
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Make learning engaging and effective with gamified challenges, team competitions, and personalized insights.
              </p>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {["Firebase", "Python", "Next.js", "ML", "LLM", "GenAI"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-blue-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-sm font-semibold">Continuous learning for 95% of users</span>
              </div>
            </div>
          </div>
        </a>

        {/* Featured Kaspenu Project */}
        <a 
          href="https://www.kaspenu.org/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="block group"
        >
          <div className="relative p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-500/20 
            transition-all duration-300 hover:from-green-500/20 hover:to-emerald-600/20 hover:border-green-500/30 hover:shadow-lg h-full">
            <div className="absolute top-3 right-3 w-16 h-16 opacity-20">
              <Image
                src="/images/kaspenu.avif"
                alt="Kaspenu Logo"
                width={64}
                height={64}
                className="w-full h-full"
              />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-green-400 text-xs font-semibold tracking-wider uppercase">
                  Featured Project
                </span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-bold text-green-500">
                Kaspenu - Smart Consumer Platform
              </h3>
              <p className="mt-2 text-sm text-gray-300">
                Provides transparent, unbiased information to help consumers in Israel make informed, healthy purchases at fair prices.
              </p>
              
              <div className="mt-3 flex flex-wrap gap-1">
                {["Python", "Data Science", "ML", "RecSys", "LLM"].map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-1 text-xs rounded-full bg-green-500/10 text-green-400 border border-green-500/20"
                  >
                    {tech}
                  </span>
                ))}
              </div>
              
              <div className="mt-3 flex items-center gap-2 text-green-400">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <span className="text-sm font-semibold">Best price & health recommendations for more that 50,000 users</span>
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Additional Smaller Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Energy Leads Phone Project */}
        <div className="relative p-3 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 
          transition-all duration-300 hover:from-gray-500/20 hover:to-gray-600/20 hover:border-gray-500/30 hover:shadow-md">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">
                Side Project
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse"></div>
            </div>
            <h3 className="text-md font-bold text-gray-300">
              Energy Leads Phone
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Real-time conversation system by phone for Leads in Energy sector with intelligent call routing
            </p>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {["Python", "Twilio", "Real-time", "AI"].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Smart Portfolio Project */}
        <div className="relative p-3 rounded-lg bg-gradient-to-r from-gray-500/10 to-gray-600/10 border border-gray-500/20 
          transition-all duration-300 hover:from-gray-500/20 hover:to-gray-600/20 hover:border-gray-500/30 hover:shadow-md">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-xs font-semibold tracking-wider uppercase">
                Side Project
              </span>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            </div>
            <h3 className="text-md font-bold text-gray-300">
              Smart Portfolio Tracker
            </h3>
            <p className="mt-1 text-sm text-gray-400">
              Intelligent portfolio management system to track and optimize your personal finance investments
            </p>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {["Python", "Finance", "ML", "Dashboard"].map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 text-xs rounded-full bg-gray-500/10 text-gray-400 border border-gray-500/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <button
            onClick={handleShowMore}
            className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>

        {Object.entries(projectsData).map(([category, categoryProjects]) => (
          <div key={category} className="space-y-4">
            <h3 className="text-2xl font-semibold text-blue-400">{category}</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {categoryProjects.slice(0, displayCount).map((project: any) => (
                <div 
                  key={project.title}
                  className="p-4 rounded-lg bg-gray-700/30 hover:glow-on-hover cursor-pointer hover-float"
                >
                  <h4 className="text-xl font-semibold text-blue-400">{project.title}</h4>
                  <p className="text-gray-300 mt-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.tech.map((t: string) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-600/50">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-green-400">
                    {project.metrics}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

