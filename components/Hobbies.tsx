import React from 'react';

const languages = [
  {
    language: 'French',
    level: 'Native',
    icon: '🇫🇷',
    description: 'Mother tongue'
  },
  {
    language: 'English',
    level: 'Native',
    icon: '🇬🇧',
    description: 'Bilingual proficiency'
  },
  {
    language: 'Hebrew',
    level: 'Professional',
    icon: '🇮🇱',
    description: 'Professional working proficiency'
  }
];

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
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-400">Languages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map((lang) => (
            <div 
              key={lang.language}
              className="p-4 rounded-lg bg-gradient-to-br from-gray-800/80 to-gray-800/40 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-3xl mb-2">{lang.icon}</span>
                <h3 className="font-semibold text-blue-400">{lang.language}</h3>
                <span className="text-sm text-purple-400 font-medium">{lang.level}</span>
                <p className="text-gray-400 text-sm">{lang.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-blue-400">Hobbies & Interests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hobbies.map((hobby) => (
            <div 
              key={hobby.title}
              className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02]"
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
    </div>
  );
} 