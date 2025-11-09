"use client"

import { AlertTriangle } from "lucide-react"

export function AlphaBanner() {
  return (
    <div className="bg-blue-500 dark:bg-blue-600 text-white py-2 px-4">
      <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span className="text-center">
          This product is currently in Beta. We're actively improving it based on your feedback.
        </span>
      </div>
    </div>
  )
}