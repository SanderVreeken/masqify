"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2, Coins, Zap } from "lucide-react"
import { estimateCost } from "@/app/actions/balance"

interface CostEstimateProps {
  text: string
}

export function CostEstimate({ text }: CostEstimateProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0)
  const [estimatedCost, setEstimatedCost] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEstimate = async () => {
      setIsLoading(true)
      setError(null)

      const result = await estimateCost(text)

      if (result.success) {
        setEstimatedTokens(result.estimatedTokens || 0)
        setEstimatedCost(result.estimatedCost || 0)
      } else {
        setError(result.error || "Failed to estimate cost")
      }

      setIsLoading(false)
    }

    fetchEstimate()
  }, [text])

  if (isLoading) {
    return (
      <Card className="p-3 sm:p-4 border-border bg-muted/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Calculating cost...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-3 sm:p-4 border-border bg-muted/30">
        <div className="flex items-center gap-2 sm:gap-3">
          <Coins className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Unable to estimate cost</span>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-3 sm:p-4 border-border bg-muted/30">
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2">
          <Coins className="h-4 w-4 text-foreground" />
          <span className="font-medium" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Estimated Cost</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              <span style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>Tokens</span>
            </div>
            <p className="font-mono font-semibold" style={{ fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1.125rem)' }}>
              {estimatedTokens.toLocaleString()}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
              <Coins className="h-3 w-3" />
              <span style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>Cost</span>
            </div>
            <p className="font-mono font-semibold" style={{ fontSize: 'clamp(0.875rem, 1.25vw + 0.25rem, 1.125rem)' }}>
              €{estimatedCost < 0.01 ? "<0.01" : estimatedCost.toFixed(2)}
            </p>
          </div>
        </div>

        <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
          This is an estimate. Actual cost may vary slightly based on the rewritten text length.
        </p>
      </div>
    </Card>
  )
}
