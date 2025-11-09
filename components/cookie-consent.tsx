"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Cookie, X } from "lucide-react"

const CONSENT_COOKIE_NAME = "cookie-consent"
const CONSENT_EXPIRY_DAYS = 365

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already acknowledged
    const consent = localStorage.getItem(CONSENT_COOKIE_NAME)
    if (!consent) {
      // Small delay to avoid flash on initial load
      setTimeout(() => setShowBanner(true), 1000)
    }
  }, [])

  const handleAccept = () => {
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + CONSENT_EXPIRY_DAYS)

    localStorage.setItem(CONSENT_COOKIE_NAME, "accepted")
    document.cookie = `${CONSENT_COOKIE_NAME}=accepted; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`

    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      <Card className="w-full max-w-2xl border-border shadow-lg animate-in slide-in-from-bottom duration-300 sm:slide-in-from-bottom-0">
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Cookie Notice</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={handleAccept}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed">
              We use essential cookies for authentication, security, and basic website functionality.
              These cookies are strictly necessary for the website to operate and cannot be disabled.
            </p>

            <div className="space-y-2 pt-2 border-t">
              <h3 className="text-sm font-semibold">Essential Cookies Include:</h3>
              <ul className="text-xs text-muted-foreground space-y-1 pl-4">
                <li>• Authentication session cookies</li>
                <li>• Cookie consent preferences</li>
                <li>• Security tokens (CSRF protection)</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">
                We do not use any analytics, tracking, or advertising cookies.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleAccept}
              className="flex-1 sm:flex-initial"
            >
              Understand
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
