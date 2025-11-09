"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"
import type { ActionResult } from "./types"

/**
 * Server Action: Resend email verification
 *
 * @param email - User's email address
 * @returns ActionResult with success/error status and message
 */
export async function resendVerificationEmail(email: string): Promise<ActionResult> {
  try {
    if (!email) {
      return {
        success: false,
        error: "Email address is required.",
      }
    }

    // Rate limiting: 3 resend attempts per hour per email (prevent email flooding)
    const headersList = await headers()
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
                     headersList.get('x-real-ip') ||
                     null

    const rateLimitResult = await checkRateLimit(
      {
        endpoint: 'resend-verification',
        limit: 3,
        windowSeconds: 3600, // 1 hour
        identifier: email, // Use email as identifier
      },
      null,
      clientIp
    )

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: `Too many verification emails sent. Please try again in ${Math.ceil((rateLimitResult.reset - Math.floor(Date.now() / 1000)) / 60)} minutes.`,
      }
    }

    // Call the better-auth API to resend verification email
    await auth.api.sendVerificationEmail({
      body: {
        email,
      },
    })

    return {
      success: true,
      message: "Verification email sent! Please check your inbox.",
    }
  } catch (error) {
    console.error("Resend verification error:", error)

    if (error && typeof error === "object" && "message" in error) {
      const message = String(error.message)

      // Handle specific error cases
      if (message.includes("already verified")) {
        return {
          success: false,
          error: "This email is already verified. Please try signing in.",
        }
      }

      if (message.includes("not found")) {
        return {
          success: false,
          error: "No account found with this email address.",
        }
      }
    }

    return {
      success: false,
      error: "Failed to send verification email. Please try again later.",
    }
  }
}
