import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verification, user } from "@/lib/db/auth-schema";
import { eq, and, gt } from "drizzle-orm";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    // Rate limiting: 10 verification attempts per hour per IP (prevent token brute force)
    const clientIp = getClientIp(req);
    const rateLimitResult = await checkRateLimit(
      {
        endpoint: '/api/verify-email-change',
        limit: 10,
        windowSeconds: 3600, // 1 hour
      },
      null, // No user ID for unauthenticated requests
      clientIp
    );

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many verification attempts. Please try again later.",
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
            'Retry-After': (rateLimitResult.reset - Math.floor(Date.now() / 1000)).toString(),
          },
        }
      );
    }

    const { token, id } = await req.json();

    if (!token || !id) {
      return NextResponse.json(
        { success: false, error: "Invalid verification parameters" },
        { status: 400 }
      );
    }

    // Find the verification record
    const verificationRecord = await db
      .select()
      .from(verification)
      .where(
        and(
          eq(verification.id, id),
          gt(verification.expiresAt, new Date())
        )
      )
      .limit(1);

    if (verificationRecord.length === 0) {
      return NextResponse.json(
        { success: false, error: "Verification link is invalid or has expired" },
        { status: 400 }
      );
    }

    const record = verificationRecord[0];

    // Parse the stored value
    let storedData: { token: string; newEmail: string };
    try {
      storedData = JSON.parse(record.value);
    } catch (error) {
      console.error("Error parsing verification data:", error);
      return NextResponse.json(
        { success: false, error: "Invalid verification data" },
        { status: 400 }
      );
    }

    // Verify the token matches
    if (storedData.token !== token) {
      return NextResponse.json(
        { success: false, error: "Invalid verification token" },
        { status: 400 }
      );
    }

    // Extract user ID from identifier (format: email-change:userId)
    const userId = record.identifier.replace("email-change:", "");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Invalid verification identifier" },
        { status: 400 }
      );
    }

    // Check if the new email is already in use by another user
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, storedData.newEmail))
      .limit(1);

    if (existingUser.length > 0 && existingUser[0].id !== userId) {
      // Delete the verification record
      await db.delete(verification).where(eq(verification.id, id));

      return NextResponse.json(
        { success: false, error: "This email address is already in use by another account" },
        { status: 400 }
      );
    }

    // Update the user's email
    await db
      .update(user)
      .set({
        email: storedData.newEmail,
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    // Delete the verification record
    await db.delete(verification).where(eq(verification.id, id));

    return NextResponse.json({
      success: true,
      message: "Your email address has been successfully updated!",
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
