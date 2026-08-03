import fs from 'fs';
import path from 'path';
import Image from 'next/image';

const priorityTools = [
  'python.svg',
  'openai.svg',
  'langchain.svg',
  'spark.svg',
  'aws.svg',
  'gcp.svg',
  'docker.svg',
  'PostgresSQL.svg',
];

function formatToolName(file: string) {
  return file
    .replace('.svg', '')
    .replace(/-/g, ' ')
    .replace('gcp', 'Google Cloud')
    .replace('aws', 'AWS')
    .replace('html', 'HTML')
    .replace('openai', 'OpenAI');
}

export default async function Tools() {
  const toolsDirectory = path.join(process.cwd(), 'public/images/tools');
  const files = fs.readdirSync(toolsDirectory);
  const svgFiles = files
    .filter((file) => file.endsWith('.svg'))
    .sort((a, b) => {
      const aIndex = priorityTools.indexOf(a);
      const bIndex = priorityTools.indexOf(b);
      if (aIndex !== -1 || bIndex !== -1) {
        return (aIndex === -1 ? Number.POSITIVE_INFINITY : aIndex) - (bIndex === -1 ? Number.POSITIVE_INFINITY : bIndex);
      }
      return a.localeCompare(b);
    });

  return (
    <div>
      <p className="section-eyebrow">Tools</p>
      <h2 className="section-title">Technologies I use</h2>
      <p className="section-lede">
        A practical stack for data science, ML engineering, cloud deployment,
        analytics, and AI application development.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {svgFiles.map((file) => (
          <div key={file} className="surface-card flex min-h-32 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 p-2">
              <Image
                src={`/images/tools/${file}`}
                alt={formatToolName(file)}
                width={48}
                height={48}
                className="max-h-10 w-auto object-contain"
              />
            </div>
            <span className="mt-3 text-sm text-stone-200">{formatToolName(file)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
