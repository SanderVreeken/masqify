import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { transaction, payment, rewrite } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    // Get the current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get query params for pagination
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Fetch transactions with related payment/rewrite details
    const transactions = await db
      .select({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        balanceAfter: transaction.balanceAfter,
        description: transaction.description,
        relatedId: transaction.relatedId,
        metadata: transaction.metadata,
        createdAt: transaction.createdAt,
        // Payment details (if type is 'payment')
        paymentStatus: payment.status,
        paymentProvider: payment.provider,
        // Rewrite details (if type is 'rewrite')
        rewriteInputLength: rewrite.inputLength,
        rewriteOutputLength: rewrite.outputLength,
        rewriteTokensUsed: rewrite.tokensUsed,
        rewriteModel: rewrite.model,
      })
      .from(transaction)
      .leftJoin(payment, eq(transaction.relatedId, payment.id))
      .leftJoin(rewrite, eq(transaction.relatedId, rewrite.id))
      .where(eq(transaction.userId, session.user.id))
      .orderBy(desc(transaction.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const totalResult = await db
      .select({ count: transaction.id })
      .from(transaction)
      .where(eq(transaction.userId, session.user.id));

    return NextResponse.json({
      transactions,
      total: totalResult.length,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
