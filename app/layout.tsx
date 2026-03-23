// app/layout.tsx
import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, Syne } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['300', '500', '700', '900'],
  variable: '--font-barlow',
})

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-syne',
})

export const metadata: Metadata = {
  title: 'APEX — V-Taper Program',
  description: 'Programme musculation V-Taper personnalisé · 2m04 · Avancé',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'APEX',
  },
}

export const viewport: Viewport = {
  themeColor: '#0c0e13',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${barlow.variable} ${syne.variable}`}>
      <body className="bg-bg text-white font-syne antialiased">
        {children}
      </body>
    </html>
  )
}
