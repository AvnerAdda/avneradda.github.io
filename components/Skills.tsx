export default function Skills() {
  return (
    <section className="mb-12 bg-white shadow rounded-lg p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Programming Languages</h3>
          <div className="flex flex-wrap gap-2">
            {['Python', 'R', 'SQL', 'VBA', 'SAS'].map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold mb-2">Technologies & Tools</h3>
          <div className="flex flex-wrap gap-2">
            {[
              'MySQL', 'Git', 'R Shiny', 'Linux', 'Dataiku', 'Docker', 
              'Spark', 'AWS', 'GCP', 'Tableau', 'Snowflake', 'MongoDB',
              'PyCharm', 'Jupyter', 'VS Code', 'Microsoft Office', 'Bloomberg'
            ].map((tech) => (
              <span key={tech} className="bg-green-100 text-green-800 px-2 py-1 rounded">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
} 