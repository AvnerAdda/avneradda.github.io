import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { ChatbotProvider } from '../lib/context/ChatbotContext'
import ClientChrome from '../components/ClientChrome'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Avner Adda | Data Scientist & AI Engineer',
  description: 'Portfolio of Avner Adda, a Tel Aviv based Data Scientist building applied AI, GenAI, and analytics products.',
  openGraph: {
    title: 'Avner Adda | Data Scientist & AI Engineer',
    description: 'Applied AI, GenAI, data science, and product engineering portfolio.',
    url: 'https://avneradda.github.io',
    siteName: 'Avner Adda Portfolio',
    images: [
      {
        url: 'https://avneradda.github.io/og-image.jpg',
        width: 1200,
        height: 627,
        alt: 'Avner Adda Portfolio',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <ChatbotProvider>
          <div className="relative z-0 flex-grow">
            {children}
          </div>
          <ClientChrome />
          <footer className="relative z-10 border-t border-white/10 bg-black/20 px-4 py-5 text-center text-xs text-stone-400 backdrop-blur-sm">
            (c) 2026 Avner Adda. Built with Next.js and Firebase.
          </footer>
        </ChatbotProvider>
      </body>
    </html>
  )
}
