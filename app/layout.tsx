import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

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
      },
    ],
    locale: 'en_US',
    type: 'website',
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
      <body className={`${inter.className} antialiased`}>
        <div className="fixed inset-0 -z-10 neural-bg opacity-50" />
        {children}
      </body>
    </html>
  )
}

