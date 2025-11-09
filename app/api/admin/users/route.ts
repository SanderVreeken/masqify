import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { user } from "@/lib/db/auth-schema";
import { userBalance } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq, sql } from "drizzle-orm";

export async function GET() {
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

    // Get all users with their balances
    const users = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        image: user.image,
        role: user.role,
        banned: user.banned,
        banReason: user.banReason,
        banExpires: user.banExpires,
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        balance: userBalance.balance,
      })
      .from(user)
      .leftJoin(userBalance, eq(user.id, userBalance.userId))
      .orderBy(sql`${user.createdAt} DESC`);

    return Response.json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    return Response.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
