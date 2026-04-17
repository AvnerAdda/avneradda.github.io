import Profile from '../components/Profile'
import Education from '../components/Education'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Articles from '../components/Articles'
import AiDecorations from '../components/AiDecorations'
import AiCard from '../components/AiCard'
import TableOfContents from '../components/TableOfContents'
import Tools from '../components/Tools'
import Introduction from '../components/Introduction'
import Hobbies from '../components/Hobbies'
import NewsButton from '../components/NewsButton'

// async function getMediumArticles() {
//   try {
//     const mediumUsername = '@lilmod';
//     const response = await fetch(
//       `https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/${mediumUsername}`,
//       { next: { revalidate: 3600 } } // Revalidate every hour
//     );
//     const data = await response.json();
    
//     return data.items.map((item: any) => ({
//       title: item.title,
//       date: new Date(item.pubDate).toISOString(),
//       description: item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
//       link: item.link,
//       readTime: `${Math.ceil(item.content.split(' ').length / 200)} min read`,
//       tags: item.categories || []
//     }));
//   } catch (error) {
//     console.error('Failed to fetch Medium articles:', error);
//     return [];
//   }
// }

export default function Home() {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <AiDecorations />
      <TableOfContents />
      
      {/* GitHub Link - Top Left */}
      <div className="fixed top-4 left-4 z-50">
        <a 
          href="https://github.com/avneradda/avneradda.github.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-10 h-10 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full transition-all duration-300 hover:bg-gray-700/80 hover:border-gray-600 hover:scale-110"
          title="View on GitHub"
        >
          <svg 
            className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-300" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>
      </div>

      {/* WhatsApp Contact - Top Left (below GitHub) */}
      <div className="fixed top-16 left-4 z-50">
        <a 
          href="https://wa.me/972533999137?text=Hi%20Avner!%20I%20found%20your%20amazing%20portfolio%20and%20would%20love%20to%20connect%20with%20you%20😊" 
          target="_blank" 
          rel="noopener noreferrer"
          className="group flex items-center justify-center w-10 h-10 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-full transition-all duration-300 hover:bg-gray-700/80 hover:border-gray-600 hover:scale-110"
          title="Send me a message on WhatsApp"
        >
          <span className="text-lg group-hover:scale-110 transition-transform duration-300">😍</span>
        </a>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <NewsButton />

        <div className="space-y-16">
          <div id="profile" className="animate-fade-in" style={{ animationDelay: '0s' }}>
            <AiCard>
              <Profile />
            </AiCard>
          </div>
          <div id="introduction" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AiCard>
              <Introduction />
            </AiCard>
          </div>
          <div id="education" className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <AiCard>
              <Education />
            </AiCard>
          </div>
          <div id="experience" className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <AiCard>
              <Experience />
            </AiCard>
          </div>
          <div id="projects" className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <AiCard>
              <Projects />
            </AiCard>
          </div>
          <div id="tools" className="animate-fade-in" style={{ animationDelay: '1s' }}>
            <AiCard>
              <Tools />
            </AiCard>
          </div>
          <div id="hobbies" className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <AiCard>
              <Hobbies />
            </AiCard>
          </div>
          <div id="articles" className="animate-fade-in" style={{ animationDelay: '1.2s' }}>
            <AiCard>
              <Articles />
            </AiCard>
          </div>
        </div>
      </div>
    </main>
  )
}
