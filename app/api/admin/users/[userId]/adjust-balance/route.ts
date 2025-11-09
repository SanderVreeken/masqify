import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userBalance, transaction } from "@/lib/db/schema";
import { headers } from "next/headers";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getUserBalance } from "@/lib/balance";

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
    const { amount, reason } = body;

    if (typeof amount !== "number" || isNaN(amount)) {
      return Response.json({ error: "Invalid amount" }, { status: 400 });
    }

    const currentBalance = await getUserBalance(userId);
    const newBalance = currentBalance + amount;

    if (newBalance < 0) {
      return Response.json({ error: "Resulting balance cannot be negative" }, { status: 400 });
    }

    // Create transaction record
    await db.insert(transaction).values({
      id: nanoid(),
      userId,
      type: "adjustment",
      amount: amount.toFixed(6),
      balanceAfter: newBalance.toFixed(6),
      description: reason || `Admin adjustment: ${amount > 0 ? '+' : ''}€${amount.toFixed(2)}`,
      relatedId: null,
      metadata: {
        adminId: session.user.id,
        adminEmail: session.user.email,
        reason,
      },
      createdAt: new Date(),
    });

    // Update cached balance
    await db
      .update(userBalance)
      .set({
        balance: newBalance.toFixed(6),
        balanceUpdatedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userBalance.userId, userId));

    return Response.json({
      success: true,
      newBalance,
      message: "Balance adjusted successfully"
    });
  } catch (error) {
    console.error("Error adjusting balance:", error);
    return Response.json(
      { error: "Failed to adjust balance" },
      { status: 500 }
    );
  }
}
