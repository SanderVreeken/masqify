"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { Lock, Mail, ArrowRight } from "lucide-react"
import { Chrome } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { AuthToast } from "@/components/auth-toast"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState("")

  // Check for email verification success, registration success, or password reset success
  useEffect(() => {
    const verified = searchParams.get('verified')
    const registered = searchParams.get('registered')
    const reset = searchParams.get('reset')

    if (verified === 'true') {
      toast.success('Email verified successfully!', {
        description: 'You can now sign in to your account.'
      })
      // Clean up URL by removing the verified parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('verified')
      window.history.replaceState({}, '', newUrl.toString())
    }

    if (registered === 'true') {
      toast.success('Account created successfully!', {
        description: 'Please check your email to verify your account.'
      })
      // Clean up URL by removing the registered parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('registered')
      window.history.replaceState({}, '', newUrl.toString())
    }

    if (reset === 'success') {
      toast.success('Password reset successfully!', {
        description: 'You can now sign in with your new password.'
      })
      // Clean up URL by removing the reset parameter
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('reset')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (showTwoFactor) {
        // Handle 2FA verification
        const result = await authClient.twoFactor.verifyTotp({
          code: twoFactorCode,
          trustDevice: true,
        })

        if (result.error) {
          setError(result.error.message || "Invalid verification code")
          setIsLoading(false)
          return
        }


        // 2FA successful, redirect
        window.location.href = `/editor?message=${encodeURIComponent("Signed in successfully!")}&type=success`
      } else {
        // Handle initial login
        const result = await authClient.signIn.email({
          email,
          password,
        })


        if (result.error) {
          // Check if 2FA is required
          if (result.error.message?.includes("two-factor") || result.error.message?.includes("2FA")) {
            setShowTwoFactor(true)
            setIsLoading(false)
            return
          }

          // Check if email is not verified
          if (result.error.message?.toLowerCase().includes("verify") || result.error.message?.toLowerCase().includes("verification")) {
            setError("Please verify your email address before signing in. Check your inbox for the verification link.")
            setIsLoading(false)
            return
          }

          setError(result.error.message || "Invalid email or password")
          setIsLoading(false)
          return
        }

        // Check if 2FA is required in successful response
        if (result.data && (result.data as any).twoFactorRedirect) {
          setShowTwoFactor(true)
          setIsLoading(false)
          return
        }

        // Login successful without 2FA
        window.location.href = `/editor?message=${encodeURIComponent("Signed in successfully!")}&type=success`
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToLogin = () => {
    setShowTwoFactor(false)
    setTwoFactorCode("")
    setError(null)
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setError(null)

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/editor",
      })
    } catch (err) {
      setError("Failed to sign in with Google. Please try again.")
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
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Sign in to your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>
              {showTwoFactor ? "Two-Factor Authentication" : "Welcome back"}
            </CardTitle>
            <CardDescription style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              {showTwoFactor
                ? "Enter the 6-digit code from your authenticator app"
                : "Enter your credentials to access your account"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {!showTwoFactor ? (
                <>
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
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link
                        href="/forgot-password"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                        style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}
                      >
                        Forgot password?
                      </Link>
                    </div>
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
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Signing in..." : "Sign in"}
                    {!isLoading && <ArrowRight className="size-4" />}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="twoFactorCode">Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        value={twoFactorCode}
                        onChange={(value) => setTwoFactorCode(value)}
                        disabled={isLoading}
                        autoFocus
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    <p className="text-center text-muted-foreground" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToLogin}
                      className="flex-1"
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button type="submit" className="flex-1" disabled={isLoading || twoFactorCode.length !== 6}>
                      {isLoading ? "Verifying..." : "Verify"}
                    </Button>
                  </div>
                </>
              )}
            </form>
          </CardContent>
          {!showTwoFactor && (
            <CardFooter className="flex-col gap-3 sm:gap-4">
              <div className="relative w-full">
                <Separator />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
                  or
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <Chrome className="size-4" />
                Continue with Google
              </Button>
              <p className="text-muted-foreground text-center" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                Don't have an account?{" "}
                <Link href="/register" className="text-foreground font-medium hover:underline">
                  Sign up
                </Link>
              </p>
            </CardFooter>
          )}
        </Card>

        <p className="text-muted-foreground text-center mt-4 sm:mt-6" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
          By signing in, you agree to our{" "}
          <Link href="/terms" className="underline hover:text-foreground">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline hover:text-foreground">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Lock className="h-8 w-8 animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <AuthToast />
      <LoginForm />
    </Suspense>
  )
}
