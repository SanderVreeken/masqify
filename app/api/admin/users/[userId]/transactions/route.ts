import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { transaction } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq, desc } from "drizzle-orm";

export async function GET(
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

    // Get all transactions for the user
    const transactions = await db.query.transaction.findMany({
      where: eq(transaction.userId, userId),
      orderBy: [desc(transaction.createdAt)],
    });

    return Response.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return Response.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
