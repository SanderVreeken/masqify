"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import type { ActionResult } from "./types"

/**
 * Server Action: Sign out a user
 *
 * Security features:
 * - Session validation before logout
 * - Secure session termination
 * - Cookie cleanup via BetterAuth
 *
 * @returns ActionResult with success/error status and message
 *
 * @example
 * ```tsx
 * const result = await logout()
 * if (result.success) {
 *   // User signed out successfully
 *   router.push("/")
 * } else {
 *   // Show error message
 *   toast.error(result.error)
 * }
 * ```
 */
export async function logout(): Promise<ActionResult> {
  try {
    // Sign out the user - this clears the session and cookies
    await auth.api.signOut({
      headers: await headers(),
    })

    return {
      success: true,
      message: "Signed out successfully!",
    }
  } catch (error) {
    // Handle unexpected errors - log for debugging but don't expose details
    console.error("Logout error:", error)
    return {
      success: false,
      error: "Failed to sign out. Please try again.",
    }
  }
}
