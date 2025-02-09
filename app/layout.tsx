import '../styles/globals.css'
import { Inter } from 'next/font/google'
import { ChatbotProvider } from '../lib/context/ChatbotContext'
import ChatbotDialogWrapper from '../components/ChatbotDialogWrapper'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'Avner Adda - Data Scientist',
  description: 'Personal profile of Avner Adda, Data Scientist based in Tel Aviv',
  openGraph: {
    title: 'Avner Adda - Data Scientist',
    description: 'Personal profile of Avner Adda, Data Scientist based in Tel Aviv',
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
      <body className={`${inter.className} min-h-screen bg-gray-900 text-white flex flex-col`}>
        <ChatbotProvider>
          <div className="neural-bg" />
          <div className="relative z-0 flex-grow">
            {children}
          </div>
          <ChatbotDialogWrapper />
          <footer className="relative z-10 p-2 text-center text-xs text-gray-400 bg-gradient-to-t from-gray-900 to-transparent backdrop-blur-sm">
            Created by <a href="https://www.ai-tasks.fr/" className="text-blue-400 hover:underline">AI Tasks</a> using{' '}
            <span className="text-blue-400">Firebase</span> and{' '}
            <span className="text-blue-400">NextJS</span>
          </footer>
        </ChatbotProvider>
      </body>
    </html>
  )
}

