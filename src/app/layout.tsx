import type { Metadata } from 'next'
import { Inter, Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Preloader from '@/components/common/Preloader'
import ScrollToTop from '@/components/common/ScrollToTop'
import MagicCursor from '@/components/common/MagicCursor'
import { AuthProvider } from '@/lib/auth/useAuth'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Noir - Modern Portfolio Template',
  description: 'Modern portfolio template built with Next.js and TypeScript',
  keywords: 'portfolio, design, nextjs, typescript, modern',
  authors: [{ name: 'Noir Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="bg-background text-text font-inter overflow-x-hidden">
        <AuthProvider>
          <Preloader />
          <MagicCursor />
          <Header />
          <main className="relative">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid #333',
              },
              success: {
                iconTheme: {
                  primary: '#ee4818',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
