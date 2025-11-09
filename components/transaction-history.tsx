"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowUpCircle, ArrowDownCircle, History, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Transaction {
  id: string
  type: "payment" | "rewrite"
  amount: string
  balanceAfter: string
  description: string
  relatedId: string | null
  metadata: any
  createdAt: string
  // Payment details
  paymentStatus?: string | null
  paymentProvider?: string | null
  // Rewrite details
  rewriteInputLength?: number | null
  rewriteOutputLength?: number | null
  rewriteTokensUsed?: number | null
  rewriteModel?: string | null
}

interface TransactionHistoryProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function TransactionHistory({ open, onOpenChange }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchTransactions()
    }
  }, [open])

  const fetchTransactions = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/transactions?limit=50")

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const data = await response.json()
      setTransactions(data.transactions || [])
    } catch (err) {
      console.error("Error fetching transactions:", err)
      setError(err instanceof Error ? err.message : "Failed to load transactions")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </DialogTitle>
          <DialogDescription>
            View your recent payments and AI rewrites
          </DialogDescription>
        </DialogHeader>

        <div className="h-[500px] overflow-y-auto pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No transactions yet</p>
              <p className="text-sm mt-2">Add funds or complete a rewrite to see your history</p>
            </div>
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => {
                const amount = parseFloat(tx.amount)
                const isPositive = amount > 0
                const date = new Date(tx.createdAt)
                const balanceAfter = parseFloat(tx.balanceAfter)

                // Format amount: 6 decimals for rewrites, 2 for payments
                const formatAmount = (val: number) => {
                  const absVal = Math.abs(val)
                  if (tx.type === "rewrite") {
                    return absVal.toFixed(6)
                  }
                  return absVal.toFixed(2)
                }

                const formatBalance = (val: number) => {
                  if (tx.type === "rewrite") {
                    return val.toFixed(6)
                  }
                  return val.toFixed(2)
                }

                return (
                  <div
                    key={tx.id}
                    className="flex items-start gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className={`mt-0.5 ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                      {isPositive ? (
                        <ArrowUpCircle className="h-5 w-5" />
                      ) : (
                        <ArrowDownCircle className="h-5 w-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="font-medium">
                            {tx.type === "payment" ? "Funds Added" : "AI Rewrite"}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {tx.description}
                          </p>

                          {/* Additional details for rewrites */}
                          {tx.type === "rewrite" && tx.rewriteTokensUsed && (
                            <div className="text-xs text-muted-foreground mt-2 space-y-0.5">
                              <p>Model: {tx.rewriteModel || "Unknown"}</p>
                              <p>Tokens: {tx.rewriteTokensUsed.toLocaleString()}</p>
                              {tx.rewriteInputLength && tx.rewriteOutputLength && (
                                <p>
                                  Length: {tx.rewriteInputLength} → {tx.rewriteOutputLength} chars
                                </p>
                              )}
                            </div>
                          )}

                          {/* Additional details for payments */}
                          {tx.type === "payment" && tx.paymentProvider && (
                            <div className="text-xs text-muted-foreground mt-2">
                              <p>Via {tx.paymentProvider.charAt(0).toUpperCase() + tx.paymentProvider.slice(1)}</p>
                              {tx.paymentStatus && (
                                <p className="capitalize">Status: {tx.paymentStatus}</p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className={`font-semibold font-mono ${isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                            {isPositive ? "+" : ""}€{formatAmount(amount)}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Balance: €{formatBalance(balanceAfter)}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-muted-foreground mt-2">
                        {formatDistanceToNow(date, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
