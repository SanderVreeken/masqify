import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { CookieConsent } from "@/components/cookie-consent"
import { ThemeProvider } from "@/components/theme-provider"
import { AlphaBanner } from "@/components/alpha-banner"
import { ImpersonationBanner } from "@/components/impersonation-banner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://masqify.io'),
  title: {
    default: "Masqify - Your Story, Securely Told",
    template: "%s | Masqify"
  },
  description: "Transform and perfect your narrative with AI while masking sensitive information. Your story stays private, your data stays yours. The privacy-first storytelling companion.",
  icons: {
    icon: [
      { url: '/masqify-logo.svg', type: 'image/svg+xml' }
    ],
    apple: '/masqify-logo.svg',
  },
  keywords: [
    "AI text rewriter",
    "privacy-first AI",
    "secure text rewriting",
    "confidential document editing",
    "AI writing assistant",
    "data privacy",
    "OpenAI alternative",
    "secure AI",
    "text improvement",
    "professional writing",
    "sensitive data protection",
    "client-side encryption",
    "zero-knowledge AI"
  ],
  authors: [{ name: "Sander Vreeken" }],
  creator: "Sander Vreeken",
  publisher: "Masqify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Masqify",
    title: "Masqify - Your Story, Securely Told",
    description: "Transform and perfect your narrative with AI while masking sensitive information. Your story stays private, your data stays yours.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Masqify - Your Story, Securely Told"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Masqify - Your Story, Securely Told",
    description: "Transform and perfect your narrative with AI while masking sensitive information. Your story stays private, your data stays yours.",
    images: ["/og-image.png"],
    creator: "@sandervreeken"
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
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-site-verification',
    // yandex: 'your-yandex-verification',
    // bing: 'your-bing-verification',
  },
  alternates: {
    canonical: '/',
  },
  category: 'technology',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased`}
        style={{
          "--alpha-banner-height": "2.5rem"
        } as React.CSSProperties}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ImpersonationBanner />
          <AlphaBanner />
          {children}
          <Toaster />
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  )
}
