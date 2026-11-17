import { aiProfile } from "@/content/ai-profile";
import type { Metadata } from 'next'
import './globals.css'
import { MotionProvider } from "../components/animations/MotionProvider"

export const metadata: Metadata = {
  metadataBase: new URL("https://www.soichiroyoshimura.com"),
  alternates: { canonical: "/" },
  title: {
    default: 'Soichiro Yoshimura',
    template: '%s | Soichiro Yoshimura'
  },
  description: aiProfile.description,
  keywords: ['Product Manager', 'AI', 'UX Design', 'MVP Development', 'Tokyo', 'Photography', 'DJ'],
  authors: [{ name: 'Soichiro Yoshimura' }],
  creator: 'Soichiro Yoshimura',
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://www.soichiroyoshimura.com',
    siteName: 'Soichiro Yoshimura',
    title: 'Soichiro Yoshimura',
    description: aiProfile.description,
    images: [
      {
        url: '/assets/profile-avatar.jpg',
        width: 1638,
        height: 1092,
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
    <html lang="ja" className="dark" suppressHydrationWarning>
      <body className="antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  )
}
