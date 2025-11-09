"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Lock, Mail, ArrowLeft, ArrowRight } from "lucide-react"
import { authClient } from "@/lib/auth-client"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const result = await authClient.forgetPassword({
        email,
        redirectTo: "/reset-password",
      })

      if (result.error) {
        setError(result.error.message || "Failed to send reset email. Please try again.")
        setIsLoading(false)
        return
      }

      // Success - show confirmation message
      setIsSubmitted(true)
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-4 sm:mb-6">
            <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>
              <Image src="/masqify-logo.svg" alt="Masqify" width={28} height={28} />
              Masqify
            </Link>
            <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Check your email</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>
                Email sent
              </CardTitle>
              <CardDescription style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                We've sent password reset instructions to your email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-3 sm:p-4 rounded-md bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                <p className="text-green-800 dark:text-green-200" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                  If an account exists for <strong>{email}</strong>, you'll receive an email with instructions to reset your password.
                </p>
              </div>
              <p className="text-muted-foreground mt-4" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                Didn't receive the email? Check your spam folder or try again.
              </p>
            </CardContent>
            <CardFooter className="flex-col gap-3 sm:gap-4">
              <Button asChild className="w-full" variant="outline">
                <Link href="/login">
                  <ArrowLeft className="size-4" />
                  Back to sign in
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-3 sm:p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 sm:mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-bold mb-2" style={{ fontSize: 'clamp(1.125rem, 2.25vw + 0.375rem, 1.5rem)' }}>
            <Image src="/masqify-logo.svg" alt="Masqify" width={28} height={28} />
            Masqify
          </Link>
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Reset your password</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>
              Forgot password?
            </CardTitle>
            <CardDescription style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              Enter your email and we'll send you instructions to reset your password
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
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send reset link"}
                {!isLoading && <ArrowRight className="size-4" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:gap-4">
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">
                <ArrowLeft className="size-4" />
                Back to sign in
              </Link>
            </Button>
          </CardFooter>
        </Card>

        <p className="text-muted-foreground text-center mt-4 sm:mt-6" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
          Remember your password?{" "}
          <Link href="/login" className="text-foreground font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
