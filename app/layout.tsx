import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Soichiro Yoshimura',
    template: '%s | Soichiro Yoshimura'
  },
  description: 'Product Manager, Photographer, DJ, Father or SOMETHING.',
  keywords: ['Product Manager', 'AI', 'UX Design', 'MVP Development', 'Tokyo', 'Photography', 'DJ'],
  authors: [{ name: 'Soichiro Yoshimura' }],
  creator: 'Soichiro Yoshimura',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://soichiyo.dev',
    siteName: 'Soichiro Yoshimura',
    title: 'Soichiro Yoshimura',
    description: 'Product Manager, Photographer, DJ, Father or SOMETHING.',
    images: [
      {
        url: '/assets/profile-avatar.png',
        width: 1200,
        height: 630,
        alt: 'Soichiro Yoshimura',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@soichiyo',
    creator: '@soichiyo',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}