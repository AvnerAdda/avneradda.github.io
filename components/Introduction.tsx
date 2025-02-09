"use client";

import { useState } from 'react';

export default function Introduction() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 hover:from-blue-500 hover:via-purple-600 hover:to-pink-600 transition-all duration-300 animate-slideDown">
          About Me
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 animate-slideDown"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-20 opacity-90'}`}>
        {isExpanded ? (
          <div className="prose prose-invert animate-fadeIn">
            <p className="text-gray-300 leading-relaxed text-lg">
              I&apos;m a Data Scientist with a passion for building innovative AI solutions. 
              With a background in Applied Mathematics and Computer Science, I specialize in 
              Machine Learning and AI, particularly in Natural Language Processing.
            </p>
            
            <div className="mt-8 p-6 rounded-lg bg-blue-500/10 border border-blue-500/20 shadow-lg transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-xl font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">💪</span> Top 3 Strengths
              </h3>
              <ul className="space-y-3">
                {['Reliable – Consistently delivers high-quality work and meets deadlines',
                  'Analytical Thinker – Excels at breaking down complex problems',
                  'Continuous Learner – Always eager to explore new technologies'
                ].map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-300 animate-slideRight"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <span className="text-blue-400 text-xl">•</span>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 p-6 rounded-lg bg-purple-500/10 border border-purple-500/20 shadow-lg transition-transform hover:scale-[1.02] duration-300">
              <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Areas for Growth
              </h3>
              <ul className="space-y-3">
                {['Working on simplifying technical explanations for non-technical stakeholders',
                  'Learning to balance detail-oriented work with big-picture thinking',
                  'Developing stronger collaboration skills while maintaining independence'
                ].map((weakness, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-300 animate-slideRight"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <span className="text-purple-400 text-xl">•</span>
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-300 leading-relaxed line-clamp-2 text-lg">
            I&apos;m a Data Scientist with a passion for building innovative AI solutions. 
            With a background in Applied Mathematics and Computer Science, I specialize in 
            Machine Learning and AI...
          </p>
        )}
      </div>
    </div>
  );
} 