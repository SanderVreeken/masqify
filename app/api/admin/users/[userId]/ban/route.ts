import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json({ error: "Authentication required" }, { status: 401 });
    }

    if (session.user.role !== "admin") {
      return Response.json({ error: "Admin access required" }, { status: 403 });
    }

    const { userId } = await params;
    const body = await request.json();
    const { banned, banReason, banExpires } = body;

    // Update user ban status
    await db
      .update(user)
      .set({
        banned,
        banReason: banned ? banReason : null,
        banExpires: banExpires ? new Date(banExpires) : null,
        updatedAt: new Date(),
      })
      .where(eq(user.id, userId));

    return Response.json({
      success: true,
      message: banned ? "User banned successfully" : "User unbanned successfully"
    });
  } catch (error) {
    console.error("Error updating ban status:", error);
    return Response.json(
      { error: "Failed to update ban status" },
      { status: 500 }
    );
  }
}
