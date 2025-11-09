"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export function HomeCtaButtons() {
  const { data: session } = authClient.useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mt-10 sm:mt-12 flex items-center justify-center gap-3 sm:gap-4">
        <Link href="/register">
          <Button size="lg" className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/login">
          <Button size="lg" variant="outline">
            Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="mt-10 sm:mt-12 flex items-center justify-center gap-3 sm:gap-4">
      {session?.user ? (
        <Link href="/editor">
          <Button size="lg" className="gap-2">
            Launch Editor
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      ) : (
        <>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              Sign In
            </Button>
          </Link>
        </>
      )}
    </div>
  )
}

export function HomeFooterCta() {
  const { data: session } = authClient.useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-16">
        <div className="border border-border rounded-2xl p-6 sm:p-10 text-center bg-muted/30">
          <h2 className="font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>Ready to tell your story?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8" style={{ fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1.125rem)' }}>
            Start using Masqify today. Pay only for what you use.
          </p>
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-16">
      <div className="border border-border rounded-2xl p-6 sm:p-10 text-center bg-muted/30">
        <h2 className="font-bold tracking-tight mb-4" style={{ fontSize: 'clamp(1.25rem, 2.5vw + 0.5rem, 2.25rem)' }}>Ready to tell your story?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6 sm:mb-8" style={{ fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1.125rem)' }}>
          {session?.user
            ? "Start using Masqify now with your account."
            : "Start using Masqify today. Pay only for what you use."}
        </p>
        {session?.user ? (
          <Link href="/editor">
            <Button size="lg" className="gap-2">
              Launch Editor
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Create Account
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
