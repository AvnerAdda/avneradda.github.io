import Image from 'next/image';

const CERTIFICATIONS = [
  {
    name: "AWS Machine Learning Specialty",
    issuer: "Amazon Web Services",
    year: "2023",
    logo: "/images/aws.svg",
    link: "https://www.credly.com/badges/ae7f1c76-96fb-487e-9adb-742347a6eb55"
  },
  {
    name: "Professional Data Scientist",
    issuer: "Google - GCP",
    year: "2023",
    logo: "/images/gcp.svg",
    link: "https://google.accredible.com/9de117cd-79c1-4d5d-beed-578890256ac7"
  },
  {
    name: "Build a Chatbot with NVIDIA RAG",
    issuer: "NVIDIA",
    year: "2023",
    logo: "/images/nvidia.svg",
    link: "https://courses.nvidia.com/certificates/02a9c5fa944448549f7e4df6ea931d0a/"
  }
];

export default function Education() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent">
        Education
      </h2>
      {/* Existing Education Content */}
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
            {/* Certifications Section */}
            <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-blue-400">Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {CERTIFICATIONS.map((cert) => (
            <a
              key={cert.name}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group px-4 py-3 rounded-lg bg-gray-700/30 text-sm flex items-center gap-3 hover:bg-gray-700/50 transition-all duration-300 w-full"
            >
              <Image
                src={cert.logo}
                alt={`${cert.issuer} logo`}
                width={24}
                height={24}
                className="opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-green-400 flex items-center gap-2 truncate">
                  <span>✓</span>
                  <span className="truncate">{cert.name}</span>
                </span>
                <span className="text-xs text-gray-400">{cert.year}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

