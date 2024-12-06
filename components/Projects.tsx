"use client";

import { useState } from 'react';

// Move the projects data outside the component
const projectsData = {
  "Financial Technology": [
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
      title: "Forecasting Critical KPIs",
      description: "Predicted bank KPIs threshold crossings for proactive decision-making",
      tech: ["Python", "Time Series", "Forecasting"],
      metrics: "76% forecasting accuracy"
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
  "Natural Language Processing": [
    {
      title: "Tech Article Analysis",
      description: "Deep NLP analysis of tech articles for trend extraction",
      tech: ["Python", "NLP", "SQL"],
      metrics: "Improved user engagement"
    },
    {
      title: "Confidential Information Masking",
      description: "Automated sensitive information masking using AI models",
      tech: ["Python", "Hugging Face", "NLP"],
      metrics: "92% accuracy, 50 docs/day"
    }
  ],
  "Machine Learning & AI": [
    {
      title: "Musical Genre Prediction",
      description: "Genre prediction using audio spectrograms",
      tech: ["Python", "Computer Vision", "ML"],
      metrics: "72% accuracy"
    },
    {
      title: "Anomaly Detection System",
      description: "Real-time anomaly detection for SaaS KPI monitoring",
      tech: ["Python", "Time Series", "ML"],
      metrics: "Reduced downtime significantly"
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
      title: "Patient Medication Analysis",
      description: "Behavior analysis for medication adherence",
      tech: ["Data Analysis", "Healthcare", "Python"],
      metrics: "3% adherence improvement"
    },
    {
      title: "Healthcare Provider Profiling",
      description: "Provider segmentation for improved drug accessibility",
      tech: ["Python", "Clustering", "Healthcare"],
      metrics: "5% proposal rate improvement"
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
  ]
} as const; // Make it a constant to ensure consistency

export default function Projects() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Create a preview version of the projects data
  const previewProjects = {
    "Machine Learning & AI": projectsData["Machine Learning & AI"].slice(0, 2),
    "Financial Technology": projectsData["Financial Technology"].slice(0, 2),
    "Healthcare & Life Sciences": projectsData["Healthcare & Life Sciences"].slice(0, 2),
  } as const;

  // Choose which data to display based on expanded state
  const displayData = isExpanded ? projectsData : previewProjects;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent">
          Featured Projects
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {Object.entries(displayData).map(([category, categoryProjects]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-2xl font-semibold text-blue-400">{category}</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {categoryProjects.map((project: any) => (
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
  );
}

