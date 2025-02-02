import React from 'react';

const hobbies = [
  {
    title: 'Reading',
    icon: '📚',
    description: 'Passionate about continuous learning through books'
  },
  {
    title: 'Volunteering',
    icon: '🤝',
    description: 'Contributing to the community and making a positive impact'
  },
  {
    title: 'Writing Articles',
    icon: '✍️',
    description: 'Sharing knowledge and insights through technical writing'
  },
  {
    title: 'Soccer & Gaming',
    icon: '⚽',
    description: 'Enjoying competitive sports and strategic gaming'
  },
  {
    title: 'Surfing',
    icon: '🏄‍♂️',
    description: 'Catching waves and embracing the ocean lifestyle'
  },
  {
    title: 'CrossFit',
    icon: '💪',
    description: 'Committed to fitness and personal development'
  }
];

export default function Hobbies() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-400">Hobbies & Interests</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {hobbies.map((hobby) => (
          <div 
            key={hobby.title}
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{hobby.icon}</span>
              <div>
                <h3 className="font-semibold text-blue-400">{hobby.title}</h3>
                <p className="text-gray-400 text-sm">{hobby.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 