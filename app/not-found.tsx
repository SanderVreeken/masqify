'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Shield, ArrowRight, Home } from "lucide-react"
import { NotFoundAnimation } from "@/components/not-found-animation"

export default function NotFound() {
  const pathname = usePathname() || '/unknown'
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center">
              <Image
                src="/masqify-logo.svg"
                alt="Masqify"
                width={40}
                height={40}
                priority
              />
            </div>
            <span className="text-lg font-semibold">Masqify</span>
          </Link>
        </div>

        {/* Main Content */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/5 px-4 py-1.5 text-sm mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="font-mono text-xs text-red-600 dark:text-red-400">Error 404</span>
          </div>

          <h1 className="text-balance font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(1.75rem, 3.5vw + 0.5rem, 3.5rem)', lineHeight: '1.15' }}>
            Page Not Found
          </h1>

          <p className="text-pretty text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
            The page <span className="font-mono text-foreground">{pathname}</span> doesn't exist. Even with our storytelling magic,
            we couldn't find this route. Let's get you back to crafting your narrative instead.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/editor" className="inline-flex items-center gap-2">
                Start Editing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </div>
        </div>

        {/* Animation Demo */}
        <div className="border border-border bg-muted/30 rounded-lg">
          <div className="px-4 py-8 sm:px-6 sm:py-12">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                What went wrong?
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
                Here's what happened when we tried to find your page
              </p>
            </div>

            <NotFoundAnimation attemptedPath={pathname} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please{" "}
            <Link href="/" className="text-foreground hover:underline font-medium">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
