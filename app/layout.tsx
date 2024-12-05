import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Avner Adda - Data Scientist',
  description: 'Personal profile of Avner Adda, Data Scientist based in Tel Aviv',
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

