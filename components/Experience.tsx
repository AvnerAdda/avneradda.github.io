const experiences = [
  {
    role: 'Data Scientist',
    company: 'Deloitte',
    period: '2022 - Present',
    location: 'Tel Aviv',
    summary: 'Enterprise AI, GenAI, healthcare analytics, and client-facing data science delivery.',
    achievements: [
      'Implemented NLP-based sensitive information masking for document workflows.',
      'Architected and implemented an enterprise-scale Graph-RAG system for healthcare data processing.',
      'Led clustering work over 1M+ patient records to optimize healthcare provider segmentation.',
      'Delivered customer clustering and GenAI analyses for consumer goods and consulting teams.',
    ],
    tools: ['Python', 'AWS', 'GCP', 'Spark', 'NoSQL', 'T-SQL', 'Tableau', 'PowerBI', 'Dataiku', 'NVIDIA', 'Git', 'LLMs'],
  },
  {
    role: 'Data Scientist',
    company: 'Adopt-a-Contractor',
    period: '2020 - 2022',
    location: 'Netanya',
    summary: 'Production machine learning for marketplace quality, pricing, and operations.',
    achievements: [
      'Led machine learning projects from modeling through production release.',
      'Built algorithms to detect fake requests and improve price prediction quality.',
    ],
    tools: ['Python', 'MySQL', 'ElasticSearch', 'Linux', 'AWS', 'Git'],
  },
  {
    role: 'Data Scientist',
    company: 'PowToon',
    period: '2020',
    location: 'Tel Aviv',
    summary: 'Time-series anomaly detection and KPI history mapping for SaaS analytics.',
    achievements: [
      'Detected anomalies using time-series methods and tested robustness in Python and AWS environments.',
      'Retrieved BI warehouse data with SQL and built historical KPI behavior maps.',
    ],
    tools: ['Python', 'SQL', 'AWS', 'PostgreSQL', 'Snowflake', 'Git'],
  },
];

export default function Experience() {
  return (
    <div>
      <p className="section-eyebrow">Experience</p>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="section-title">Professional work</h2>
          <p className="section-lede">
            A record of building data systems, machine learning workflows, and
            applied AI solutions for production and advisory environments.
          </p>
        </div>
      </div>

      <div className="mt-10 space-y-4">
        {experiences.map((exp) => (
          <article key={`${exp.role}-${exp.company}`} className="surface-card">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-xl font-semibold text-white">{exp.role}</h3>
                <p className="mt-1 text-sm text-stone-400">
                  {exp.company} / {exp.location}
                </p>
              </div>
              <span className="chip">{exp.period}</span>
            </div>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">{exp.summary}</p>

            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {exp.achievements.map((achievement) => (
                <li key={achievement} className="flex gap-3 text-sm leading-6 text-stone-300">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {exp.tools.map((tool) => (
                <span key={tool} className="chip">
                  {tool}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
