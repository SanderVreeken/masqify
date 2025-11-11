"use server"

import { auth } from "@/lib/auth"
import { z } from "zod"
import type { ActionResult } from "./types"

/**
 * Validation schema for user registration
 * Enforces strong password requirements and email format
 */
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

/**
 * Server Action: Register a new user
 *
 * Security features:
 * - Input validation with Zod
 * - Password strength requirements
 * - Duplicate email detection
 * - Error message sanitization to prevent information leakage
 * - Automatic sign-in after registration (via BetterAuth autoSignIn)
 *
 * @param formData - Form data containing name, email, password, and confirmPassword
 * @returns ActionResult with success/error status and message
 *
 * @example
 * ```tsx
 * const result = await register(formData)
 * if (result.success) {
 *   // User registered and signed in
 *   router.push("/editor")
 * } else {
 *   // Show error message
 *   setError(result.error)
 * }
 * ```
 */
export async function register(formData: FormData): Promise<ActionResult> {
  try {
    // Extract form data
    const rawData = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    }

    // Validate input - throws ZodError if validation fails
    const validatedData = registerSchema.parse(rawData)

    // Attempt registration - throws on error
    // Note: With email verification enabled, user won't be signed in until verified
    await auth.api.signUpEmail({
      body: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
        callbackURL: `${process.env.BETTER_AUTH_URL}/login?verified=true`
      },
    })

    return {
      success: true,
      message: "Account created successfully! Please check your email to verify your account. Our domain is new, so some mail providers may mistakenly place our messages in Spam or Promotions. Please check there if you don't see the email within a few minutes and mark it as \"Not Spam\" — it helps ensure future messages reach your inbox.",
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      return {
        success: false,
        error: firstError.message,
        field: firstError.path[0] as string,
      }
    }

    // Handle BetterAuth errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message)

      // Provide user-friendly error for duplicate accounts
      if (message.includes("already exists") || message.includes("duplicate")) {
        return {
          success: false,
          error: "An account with this email already exists.",
          field: "email",
        }
      }

      // Generic error - don't leak internal error details
      return {
        success: false,
        error: "Registration failed. Please check your information and try again.",
      }
    }

    // Handle unexpected errors - log for debugging but don't expose details
    console.error("Registration error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}
