"use client"

import { useState, useEffect } from "react"
import { Scale, Stethoscope, Building2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const useCases = [
  {
    icon: Scale,
    title: "Legal Documents",
    role: "Attorney",
    scenario: "Preparing a motion to dismiss",
    exampleText: (
      <>
        In the matter of <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">Sarah Martinez</span> v. Acme Corporation, Case No.{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">CV-2024-08291</span>, the defendant seeks dismissal based on lack of jurisdiction. Opposing counsel{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">Thompson & Associates</span> has proposed a settlement of{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">$125,000</span>, which the plaintiff is considering. The motion argues that the court lacks personal jurisdiction over the defendant.
      </>
    ),
    description:
      "Mark client names, case numbers, and settlement figures. AI improves legal writing and formatting while all sensitive case information remains protected.",
  },
  {
    icon: Stethoscope,
    title: "Medical Records",
    role: "Physician",
    scenario: "Writing patient consultation notes",
    exampleText: (
      <>
        Patient <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">Michael Chen</span>, DOB{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">03/15/1978</span>, MRN{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">458921-7</span>, presented today for follow-up regarding{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">Type 2 Diabetes and Hypertension</span>. Currently on{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">Metformin 1000mg BID and Lisinopril 10mg daily</span>. Blood pressure readings have improved since last visit. Patient reports good medication compliance.
      </>
    ),
    description:
      "Mark patient names, medical record numbers, diagnoses, and prescriptions. AI helps structure clinical notes clearly while protecting all PHI.",
  },
  {
    icon: Building2,
    title: "Financial Reports",
    role: "Financial Analyst",
    scenario: "Quarterly earnings report summary",
    exampleText: (
      <>
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">TechVentures Inc.</span> (Account{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">****-8392</span>) reported strong Q4 performance with revenue of{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">$4.2M</span>, representing an 18% year-over-year increase. Key growth driver was the expanded partnership with{" "}
        <span className="bg-yellow-400/40 dark:bg-yellow-500/30 px-1 rounded">GlobalCorp (Acct #729384)</span>, which contributed significantly to the quarterly results. Operating margins improved by 3 percentage points.
      </>
    ),
    description:
      "Mark company names, account numbers, and confidential figures. AI refines financial narratives while keeping proprietary data secure.",
  },
]

export function AnimatedUseCases() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % useCases.length)
    }, 6000) // Change every 6 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % useCases.length)
  }

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + useCases.length) % useCases.length)
  }

  const currentCase = useCases[currentIndex]
  const Icon = currentCase.icon

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="border border-border rounded-lg p-4 sm:p-6 bg-background min-h-[320px] sm:min-h-[400px] flex flex-col">
        <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-foreground flex-shrink-0">
            <Icon className="h-6 w-6 text-background" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>{currentCase.title}</h3>
            <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              {currentCase.role} • {currentCase.scenario}
            </p>
          </div>
        </div>

        <div className="bg-muted/50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex-1 leading-relaxed" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
          <div className="animate-in fade-in duration-500">
            {currentCase.exampleText}
          </div>
        </div>

        <p className="text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>{currentCase.description}</p>

        <div className="flex items-center justify-between mt-4 pt-4 sm:mt-6 sm:pt-6 border-t">
          <div className="flex gap-2">
            {useCases.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? "w-8 bg-foreground" : "w-2 bg-muted-foreground/30"
                }`}
                aria-label={`Go to use case ${index + 1}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={goToPrevious} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={goToNext} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
