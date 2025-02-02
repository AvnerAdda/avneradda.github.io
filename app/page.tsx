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

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <AiDecorations />
      <TableOfContents />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
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
          <div id="hobbies" className="animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <AiCard>
              <Hobbies />
            </AiCard>
          </div>
          <div id="tools" className="animate-fade-in" style={{ animationDelay: '1s' }}>
            <AiCard>
              <Tools />
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