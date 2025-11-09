"use client"

import { AlertTriangle } from "lucide-react"

export function AlphaBanner() {
  return (
    <div className="bg-orange-500 dark:bg-orange-600 text-white py-2 px-4">
      <div className="mx-auto max-w-7xl flex items-center justify-center gap-2 text-sm">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span className="text-center">
          This product is currently in Alpha status. No rights can be derived from using this product.
        </span>
      </div>
    </div>
  )
}