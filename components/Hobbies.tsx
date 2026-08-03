const languages = [
  {
    language: 'French',
    level: 'Native',
    description: 'Mother tongue',
  },
  {
    language: 'English',
    level: 'Native',
    description: 'Bilingual proficiency',
  },
  {
    language: 'Hebrew',
    level: 'Professional',
    description: 'Professional working proficiency',
  },
];

const interests = [
  'Technical writing',
  'Reading',
  'Volunteering',
  'Soccer',
  'Strategic gaming',
  'Surfing',
  'CrossFit',
];

export default function Hobbies() {
  return (
    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
      <div>
        <p className="section-eyebrow">Life</p>
        <h2 className="section-title">Languages and interests</h2>
        <p className="section-lede">
          A multilingual background and a mix of writing, community, sport, and
          continuous learning outside the core work.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {languages.map((lang) => (
            <article key={lang.language} className="surface-card">
              <h3 className="font-semibold text-white">{lang.language}</h3>
              <p className="mt-2 text-sm font-medium text-emerald-200">{lang.level}</p>
              <p className="mt-2 text-sm text-stone-400">{lang.description}</p>
            </article>
          ))}
        </div>

        <div className="surface-card">
          <h3 className="text-lg font-semibold text-white">Outside work</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {interests.map((interest) => (
              <span key={interest} className="chip">
                {interest}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
