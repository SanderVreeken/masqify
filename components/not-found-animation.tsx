"use client"

import { useState, useEffect } from "react"
import { Shield, Sparkles, XCircle } from "lucide-react"

interface NotFoundAnimationProps {
  attemptedPath: string
}

export function NotFoundAnimation({ attemptedPath }: NotFoundAnimationProps) {
  const step1Content = `Please route me to ${attemptedPath} with my API key abc123xyz.`
  const step1RouteStart = step1Content.indexOf(attemptedPath)
  const step1RouteEnd = step1RouteStart + attemptedPath.length
  const step1KeyStart = step1Content.indexOf("abc123xyz")
  const step1KeyEnd = step1KeyStart + "abc123xyz".length

  const steps = [
    {
      title: "1. Mark Sensitive Data",
      description: "Select and highlight confidential information",
      icon: Shield,
      content: step1Content,
      highlights: [
        { text: attemptedPath, start: step1RouteStart, end: step1RouteEnd },
        { text: "abc123xyz", start: step1KeyStart, end: step1KeyEnd },
      ],
      status: "success"
    },
    {
      title: "2. AI Processing",
      description: "Attempting to process your request...",
      icon: Sparkles,
      content: "Please route me to [REDACTED-1] with my API key [REDACTED-2].",
      highlights: [],
      status: "processing"
    },
    {
      title: "3. Route Not Found",
      description: "This page doesn't exist in our system",
      icon: XCircle,
      content: `Error 404: The requested page "${attemptedPath}" could not be found.`,
      highlights: [],
      status: "error"
    },
  ]
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    if (!isAnimating) return

    const timer = setTimeout(() => {
      if (activeStep < steps.length - 1) {
        setActiveStep(activeStep + 1)
      } else {
        setIsAnimating(false)
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [activeStep, isAnimating])

  return (
    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
      {steps.map((step, i) => {
        const Icon = step.icon
        const isActive = i === activeStep
        const isPast = i < activeStep
        const isFuture = i > activeStep

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
                  step.status === "error" && (isActive || isPast)
                    ? "bg-red-500"
                    : step.status === "processing" && isActive
                    ? "bg-yellow-500 animate-pulse"
                    : "bg-foreground"
                }`}>
                  <Icon className={`h-5 w-5 ${
                    step.status === "error" && (isActive || isPast)
                      ? "text-white"
                      : "text-background"
                  } ${
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
              step.status === "error" && (isActive || isPast)
                ? "border-red-500/50 bg-red-500/5"
                : step.status === "processing" && isActive
                ? "border-yellow-500/50 bg-yellow-500/5"
                : "border-border bg-background"
            } ${
              isActive ? 'ring-2 ring-offset-2' : ''
            } ${
              step.status === "error" && (isActive || isPast)
                ? "ring-red-500/20"
                : step.status === "processing" && isActive
                ? "ring-yellow-500/20"
                : "ring-foreground/20"
            }`}>
              <div className="leading-relaxed w-full" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>
                {(isActive || isPast) ? (
                  <HighlightedText
                    content={step.content}
                    highlights={step.highlights}
                    status={step.status}
                  />
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
  status
}: {
  content: string
  highlights: Array<{ text: string; start: number; end: number }>
  status: string
}) {
  if (highlights.length === 0) {
    return (
      <span className={status === "error" ? "text-red-600 dark:text-red-400 font-mono" : ""}>
        {content}
      </span>
    )
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
