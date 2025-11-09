"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, History } from "lucide-react"
import { AddFundsDialog } from "@/components/add-funds-dialog"
import { TransactionHistory } from "@/components/transaction-history"
import { getBalance } from "@/app/actions/balance"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function BalanceDisplay() {
  const [balance, setBalance] = useState<number>(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch balance from database
  const fetchBalance = async () => {
    setIsLoading(true)
    const result = await getBalance()
    if (result.success && result.balance !== undefined) {
      setBalance(result.balance)
    }
    setIsLoading(false)
    setIsLoaded(true)
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  const handleFundsAdded = () => {
    // Refresh balance after funds are added
    fetchBalance()
  }

  const isLowBalance = balance < 2

  // Format balance: always round to 2 decimals
  const formatBalance = (bal: number) => {
    return `€${bal.toFixed(2)}`
  }

  if (!isLoaded || isLoading) {
    // Prevent hydration mismatch and show loading state
    return (
      <Button variant="outline" size="sm" disabled className="gap-2">
        <Wallet className="h-4 w-4" />
        <span className="font-mono">€--</span>
      </Button>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
                className={`gap-2 ${isLowBalance ? "border-orange-500/50 bg-orange-50 dark:bg-orange-950/20" : ""}`}
              >
                <Wallet className={`h-4 w-4 ${isLowBalance ? "text-orange-600 dark:text-orange-400" : ""}`} />
                <span className={`font-mono ${isLowBalance ? "text-orange-600 dark:text-orange-400" : ""}`}>
                  {formatBalance(balance)}
                </span>
                <Plus className="h-3 w-3 opacity-50" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to add funds</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setHistoryOpen(true)}
                className="gap-2"
              >
                <History className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View transaction history</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <AddFundsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onFundsAdded={handleFundsAdded}
      />

      <TransactionHistory
        open={historyOpen}
        onOpenChange={setHistoryOpen}
      />
    </>
  )
}
