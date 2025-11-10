"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { checkRateLimit } from "@/lib/rate-limit"
import { db } from "@/lib/db"
import { verification } from "@/lib/db/auth-schema"
import { userBalance } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { Resend } from "resend"
import { DeleteAccountEmail, DeleteAccountEmailText } from "@/lib/emails/delete-account"
import { randomBytes } from "crypto"
import type { ActionResult } from "./types"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Server Action: Initiate account deletion (sends confirmation email)
 *
 * @returns ActionResult with success/error status and message
 */
export async function initiateAccountDeletion(): Promise<ActionResult> {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: "You must be signed in to delete your account.",
      }
    }

    const userId = session.user.id
    const userEmail = session.user.email
    const userName = session.user.name

    // Rate limiting: 3 deletion requests per hour per user
    const headersList = await headers()
    const clientIp = headersList.get('x-forwarded-for')?.split(',')[0].trim() ||
                     headersList.get('x-real-ip') ||
                     null

    const rateLimitResult = await checkRateLimit(
      {
        endpoint: 'delete-account',
        limit: 3,
        windowSeconds: 3600, // 1 hour
        identifier: userId,
      },
      null,
      clientIp
    )

    if (!rateLimitResult.success) {
      return {
        success: false,
        error: `Too many deletion requests. Please try again in ${Math.ceil((rateLimitResult.reset - Math.floor(Date.now() / 1000)) / 60)} minutes.`,
      }
    }

    // Get user's current balance
    const balanceRecord = await db.query.userBalance.findFirst({
      where: eq(userBalance.userId, userId),
    })

    const balance = Number(balanceRecord?.balance || 0)

    // Generate a secure token for email confirmation
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    // Store the verification token
    await db.insert(verification).values({
      id: randomBytes(16).toString('hex'),
      identifier: userEmail,
      value: token,
      expiresAt,
    })

    // Create confirmation URL
    const confirmationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/account/delete/confirm?token=${token}`

    // Send confirmation email with both HTML and plain text versions
    await resend.emails.send({
      from: 'Masqify <hello@masqify.io>',
      to: userEmail,
      subject: 'Confirm Account Deletion - Masqify',
      html: DeleteAccountEmail(userName, confirmationUrl, balance),
      text: DeleteAccountEmailText(userName, confirmationUrl, balance),
      headers: {
        'X-Entity-Ref-ID': `delete-account-${userId}`,
      },
    })

    return {
      success: true,
      message: "Account deletion email sent! Please check your inbox and click the confirmation link to complete the process.",
    }
  } catch (error) {
    console.error("Account deletion initiation error:", error)

    return {
      success: false,
      error: "Failed to initiate account deletion. Please try again later.",
    }
  }
}
