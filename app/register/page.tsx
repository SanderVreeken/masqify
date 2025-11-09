"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, Mail, User, ArrowRight, Check, X } from "lucide-react"
import { register } from "@/app/actions/register"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Password strength indicators
  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
  }

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!Object.values(passwordRequirements).every(Boolean)) {
      setError("Password does not meet requirements")
      return
    }

    if (!passwordsMatch) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const result = await register(formData)

      if (result.success) {
        // Redirect to login page with success message
        router.push(`/login?registered=true`)
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
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
          <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Create your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: 'clamp(1rem, 2vw + 0.25rem, 1.25rem)' }}>Get started</CardTitle>
            <CardDescription style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>Create an account to start rewriting text securely</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name='name'
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name='email'
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
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name='password'
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                {password && (
                  <div className="space-y-1.5 pt-2">
                    <p className="text-muted-foreground" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>Password must contain:</p>
                    <div className="space-y-1">
                      <PasswordRequirement met={passwordRequirements.minLength}>
                        At least 8 characters
                      </PasswordRequirement>
                      <PasswordRequirement met={passwordRequirements.hasUpperCase}>
                        One uppercase letter
                      </PasswordRequirement>
                      <PasswordRequirement met={passwordRequirements.hasLowerCase}>
                        One lowercase letter
                      </PasswordRequirement>
                      <PasswordRequirement met={passwordRequirements.hasNumber}>One number</PasswordRequirement>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name='confirmPassword'
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
                {confirmPassword && <PasswordRequirement met={passwordsMatch}>Passwords match</PasswordRequirement>}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !Object.values(passwordRequirements).every(Boolean) || !passwordsMatch}
              >
                {isLoading ? "Creating account..." : "Create account"}
                {!isLoading && <ArrowRight className="size-4" />}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-muted-foreground" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
                or
              </span>
            </div>
            <p className="text-muted-foreground text-center" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
              Already have an account?{" "}
              <Link href="/login" className="text-foreground font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>

        <p className="text-muted-foreground text-center mt-4 sm:mt-6" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
          By creating an account, you agree to our{" "}
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

function PasswordRequirement({ met, children }: { met: boolean; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
      {met ? <Check className="size-3 text-green-600" /> : <X className="size-3 text-muted-foreground" />}
      <span className={met ? "text-green-600" : "text-muted-foreground"}>{children}</span>
    </div>
  )
}
