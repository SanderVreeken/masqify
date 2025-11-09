"use client"

import { useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

/**
 * Component that displays toast messages based on URL search parameters
 * Used to show authentication feedback after redirects
 */
export function AuthToast() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const hasShownToast = useRef(false)

  useEffect(() => {
    const message = searchParams.get("message")
    const type = searchParams.get("type") as "success" | "error" | null
    const payment = searchParams.get("payment")
    const amount = searchParams.get("amount")

    // Only show toast once per mount, even if effect runs multiple times
    if (!hasShownToast.current) {
      hasShownToast.current = true

      // Handle payment status toasts
      if (payment === "success" && amount) {
        toast.success(`Successfully added €${amount} to your account!`)
        // Clean up the URL by removing the query parameters
        const newUrl = window.location.pathname
        router.replace(newUrl, { scroll: false })
      } else if (payment === "cancelled") {
        toast.error("Payment was cancelled")
        // Clean up the URL by removing the query parameters
        const newUrl = window.location.pathname
        router.replace(newUrl, { scroll: false })
      } else if (message) {
        // Show the toast - default to error if no type specified
        if (type === "success") {
          toast.success(message)
        } else {
          toast.error(message)
        }
        // Clean up the URL by removing the query parameters
        const newUrl = window.location.pathname
        router.replace(newUrl, { scroll: false })
      } else {
        // Reset the flag if no toast conditions were met
        hasShownToast.current = false
      }
    }
  }, [searchParams, router])

  return null
}
