"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { TextInput } from "./text-input"
import { SensitiveDataList } from "./sensitive-data-list"
import { TextPreview } from "./text-preview"
import { RewriteResult } from "./rewrite-result"
import { CostEstimate } from "./cost-estimate"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Loader2, Shield, Sparkles, CheckCircle2, X } from "lucide-react"

const INSTRUCTIONS_COOKIE_NAME = "instructions-visible"
const INSTRUCTIONS_EXPIRY_DAYS = 365

// Helper function to get cookie value
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null
  return null
}

export type SensitiveItem = {
  id: string
  text: string
  placeholder: string
  startIndex: number
  endIndex: number
}

type Step = "input" | "preview" | "rewriting" | "result"

export function TextRewriter() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("input")
  const [originalText, setOriginalText] = useState("")
  const [sensitiveItems, setSensitiveItems] = useState<SensitiveItem[]>([])
  const [sanitizedText, setSanitizedText] = useState("")
  const [rewrittenText, setRewrittenText] = useState("")
  const [finalText, setFinalText] = useState("")
  const [showHowItWorks, setShowHowItWorks] = useState(true)

  // Load instructions visibility preference from cookie on mount
  useEffect(() => {
    const savedPreference = getCookie(INSTRUCTIONS_COOKIE_NAME)
    if (savedPreference !== null) {
      setShowHowItWorks(savedPreference === "true")
    }
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Cmd (Mac) or Ctrl (Windows/Linux)
      const isCmdOrCtrl = e.metaKey || e.ctrlKey

      // Cmd/Ctrl + Enter: Move forward
      if (isCmdOrCtrl && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (step === "preview") {
          handleRewrite()
        }
      }

      // Cmd/Ctrl + Shift + Backspace: Start over (only on result step)
      if (isCmdOrCtrl && e.shiftKey && e.key === "Backspace") {
        e.preventDefault()
        if (step === "result") {
          handleReset()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [step])

  const handleTextSubmit = (text: string, items: SensitiveItem[]) => {
    setOriginalText(text)
    setSensitiveItems(items)

    // Create sanitized text with placeholders
    let sanitized = text
    const sortedItems = [...items].sort((a, b) => b.startIndex - a.startIndex)

    for (const item of sortedItems) {
      sanitized = sanitized.slice(0, item.startIndex) + item.placeholder + sanitized.slice(item.endIndex)
    }

    setSanitizedText(sanitized)
    setStep("preview")
  }

  const handleRewrite = async () => {
    setStep("rewriting")

    try {
      const response = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sanitizedText }),
      })

      const data = await response.json()

      // Check for authentication error
      if (response.status === 401) {
        setStep("preview")
        toast.error("Authentication Required", {
          description: data.message || "Please sign in or create an account to use the AI rewriter.",
          action: {
            label: "Sign In",
            onClick: () => router.push("/login"),
          },
        })
        return
      }

      // Check for insufficient balance error
      if (response.status === 402) {
        setStep("preview")
        toast.error("Insufficient Balance", {
          description: data.message || "Please add funds to your account to continue.",
          action: {
            label: "Add Funds",
            onClick: () => {
              // The BalanceDisplay component handles opening the dialog
              // User can click on their balance to add funds
            },
          },
        })
        return
      }

      // Check for other errors
      if (!response.ok) {
        throw new Error(data.error || "Failed to rewrite text")
      }

      setRewrittenText(data.text)

      // Restore sensitive data - use replaceAll to handle all occurrences
      let final = data.text
      for (const item of sensitiveItems) {
        final = final.replaceAll(item.placeholder, item.text)
      }

      setFinalText(final)
      setStep("result")
    } catch (error) {
      // Log error type only to avoid leaking user text to error monitoring
      console.error("Error rewriting text:", error instanceof Error ? error.constructor.name : "Unknown error")
      setStep("preview")
      toast.error("Rewrite Failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      })
    }
  }

  const handleReset = () => {
    setStep("input")
    setOriginalText("")
    setSensitiveItems([])
    setSanitizedText("")
    setRewrittenText("")
    setFinalText("")
  }

  const handleCloseInstructions = () => {
    setShowHowItWorks(false)
    // Save preference to cookie
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + INSTRUCTIONS_EXPIRY_DAYS)
    document.cookie = `${INSTRUCTIONS_COOKIE_NAME}=false; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <StepIndicator
          number={1}
          label="Mark Data"
          active={step === "input"}
          completed={step !== "input"}
          icon={Shield}
        />
        <div className="h-px flex-1 bg-border mx-3 sm:mx-4" />
        <StepIndicator
          number={2}
          label="Preview"
          active={step === "preview"}
          completed={step === "rewriting" || step === "result"}
          icon={CheckCircle2}
        />
        <div className="h-px flex-1 bg-border mx-3 sm:mx-4" />
        <StepIndicator
          number={3}
          label="Rewrite"
          active={step === "rewriting" || step === "result"}
          completed={step === "result"}
          icon={Sparkles}
        />
      </div>

      {/* Step Content */}
      {step === "input" && (
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <div className={`${showHowItWorks ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <TextInput onSubmit={handleTextSubmit} />
          </div>
          <div className="lg:col-span-1" style={{ opacity: showHowItWorks ? 1 : 0, pointerEvents: showHowItWorks ? 'auto' : 'none' }}>
            <Card className="p-4 sm:p-5 border-border relative">
              <button
                onClick={handleCloseInstructions}
                className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Close how it works"
              >
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
              <h3 className="font-semibold mb-3 sm:mb-4 pr-8" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>How it works</h3>
              <ol className="space-y-3 sm:space-y-4 text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground shrink-0">01</span>
                  <span>Enter your text in the editor</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground shrink-0">02</span>
                  <span>Highlight sensitive information with your mouse</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground shrink-0">03</span>
                  <span>Review sanitized version with placeholders</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground shrink-0">04</span>
                  <span>AI rewrites without seeing sensitive data</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-mono text-foreground shrink-0">05</span>
                  <span>Get improved text with data restored</span>
                </li>
              </ol>
            </Card>
          </div>
        </div>
      )}

      {step === "preview" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="grid gap-4 sm:gap-5 lg:grid-cols-2">
            <TextPreview title="Original Text" text={originalText} sensitiveItems={sensitiveItems} />
            <TextPreview title="Sanitized Text" text={sanitizedText} isSanitized />
          </div>

          <SensitiveDataList items={sensitiveItems} />

          <CostEstimate text={sanitizedText} />

          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={handleReset}>
              Start Over
            </Button>
            <Button onClick={handleRewrite} size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Rewrite with AI
              <kbd className="hidden sm:inline-flex ml-2 px-2 py-1 text-xs font-semibold bg-background/50 border border-border rounded">
                ⌘↵
              </kbd>
            </Button>
          </div>
        </div>
      )}

      {step === "rewriting" && (
        <Card className="p-8 sm:p-12 border-border">
          <div className="flex flex-col items-center justify-center space-y-4 sm:space-y-6">
            <Loader2 className="h-10 w-10 animate-spin text-foreground" />
            <div className="text-center space-y-2">
              <h3 className="font-semibold" style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>Rewriting your text...</h3>
              <p className="text-muted-foreground max-w-md" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                Your sensitive data is protected. Only the sanitized version is being processed.
              </p>
            </div>
          </div>
        </Card>
      )}

      {step === "result" && (
        <RewriteResult
          originalText={originalText}
          sanitizedText={sanitizedText}
          rewrittenText={rewrittenText}
          finalText={finalText}
          sensitiveItems={sensitiveItems}
          onReset={handleReset}
        />
      )}
    </div>
  )
}

function StepIndicator({
  number,
  label,
  active,
  completed,
  icon: Icon,
}: {
  number: number
  label: string
  active: boolean
  completed: boolean
  icon: any
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
          completed
            ? "border-foreground bg-foreground text-background"
            : active
              ? "border-foreground bg-background text-foreground"
              : "border-border bg-background text-muted-foreground"
        }`}
      >
        {completed ? <Icon className="h-4 w-4" /> : <span className="text-sm font-medium">{number}</span>}
      </div>
      <span
        className={`font-medium hidden sm:inline ${active || completed ? "text-foreground" : "text-muted-foreground"}`}
        style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}
      >
        {label}
      </span>
    </div>
  )
}
