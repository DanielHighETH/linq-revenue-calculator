import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import localFont from '@next/font/local'
import Navbar from './components/navbar'
import Footer from './components/footer'


const inter = Inter({ subsets: ['latin'] })

const momcake = localFont({
  src: [
    {
      path: '../../public/fonts/MOMCAKE-Thin.otf',
      weight: '400'
    },
    {
      path: '../../public/fonts/MOMCAKE-Bold.otf',
      weight: '700'
    }
  ],
  variable: '--font-momcake'
})

const headerFont = localFont({
  src: [
    {
      path: '../../public/fonts/font.woff2',
      weight: '400'
    },
    {
      path: '../../public/fonts/font2.woff2',
      weight: '700'
    }
  ],
  variable: '--font-header'
})


export const metadata: Metadata = {
  title: 'LINQ Revenue Calculator',
  description: 'Calculate your estimated revenue from LINQ PROTOCOL at one place',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="mx-auto flex h-full min-h-screen max-w-6xl flex-col px-4 py-8 bg-black text-zinc-200 md:px-8">
      <Navbar /> 
        {children}
      <Footer />
        </body>
    </html>
  )
}
