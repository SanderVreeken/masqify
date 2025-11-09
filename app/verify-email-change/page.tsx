"use client"

import { useEffect, useState, useRef, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { authClient } from "@/lib/auth-client"

function VerifyEmailChangeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const { refetch: refetchSession } = authClient.useSession()
  const verificationAttempted = useRef(false)

  useEffect(() => {
    // Prevent duplicate verification attempts
    if (verificationAttempted.current) {
      return
    }

    const verifyEmailChange = async () => {
      try {
        const token = searchParams.get("token")
        const id = searchParams.get("id")

        if (!token || !id) {
          setStatus("error")
          setMessage("Invalid verification link. Please request a new email change.")
          return
        }

        // Mark that we've attempted verification
        verificationAttempted.current = true

        // Call the API to verify and update the email
        const response = await fetch("/api/verify-email-change", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, id }),
        })

        const data = await response.json()

        if (response.ok && data.success) {
          // Refresh the session to get updated user data
          await refetchSession()

          // Also refresh server components
          router.refresh()

          setStatus("success")
          setMessage(data.message || "Your email has been successfully updated!")
        } else {
          setStatus("error")
          setMessage(data.error || "Failed to verify email change. The link may have expired.")
        }
      } catch (error) {
        console.error("Verification error:", error)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    verifyEmailChange()
  }, [searchParams, refetchSession, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
            {status === "success" && <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />}
            {status === "error" && <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />}
            Email Verification
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Verifying your new email address..."}
            {status === "success" && "Email Successfully Updated"}
            {status === "error" && "Verification Failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>

          {status === "success" && (
            <Button
              onClick={async () => {
                // Final session refresh before navigation to ensure data is fresh
                await refetchSession()
                router.push("/account")
              }}
              className="w-full"
            >
              Go to Account Settings
            </Button>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <Button onClick={() => router.push("/account")} className="w-full">
                Back to Account Settings
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function VerifyEmailChangePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Email Verification
            </CardTitle>
            <CardDescription>
              Verifying your new email address...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Please wait while we verify your email change.</p>
          </CardContent>
        </Card>
      </div>
    }>
      <VerifyEmailChangeContent />
    </Suspense>
  )
}
