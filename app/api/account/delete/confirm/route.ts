import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { verification } from "@/lib/db/auth-schema"
import { user } from "@/lib/db/auth-schema"
import { eq, and, gt } from "drizzle-orm"
import { auth } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const token = searchParams.get("token")

    if (!token) {
      return NextResponse.redirect(
        new URL("/account?error=invalid-token", request.url)
      )
    }

    // Find the verification token
    const verificationRecord = await db.query.verification.findFirst({
      where: and(
        eq(verification.value, token),
        gt(verification.expiresAt, new Date())
      ),
    })

    if (!verificationRecord) {
      return NextResponse.redirect(
        new URL("/account?error=token-expired", request.url)
      )
    }

    // Find the user by email from the verification record
    const userRecord = await db.query.user.findFirst({
      where: eq(user.email, verificationRecord.identifier),
    })

    if (!userRecord) {
      return NextResponse.redirect(
        new URL("/account?error=user-not-found", request.url)
      )
    }

    // Delete the user (CASCADE will handle all related records)
    await db.delete(user).where(eq(user.id, userRecord.id))

    // Delete the verification token
    await db.delete(verification).where(eq(verification.id, verificationRecord.id))

    // Sign out the user (if they're currently signed in)
    try {
      await auth.api.signOut({
        headers: request.headers,
      })
    } catch (error) {
      // User might not be signed in, that's okay
      console.log("User was not signed in during deletion:", error)
    }

    // Redirect to a confirmation page
    return NextResponse.redirect(
      new URL("/?deleted=true", request.url)
    )
  } catch (error) {
    console.error("Account deletion confirmation error:", error)
    return NextResponse.redirect(
      new URL("/account?error=deletion-failed", request.url)
    )
  }
}
