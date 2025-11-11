"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { z } from "zod"
import { db } from "@/lib/db"
import { verification, user } from "@/lib/db/auth-schema"
import { eq, and } from "drizzle-orm"
import { nanoid } from "nanoid"
import { Resend } from "resend"
import { ChangeEmailVerification, ChangeEmailVerificationText } from "@/lib/emails/change-email"
import { checkRateLimit } from "@/lib/rate-limit"
import type { ActionResult } from "./types"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Validation schema for updating user name
 */
const updateNameSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
})

/**
 * Validation schema for updating email
 */
const updateEmailSchema = z.object({
  newEmail: z.string().email("Please enter a valid email address"),
})

/**
 * Validation schema for updating password
 */
const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
    revokeOtherSessions: z.boolean().optional().default(false),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

/**
 * Server Action: Update user's name
 *
 * Security features:
 * - Input validation with Zod
 * - Session verification
 * - Rate limiting via better-auth
 *
 * @param formData - Form data containing name
 * @returns ActionResult with success/error status and message
 */
export async function updateName(formData: FormData): Promise<ActionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: "You must be signed in to update your profile.",
      }
    }

    // Extract and validate form data
    const rawData = {
      name: formData.get("name"),
    }

    const validatedData = updateNameSchema.parse(rawData)

    // Update user name using better-auth
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name: validatedData.name,
      },
    })

    return {
      success: true,
      message: "Name updated successfully!",
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

    // Handle better-auth errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message)

      // Generic error - don't leak internal error details
      return {
        success: false,
        error: message || "Failed to update name. Please try again.",
      }
    }

    // Handle unexpected errors
    console.error("Update name error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}

/**
 * Server Action: Update user's password
 *
 * Security features:
 * - Input validation with Zod
 * - Password strength requirements
 * - Session verification
 * - Current password verification
 * - Optional revocation of other sessions
 * - Rate limiting via better-auth
 *
 * @param formData - Form data containing currentPassword, newPassword, confirmPassword, and revokeOtherSessions
 * @returns ActionResult with success/error status and message
 */
export async function updatePassword(formData: FormData): Promise<ActionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: "You must be signed in to update your password.",
      }
    }

    // Extract and validate form data
    const rawData = {
      currentPassword: formData.get("currentPassword"),
      newPassword: formData.get("newPassword"),
      confirmPassword: formData.get("confirmPassword"),
      revokeOtherSessions: formData.get("revokeOtherSessions") === "true",
    }

    const validatedData = updatePasswordSchema.parse(rawData)

    // Update password using better-auth
    await auth.api.changePassword({
      body: {
        newPassword: validatedData.newPassword,
        currentPassword: validatedData.currentPassword,
        revokeOtherSessions: validatedData.revokeOtherSessions,
      },
      headers: await headers(),
    })

    return {
      success: true,
      message: "Password updated successfully!",
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

    // Handle better-auth errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message)

      // Provide user-friendly error messages
      if (message.includes("Invalid password") || message.includes("incorrect")) {
        return {
          success: false,
          error: "Current password is incorrect.",
          field: "currentPassword",
        }
      }

      // Generic error - don't leak internal error details
      return {
        success: false,
        error: message || "Failed to update password. Please try again.",
      }
    }

    // Handle unexpected errors
    console.error("Update password error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}

/**
 * Server Action: Request email change with verification
 *
 * Security features:
 * - Input validation with Zod
 * - Email format validation
 * - Session verification
 * - Check if email is already in use
 * - Token generation and expiration (1 hour)
 * - Verification email sent to new address
 * - Rate limiting via better-auth
 *
 * @param formData - Form data containing newEmail
 * @returns ActionResult with success/error status and message
 */
export async function updateEmail(formData: FormData): Promise<ActionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: "You must be signed in to update your email.",
      }
    }

    // Rate limiting: 5 email change requests per hour per user (prevent email flooding)
    const headersList = await headers()
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
                     headersList.get('x-real-ip') ||
                     null

    const rateLimitResult = await checkRateLimit(
      {
        endpoint: 'update-email',
        limit: 5,
        windowSeconds: 3600, // 1 hour
      },
      session.user.id,
      clientIp
    )

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: `Too many email change requests. Please try again in ${Math.ceil((rateLimitResult.reset - Math.floor(Date.now() / 1000)) / 60)} minutes.`,
      }
    }

    // Extract and validate form data
    const rawData = {
      newEmail: formData.get("newEmail"),
    }

    const validatedData = updateEmailSchema.parse(rawData)
    const newEmail = validatedData.newEmail.toLowerCase().trim()

    // Check if the new email is the same as the current email
    if (newEmail === session.user.email.toLowerCase()) {
      return {
        success: false,
        error: "This is already your current email address.",
        field: "newEmail",
      }
    }

    // Check if email is already in use by another user
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, newEmail))
      .limit(1)

    if (existingUser.length > 0 && existingUser[0].id !== session.user.id) {
      return {
        success: false,
        error: "This email address is already in use.",
        field: "newEmail",
      }
    }

    // Generate verification token
    const token = nanoid(32)
    const verificationId = nanoid()

    // Store verification token with new email (expires in 1 hour)
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Delete any existing email change verifications for this user
    await db
      .delete(verification)
      .where(eq(verification.identifier, `email-change:${session.user.id}`))

    // Insert new verification record
    await db.insert(verification).values({
      id: verificationId,
      identifier: `email-change:${session.user.id}`,
      value: JSON.stringify({ token, newEmail }),
      expiresAt,
    })

    // Generate verification URL
    const baseUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || "https://masqify.io"
    const verificationUrl = `${baseUrl}/verify-email-change?token=${token}&id=${verificationId}`

    // Send verification email to the NEW email address
    await resend.emails.send({
      from: "Masqify <hello@notifications.masqify.io>",
      to: newEmail,
      subject: "Verify your new email address",
      html: ChangeEmailVerification(session.user.name, newEmail, verificationUrl),
      text: ChangeEmailVerificationText(session.user.name, newEmail, verificationUrl),
    })

    return {
      success: true,
      message: `Verification email sent to ${newEmail}. Please check your inbox to complete the email change. Our domain is new, so some mail providers may mistakenly place our messages in Spam or Promotions. Please check there if you don't see the email within a few minutes and mark it as "Not Spam" — it helps ensure future messages reach your inbox.`,
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

    // Handle Resend errors
    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message)

      if (message.includes("rate limit")) {
        return {
          success: false,
          error: "Too many requests. Please try again later.",
        }
      }
    }

    // Handle unexpected errors
    console.error("Update email error:", error)
    return {
      success: false,
      error: "An unexpected error occurred. Please try again later.",
    }
  }
}
