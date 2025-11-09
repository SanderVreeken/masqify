import Link from "next/link"
import type { Metadata } from "next"
import { Suspense } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Lock, Eye, ArrowRight, Check, Shield } from "lucide-react"
import { AnimatedDemo } from "@/components/animated-demo"
import { HomeNav } from "@/components/home-nav"
import { HomeCtaButtons, HomeFooterCta } from "@/components/home-cta-buttons"
import { AuthToast } from "@/components/auth-toast"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { HeroSection } from "@/components/hero-section"
import { AnimatedUseCases } from "@/components/animated-use-cases"
import { StatusIndicator } from "@/components/status-indicator"
import { OrganizationStructuredData, SoftwareApplicationStructuredData, WebSiteStructuredData, FAQStructuredData } from "@/components/structured-data"

export const metadata: Metadata = {
  title: "Privacy-First AI Text Rewriter",
  description: "Improve your writing with AI while keeping sensitive data secure. Client-side data protection ensures your confidential information never leaves your browser. Perfect for professionals handling sensitive documents.",
  openGraph: {
    title: "Masqify - Your Story, Securely Told",
    description: "Transform and perfect your narrative with AI while masking sensitive information. Your story stays private, your data stays yours.",
    type: "website",
  },
  alternates: {
    canonical: '/',
  },
}

export default function Home() {
  return (
    <>
      <OrganizationStructuredData />
      <SoftwareApplicationStructuredData />
      <WebSiteStructuredData />
      <FAQStructuredData />
      <SidebarProvider defaultOpen={false}>
        <SidebarInset>
          <Suspense fallback={null}>
            <AuthToast />
          </Suspense>
          {/* Header */}
          <HomeNav />

      {/* Hero Section */}
      <HeroSection />

      {/* Animated Demo Section */}
      <div className="border-y border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-16">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>How it works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1.125rem)' }}>
              A simple three-step process that keeps your sensitive data completely private
            </p>
          </div>

          <AnimatedDemo />
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-16">
        <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
          <div className="border border-border rounded-lg p-4 sm:p-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-foreground mb-3 sm:mb-4">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-background" />
            </div>
            <h3 className="font-semibold mb-2 sm:mb-3" style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>Privacy First</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>
              Your sensitive data is automatically removed before AI processing and restored afterwards. No confidential
              information ever leaves your control.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 sm:p-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-foreground mb-3 sm:mb-4">
              <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-background" />
            </div>
            <h3 className="font-semibold mb-2 sm:mb-3" style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>Full Transparency</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>
              See exactly what data is being redacted and what the AI receives. Complete visibility into every step of
              the process.
            </p>
          </div>

          <div className="border border-border rounded-lg p-4 sm:p-6">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-foreground mb-3 sm:mb-4">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-background" />
            </div>
            <h3 className="font-semibold mb-2 sm:mb-3" style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>Zero Trust</h3>
            <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>
              Built on the principle that AI models should never see your private information. Secure by design, not by
              promise.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <div className="border-t border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-16">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>Perfect for sensitive communications</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto" style={{ fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1.125rem)' }}>
              See how professionals use AI to improve their writing while keeping confidential information secure
            </p>
          </div>

          <AnimatedUseCases />
        </div>
      </div>

      {/* CTA Section */}
      <HomeFooterCta />

      {/* Footer */}
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-3 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center">
                <Image
                  src="/masqify-logo.svg"
                  alt="Masqify"
                  width={32}
                  height={32}
                />
              </div>
              <span className="font-semibold" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Masqify</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <Suspense fallback={<div className="text-sm text-muted-foreground">Loading status...</div>}>
                <StatusIndicator />
              </Suspense>
              <p className="text-muted-foreground font-mono" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Built with privacy in mind</p>
            </div>
          </div>
        </div>
      </div>
      </SidebarInset>
      <AppSidebar side="right" variant="inset" />
    </SidebarProvider>
    </>
  )
}
