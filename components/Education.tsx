import Image from 'next/image';

const education = [
  {
    degree: 'Data Science Program',
    school: 'Israel Tech Challenge',
    year: '2019 - 2020',
    description:
      'Full-time program built with leading technology companies to train STEM graduates as professional data scientists.',
    highlights: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Research', 'Teamwork'],
  },
  {
    degree: "Master's Degree in Applied Mathematics & Computer Science",
    school: 'ESILV',
    year: '2013 - 2018',
    description:
      'Applied mathematics and computer science curriculum with banking, risk management, FinTech, and data science focus.',
    highlights: ['Banking', 'High-frequency Trading', 'Risk Management', 'FinTech', 'Data Science', 'Supervised Learning'],
  },
];

const certifications = [
  {
    name: 'AWS Machine Learning Specialty',
    issuer: 'Amazon Web Services',
    year: '2023',
    logo: '/images/aws.svg',
    link: 'https://www.credly.com/badges/ae7f1c76-96fb-487e-9adb-742347a6eb55',
  },
  {
    name: 'Professional Data Scientist',
    issuer: 'Google Cloud',
    year: '2023',
    logo: '/images/gcp.svg',
    link: 'https://google.accredible.com/9de117cd-79c1-4d5d-beed-578890256ac7',
  },
  {
    name: 'Build a Chatbot with NVIDIA RAG',
    issuer: 'NVIDIA',
    year: '2023',
    logo: '/images/nvidia.svg',
    link: 'https://courses.nvidia.com/certificates/02a9c5fa944448549f7e4df6ea931d0a/',
  },
];

export default function Education() {
  return (
    <div>
      <p className="section-eyebrow">Education</p>
      <h2 className="section-title">Training and certifications</h2>
      <p className="section-lede">
        A foundation in applied mathematics and computer science, strengthened
        by hands-on cloud and machine learning certifications.
      </p>

      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        {education.map((edu) => (
          <article key={edu.degree} className="surface-card">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                <p className="mt-1 text-sm text-stone-400">{edu.school}</p>
              </div>
              <span className="chip">{edu.year}</span>
            </div>
            <p className="mt-4 text-sm leading-7 text-stone-300">{edu.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {edu.highlights.map((highlight) => (
                <span key={highlight} className="chip">
                  {highlight}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold text-white">Certifications</h3>
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
          {certifications.map((cert) => (
            <a
              key={cert.name}
              href={cert.link}
              target="_blank"
              rel="noopener noreferrer"
              className="surface-card flex items-center gap-4"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/90 p-2">
                <Image
                  src={cert.logo}
                  alt={`${cert.issuer} logo`}
                  width={40}
                  height={40}
                  className="max-h-10 w-auto object-contain"
                />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-white">{cert.name}</span>
                <span className="mt-1 block text-xs text-stone-400">
                  {cert.issuer} / {cert.year}
                </span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
