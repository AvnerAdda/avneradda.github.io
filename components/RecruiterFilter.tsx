import React, { useState } from 'react';
import { RecruiterFilterCriteria } from '../lib/chatbot/chatState';
import { chatOptions } from '../lib/chatbot/chatState';

interface RecruiterFilterProps {
  onComplete: (criteria: RecruiterFilterCriteria) => void;
  disabled?: boolean;
}

export default function RecruiterFilter({ onComplete, disabled }: RecruiterFilterProps) {
  const [criteria, setCriteria] = useState<RecruiterFilterCriteria>({
    isIsraelBased: false,
    isSeniorRole: false,
    isAIFocused: false,
    hasCloudTech: false,
    hasCompellingOffer: false
  });

  const handleChange = (id: keyof RecruiterFilterCriteria) => {
    setCriteria(prev => {
      const newCriteria = { ...prev };
      
      // If clicking the compelling offer checkbox
      if (id === 'hasCompellingOffer') {
        if (!prev.hasCompellingOffer) {
          // If enabling compelling offer, set all other criteria to true
          return {
            isIsraelBased: true,
            isSeniorRole: true,
            isAIFocused: true,
            hasCloudTech: true,
            hasCompellingOffer: true
          };
        } else {
          // If disabling compelling offer, reset all criteria
          return {
            isIsraelBased: false,
            isSeniorRole: false,
            isAIFocused: false,
            hasCloudTech: false,
            hasCompellingOffer: false
          };
        }
      }
      
      // For other checkboxes, just toggle their value
      newCriteria[id] = !prev[id];
      // If compelling offer was checked, uncheck it when modifying other criteria
      if (prev.hasCompellingOffer) {
        newCriteria.hasCompellingOffer = false;
      }
      
      return newCriteria;
    });
  };

  const allChecked = criteria.hasCompellingOffer || Object.entries(criteria)
    .filter(([key]) => key !== 'hasCompellingOffer')
    .every(([_, value]) => value);

  return (
    <div className="p-4 space-y-4">
      <div className="space-y-3">
        {chatOptions.recruiter.filterCriteria.map(({ id, label }) => (
          <label 
            key={id}
            className={`flex items-center gap-3 text-sm text-gray-300 hover:text-gray-200 cursor-pointer
              ${id === 'hasCompellingOffer' ? 'mt-6 pt-4 border-t border-gray-700' : ''}`}
          >
            <input
              type="checkbox"
              checked={criteria[id as keyof RecruiterFilterCriteria]}
              onChange={() => handleChange(id as keyof RecruiterFilterCriteria)}
              disabled={disabled}
              className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-gray-700"
            />
            {label}
          </label>
        ))}
      </div>

      <button
        onClick={() => onComplete(criteria)}
        disabled={disabled || !allChecked}
        className="w-full px-4 py-2 mt-4 text-sm rounded-lg bg-blue-500/10 text-blue-400 
          hover:bg-blue-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continue
      </button>
    </div>
  );
} 