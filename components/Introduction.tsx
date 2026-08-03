"use client";

import { useState } from 'react';

const strengths = [
  'Translates ambiguous business questions into measurable data products.',
  'Builds practical GenAI systems with retrieval, evaluation, and production constraints in mind.',
  'Works across stakeholder groups, from technical teams to executives and client-facing consultants.',
];

const focusAreas = [
  'RAG and AI-agent workflows',
  'Healthcare and financial analytics',
  'Data products from prototype to adoption',
  'Model evaluation and operational quality',
];

export default function Introduction() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
      <div>
        <p className="section-eyebrow">About</p>
        <h2 className="section-title">Applied AI with a product mindset.</h2>
        <p className="section-lede">
          My work sits at the intersection of data science, software delivery,
          and business decision-making. I care about models that survive real
          users, real data quality, and real operational pressure.
        </p>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="secondary-action mt-6"
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="surface-card">
          <h3 className="text-lg font-semibold text-stone-50">What I bring</h3>
          <ul className="mt-4 space-y-3">
            {strengths.map((strength) => (
              <li key={strength} className="flex gap-3 text-sm leading-6 text-stone-300">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {focusAreas.map((area) => (
            <div key={area} className="metric-card text-sm text-stone-300">
              {area}
            </div>
          ))}
        </div>

        {isExpanded && (
          <div className="surface-card">
            <p className="text-sm leading-7 text-stone-300">
              I started with applied mathematics and computer science, then
              moved into machine learning, NLP, analytics, and GenAI delivery.
              The common thread is the same: understand the decision, shape the
              data, build a useful system, and keep iterating until it earns
              trust with the people who depend on it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
