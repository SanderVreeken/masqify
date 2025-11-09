"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Euro } from "lucide-react"
import { toast } from "sonner"

const PRESET_AMOUNTS = [5, 10, 20, 50]

interface AddFundsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onFundsAdded: () => void
}

export function AddFundsDialog({ open, onOpenChange, onFundsAdded }: AddFundsDialogProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setSelectedAmount(null)
  }

  const getFinalAmount = (): number | null => {
    if (selectedAmount !== null) return selectedAmount
    const parsed = parseFloat(customAmount)
    if (isNaN(parsed)) return null
    return parsed
  }

  const isValidAmount = (): boolean => {
    const amount = getFinalAmount()
    return amount !== null && amount >= 1 && amount <= 50
  }

  const handleAddFunds = async () => {
    if (!isValidAmount()) return

    const amount = getFinalAmount()!
    setIsProcessing(true)

    try {
      // Create Stripe checkout with custom amount using our API
      const response = await fetch("/api/auth/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount, // Amount in EUR
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to create checkout")
      }

      const data = await response.json()

      // Redirect to Stripe checkout page
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error("No checkout URL received")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create checkout. Please try again.")
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Add funds to your account
          </DialogTitle>
          <DialogDescription>
            Choose an amount between €1.00 and €50.00 to add to your account balance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset amounts */}
          <div className="space-y-3">
            <Label>Quick amounts</Label>
            <div className="grid grid-cols-4 gap-2">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  type="button"
                  variant={selectedAmount === amount ? "default" : "outline"}
                  className="h-16 flex flex-col items-center justify-center"
                  onClick={() => handleAmountSelect(amount)}
                >
                  <span className="text-xs text-muted-foreground">€</span>
                  <span className="text-lg font-semibold">{amount}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom amount */}
          <div className="space-y-3">
            <Label htmlFor="custom-amount">Custom amount</Label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="custom-amount"
                type="number"
                min="1"
                max="50"
                step="0.01"
                placeholder="Enter amount (1.00 - 50.00)"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum: €1.00 • Maximum: €50.00
            </p>
          </div>

          {/* Total display */}
          {isValidAmount() && (
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Amount to add</span>
                <span className="text-2xl font-bold">€{getFinalAmount()!.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleAddFunds}
            disabled={!isValidAmount() || isProcessing}
          >
            {isProcessing ? "Processing..." : "Add funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
