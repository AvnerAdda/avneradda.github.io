"use client";

import { useState } from 'react';

export default function Introduction() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
          About Me
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors"
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>
      </div>

      {isExpanded ? (
        <div className="prose prose-invert">
          <p className="text-gray-300 leading-relaxed">
            I&apos;m a Data Scientist with a strong foundation in Applied Mathematics and Computer Science, 
            bringing over 6 years of hands-on experience in machine learning and artificial intelligence. 
            My journey began at ESILV where I specialized in FinTech and Risk Management, followed by 
            intensive training at Israel Tech Challenge where I honed my skills in cutting-edge ML/AI technologies.
          </p>
          
          <p className="text-gray-300 leading-relaxed mt-4">
            Currently at Deloitte, I work on implementing innovative AI solutions across various industries, 
            from Life Sciences to Banking. I&apos;m particularly passionate about Natural Language Processing and 
            building scalable AI systems. My expertise spans across AWS and GCP cloud platforms, where I hold 
            professional certifications in Machine Learning and Data Science.
          </p>

          <p className="text-gray-300 leading-relaxed mt-4">
            When I&apos;m not working with data, I&apos;m either contributing to open-source projects or exploring the 
            latest developments in AI technology. I believe in building AI solutions that are not just powerful, 
            but also ethical and accessible.
          </p>
        </div>
      ) : (
        <p className="text-gray-300 leading-relaxed line-clamp-2">
          I&apos;m a Data Scientist with a strong foundation in Applied Mathematics and Computer Science, 
          bringing over 6 years of hands-on experience in machine learning and artificial intelligence...
        </p>
      )}
    </div>
  );
} 