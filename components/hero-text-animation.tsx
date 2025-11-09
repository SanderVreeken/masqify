"use client"

import { useState, useEffect, useRef } from "react"

type AnimationPhase = "normal" | "marked" | "redacted" | "processing" | "restoring"

interface HeroTextAnimationProps {
  onVerbChange?: (verb: string) => void
}

export function HeroTextAnimation({ onVerbChange }: HeroTextAnimationProps) {
  const [text, setText] = useState("secrets")
  const [phase, setPhase] = useState<AnimationPhase>("normal")
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])
  const verbIndexRef = useRef(0)
  const verbs = ["exposing", "leaking", "compromising", "revealing"]

  useEffect(() => {
    const animate = () => {
      // Clear all existing timeouts
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []

      let delay = 0

      // Wait 1 second before starting
      delay += 1000

      // Phase 1: Mark "secrets" yellow
      timeoutsRef.current.push(
        setTimeout(() => {
          setText("secrets")
          setPhase("marked")
        }, delay)
      )

      // Wait 1 second with yellow marking
      delay += 1000

      // Phase 2: Replace with [REDACTED-1]
      timeoutsRef.current.push(
        setTimeout(() => {
          setText("[REDACTED-1]")
          setPhase("redacted")
        }, delay)
      )

      // Wait 0.5 seconds
      delay += 500

      // Phase 3: AI Processing animation
      timeoutsRef.current.push(
        setTimeout(() => {
          setPhase("processing")
        }, delay)
      )

      // Process for 2 seconds, then change the verb
      delay += 2000

      // Change verb during processing (before backspacing)
      timeoutsRef.current.push(
        setTimeout(() => {
          verbIndexRef.current = (verbIndexRef.current + 1) % verbs.length
          if (onVerbChange) {
            onVerbChange(verbs[verbIndexRef.current])
          }
        }, delay)
      )

      // Continue processing for another 0.5 seconds
      delay += 500

      // Phase 4: Start restoring - backspace [REDACTED-1]
      timeoutsRef.current.push(
        setTimeout(() => {
          setPhase("restoring")
        }, delay)
      )

      const redactedText = "[REDACTED-1]"
      for (let i = redactedText.length; i > 0; i--) {
        delay += 80
        const currentLength = i - 1
        timeoutsRef.current.push(
          setTimeout(() => setText(redactedText.substring(0, currentLength)), delay)
        )
      }

      // Phase 5: Type "secrets" back
      const secretsText = "secrets"
      for (let i = 1; i <= secretsText.length; i++) {
        delay += 80
        timeoutsRef.current.push(
          setTimeout(() => setText(secretsText.substring(0, i)), delay)
        )
      }

      // Back to normal
      timeoutsRef.current.push(
        setTimeout(() => {
          setPhase("normal")
        }, delay)
      )

      // Wait 5 seconds before restarting
      delay += 5000
      timeoutsRef.current.push(setTimeout(() => animate(), delay))
    }

    animate()

    return () => {
      timeoutsRef.current.forEach(clearTimeout)
    }
  }, [onVerbChange])

  return (
    <span className="relative inline-block align-baseline">
      <span
        className={`inline transition-all duration-300 relative ${
          phase === "marked"
            ? "bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded"
            : ""
        } ${
          phase === "processing"
            ? "overflow-hidden"
            : ""
        }`}
      >
        {text}
        {phase === "processing" && (
          <>
            <span className="absolute inset-0 -translate-x-full animate-[shimmer_1.25s_ease-in-out_2] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
            <style jsx>{`
              @keyframes shimmer {
                100% {
                  transform: translateX(200%);
                }
              }
            `}</style>
          </>
        )}

      </span>
      {phase === "restoring" && (
        <span className="text-muted-foreground animate-pulse">|</span>
      )}
    </span>
  )
}
