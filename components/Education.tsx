export default function Education() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent">
        Education
      </h2>

      <div className="space-y-4">
        {[
          {
            degree: 'Data Science Program',
            school: 'Israel Tech Challenge',
            year: '2019-2020',
            highlights: [
              'Machine Learning',
              'Deep Learning',
              'Natural Language Processing',
              'Computer Vision',
              'Research',
              'Teamwork'
            ],
            description: 'A full-time training course in collaboration with leading tech companies, which qualifies talented STEM MSc graduates as professional Data Scientists.'
          },
          {
            degree: 'Master\'s Degree Sc. Applied Mathematics & Computer Science',
            school: 'ESILV',
            year: '2013-2018',
            highlights: [
              'Banking Industry',
              'High-frequency Trading',
              'Risk Management',
              'FinTech',
              'Data Science',
              'Supervised Learning',
              'Unsupervised Learning'
            ],
            description: 'Curriculum entailing the consideration of the main trends observed in the banking industry and in the job market, coupled with Data Science courses.'
          }
        ].map((edu, index) => (
          <div 
            key={edu.degree}
            className="p-6 rounded-lg bg-gray-700/30 hover:glow-on-hover hover-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-blue-400">{edu.degree}</h3>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">{edu.school}</span>
                <span className="text-sm text-gray-400">{edu.year}</span>
              </div>
              
              <p className="text-gray-300 text-sm">{edu.description}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {edu.highlights.map((highlight) => (
                  <span 
                    key={highlight}
                    className="text-xs px-2 py-1 rounded-full bg-gray-600/50 animate-pulse"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

