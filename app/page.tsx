import Profile from '../components/Profile'
import Education from '../components/Education'
import Experience from '../components/Experience'
import Projects from '../components/Projects'
import Articles from '../components/Articles'
import TableOfContents from '../components/TableOfContents'
import Tools from '../components/Tools'
import Introduction from '../components/Introduction'
import Hobbies from '../components/Hobbies'
import NewsButton from '../components/NewsButton'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <TableOfContents />
      <NewsButton />

      <section id="profile" className="portfolio-hero">
        <div className="section-shell animate-fade-in">
          <Profile />
        </div>
      </section>

      <section id="introduction" className="portfolio-section portfolio-band">
        <div className="section-shell">
          <Introduction />
        </div>
      </section>

      <section id="experience" className="portfolio-section">
        <div className="section-shell">
          <Experience />
        </div>
      </section>

      <section id="projects" className="portfolio-section portfolio-band">
        <div className="section-shell">
          <Projects />
        </div>
      </section>

      <section id="tools" className="portfolio-section">
        <div className="section-shell">
          <Tools />
        </div>
      </section>

      <section id="education" className="portfolio-section portfolio-band">
        <div className="section-shell">
          <Education />
        </div>
      </section>

      <section id="articles" className="portfolio-section">
        <div className="section-shell">
          <Articles />
        </div>
      </section>

      <section id="hobbies" className="portfolio-section portfolio-band">
        <div className="section-shell">
          <Hobbies />
        </div>
      </section>
    </main>
  )
}
