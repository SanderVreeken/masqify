"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock, ArrowRight } from "lucide-react"
import { authClient } from "@/lib/auth-client"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Get token from URL
    const tokenParam = searchParams.get('token')
    if (tokenParam) {
      setToken(tokenParam)
    } else {
      setError("Invalid or missing reset token. Please request a new password reset.")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validate passwords
    if (password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!token) {
      setError("Invalid reset token. Please request a new password reset.")
      return
    }

    setIsLoading(true)

    try {
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      })

      if (result.error) {
        setError(result.error.message || "Failed to reset password. The link may have expired.")
        setIsLoading(false)
        return
      }

      // Success - redirect to login with success message
      router.push("/login?reset=success")
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>
            <Image src="/masqify-logo.svg" alt="Masqify" width={28} height={28} />
            Masqify
          </Link>
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Set your new password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>
              Reset password
            </CardTitle>
            <CardDescription style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              Enter your new password below
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading || !token}
                    autoFocus
                  />
                </div>
                <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
                  Must be at least 8 characters long
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading || !token}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading || !token}>
                {isLoading ? "Resetting..." : "Reset password"}
                {!isLoading && <ArrowRight className="size-4" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:gap-4">
            <p className="text-muted-foreground text-center" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              Remember your password?{" "}
              <Link href="/login" className="text-foreground font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Lock className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}
