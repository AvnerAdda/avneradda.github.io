export default function Projects() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold bg-clip-text text-transparent">
        Featured Projects
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          {
            title: 'AI Image Generator',
            description: 'Deep learning model for generating realistic images',
            tech: ['Python', 'GANs', 'PyTorch'],
            metrics: '98% accuracy'
          },
          {
            title: 'NLP Chatbot',
            description: 'Intelligent conversational AI system',
            tech: ['TensorFlow', 'BERT', 'Flask'],
            metrics: '90% user satisfaction'
          }
        ].map((project) => (
          <div 
            key={project.title}
            className="p-4 rounded-lg bg-gray-700/30 hover:glow-on-hover cursor-pointer hover-float"
          >
            <h3 className="text-xl font-semibold text-blue-400">{project.title}</h3>
            <p className="text-gray-300 mt-2">{project.description}</p>
            <div className="flex gap-2 mt-3">
              {project.tech.map((t) => (
                <span key={t} className="text-xs px-2 py-1 rounded-full bg-gray-600/50">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-3 text-sm text-green-400">
              {project.metrics}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

