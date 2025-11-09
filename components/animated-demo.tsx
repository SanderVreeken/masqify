"use client"
import { useState, useEffect } from "react"
import { Shield, Sparkles, CheckCircle2 } from "lucide-react"

const steps = [
  {
    title: "1. Mark Sensitive Data",
    description: "Select and highlight confidential information in your text",
    icon: Shield,
    content: "Please send the invoice for $15,000 to John Smith at john@email.com by Friday.",
    highlights: [
      { text: "$15,000", start: 28, end: 35 },
      { text: "John Smith", start: 39, end: 49 },
      { text: "john@email.com", start: 53, end: 67 },
    ],
    status: "success"
  },
  {
    title: "2. AI Rewrites Safely",
    description: "Sensitive data is replaced with placeholders before AI processing",
    icon: Sparkles,
    content: "Please send the invoice for [REDACTED-1] to [REDACTED-2] at [REDACTED-3] by Friday.",
    highlights: [],
    status: "processing"
  },
  {
    title: "3. Data Restored",
    description: "Your original sensitive information is automatically reinserted",
    icon: CheckCircle2,
    content: "Could you please forward the invoice for $15,000 to John Smith at john@email.com by end of week?",
    highlights: [],
    status: "success"
  },
]

export function AnimatedDemo() {
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  // Auto-play animation on mount
  useEffect(() => {
    if (activeStep >= steps.length - 1) {
      // Animation complete, wait a bit then reset borders
      const completeTimer = setTimeout(() => {
        setIsAnimationComplete(true)
      }, 1500)
      return () => clearTimeout(completeTimer)
    }

    const timer = setTimeout(() => {
      setActiveStep(activeStep + 1)
    }, 1500)

    return () => clearTimeout(timer)
  }, [activeStep])

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isActive = i === activeStep && !isAnimationComplete
        const isPast = i < activeStep || isAnimationComplete
        const isFuture = i > activeStep && !isAnimationComplete

        return (
          <div
            key={i}
            className={`flex flex-col space-y-3 sm:space-y-4 transition-all duration-500 ${
              isFuture ? 'opacity-30' : 'opacity-100'
            }`}
          >
            {/* Step Header */}
            <div className="space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-3 md:min-h-[40px]">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg flex-shrink-0 transition-all duration-500 ${
                  step.status === "processing" && isActive
                    ? "bg-foreground animate-pulse"
                    : "bg-foreground"
                }`}>
                  <Icon className={`h-5 w-5 text-background ${
                    step.status === "processing" && isActive ? "animate-spin" : ""
                  }`} />
                </div>
                <h3 className="font-semibold" style={{ fontSize: 'clamp(0.875rem, 1.5vw + 0.25rem, 1.125rem)' }}>
                  {step.title}
                </h3>
              </div>
              <p className={`text-muted-foreground leading-relaxed md:min-h-[3rem] lg:min-h-[3.5rem] transition-all ${
                isActive ? 'font-medium' : ''
              }`} style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                {step.description}
              </p>
            </div>

            {/* Text Display */}
            <div className={`border rounded-lg p-4 sm:p-6 flex items-center flex-1 transition-all duration-500 ${
              isActive && !isAnimationComplete
                ? "border-foreground/30 bg-background ring-2 ring-offset-2 ring-foreground/20"
                : "border-border bg-background"
            }`}>
              <div className="leading-relaxed w-full" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>
                {(isActive || isPast) ? (
                  <HighlightedText content={step.content} highlights={step.highlights} />
                ) : (
                  <span className="text-muted-foreground/50">Waiting...</span>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function HighlightedText({
  content,
  highlights,
}: { content: string; highlights: Array<{ text: string; start: number; end: number }> }) {
  if (highlights.length === 0) {
    return <span>{content}</span>
  }

  const parts: Array<{ text: string; highlighted: boolean }> = []
  let lastIndex = 0

  highlights.forEach((highlight) => {
    if (highlight.start > lastIndex) {
      parts.push({ text: content.slice(lastIndex, highlight.start), highlighted: false })
    }
    parts.push({ text: content.slice(highlight.start, highlight.end), highlighted: true })
    lastIndex = highlight.end
  })

  if (lastIndex < content.length) {
    parts.push({ text: content.slice(lastIndex), highlighted: false })
  }

  return (
    <>
      {parts.map((part, i) =>
        part.highlighted ? (
          <mark key={i} className="bg-yellow-200/80 dark:bg-yellow-500/30 text-foreground px-1 rounded">
            {part.text}
          </mark>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
    </>
  )
}
