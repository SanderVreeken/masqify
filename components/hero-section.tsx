"use client"

import { useState } from "react"
import { Lock } from "lucide-react"
import { HeroTextAnimation } from "@/components/hero-text-animation"
import { HomeCtaButtons } from "@/components/home-cta-buttons"

export function HeroSection() {
  const [verb, setVerb] = useState("exposing")

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 sm:py-12 lg:py-16">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-xs sm:px-4 sm:py-1.5 sm:text-sm mb-4 sm:mb-6 lg:mb-8">
          <Lock className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
          <span className="font-mono text-[10px] sm:text-xs">Privacy-First AI Text Rewriting</span>
        </div>

        <h1 className="text-balance font-bold tracking-tight px-1" style={{ fontSize: 'clamp(0.5rem, 3.5vw + 0.3rem, 3.5rem)', lineHeight: '1.15' }}>
          Rewrite with AI.
          <br />
          <span className="text-muted-foreground whitespace-nowrap">
            Without {verb} <HeroTextAnimation onVerbChange={setVerb} />.
          </span>
        </h1>

        <p className="mt-4 sm:mt-5 lg:mt-6 text-pretty text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
          Mark sensitive information in your text, let AI improve the rest, then automatically restore your private
          data. Your confidential information never reaches the AI model.
        </p>

        <HomeCtaButtons />

        <p className="mt-4 sm:mt-5 text-xs sm:text-sm text-muted-foreground font-mono">
          Pay as you go • Privacy-first • Secure by design
        </p>
      </div>
    </div>
  )
}
