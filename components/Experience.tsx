export default function Experience() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-blue-500 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
        Experience
      </h2>

      <div className="space-y-4">
        {[
          {
            role: 'Data Scientist',
            company: 'Deloitte',
            period: '2022-Current',
            location: 'Tel-Aviv',
            achievements: [
              'Implemented a data cleansing solution to mask sensitive information on documents using NLP method (NER).',
              'Architected and implemented an enterprise-scale Graph-RAG system for healthcare data processing.',
              'Led end-to-end development of a machine learning clustering algorithm for healthcare provider segmentation, processing 1M+ patient records to optimize drug accessibility pathways',
              'Collaborated with diverse consumer goods clients to deliver personalized customer clustering analyses using classical Machine Learning and Generative AI techniques. Additionally, contributed to the development and improvement of the package',
            ],
            tools: ['Python', 'AWS', 'GCP', 'Spark', 'NoSQL', 'T-SQL', 'Tableau', 'PowerBI', 'Dataiku', 'NVIDIA', 'Git', 'LLMs']
          },
          {
            role: 'Data Scientist',
            company: 'Adopt-a-Contractor',
            period: '2020-2022',
            location: 'Netanya',
            achievements: [
              'Leading company\'s machine learning projects and their releases into production',
              'Implementation of machine learning algorithms to detect and reduce fake requests and predict prices',
            ],
            tools: ['Python', 'MySQL', 'ElasticSearch', 'Linux', 'AWS', 'Git']
          },
          {
            role: 'Data Scientist',
            company: 'PowToon',
            period: '2020',
            location: 'Tel-Aviv',
            achievements: [
              'Detected anomalies using time series algorithms and testing its robustness using Python and AWS environments',
              'Retrieved BI data warehouse using SQL, build the data history to map the behaviour of KPI\'s over time',
            ],
            tools: ['Python', 'SQL', 'AWS', 'PostgreSQL', 'Snowflake', 'Git']
          }
        ].map((exp, index) => (
          <div 
            key={exp.role + exp.company}
            className="relative p-6 rounded-lg bg-gray-700/30 hover:glow-on-hover hover-float"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="relative">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-xl font-semibold text-blue-400">{exp.role}</h3>
                  <p className="text-gray-300">{exp.company} • {exp.location}</p>
                </div>
                <span className="text-sm text-gray-400">{exp.period}</span>
              </div>
              
              <ul className="space-y-2">
                {exp.achievements.map((achievement) => (
                  <li 
                    key={achievement}
                    className="flex items-center text-gray-300"
                  >
                    <span className="mr-2 text-green-400">▹</span>
                    {achievement}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Tools & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {exp.tools.map((tool, index) => (
                    <span
                      key={tool}
                      className="px-3 py-1 rounded-full bg-gray-700/50 text-sm animate-pulse"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

