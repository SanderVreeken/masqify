import "server-only";
import { db } from "./db";
import { userBalance, transaction, payment, rewrite } from "./db/schema";
import { eq, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

/**
 * Get user's current balance
 * Returns cached balance or calculates from transactions if not exists
 */
export async function getUserBalance(userId: string): Promise<number> {
  const balance = await db.query.userBalance.findFirst({
    where: eq(userBalance.userId, userId),
  });

  if (balance) {
    return parseFloat(balance.balance);
  }

  // If no balance record exists, create one with 0.000000
  await db.insert(userBalance).values({
    userId,
    balance: "0.000000",
    balanceUpdatedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  return 0.0;
}

/**
 * Add funds to user's account (called after successful payment)
 */
export async function addFunds(
  userId: string,
  amount: number,
  paymentId: string,
  metadata?: any
): Promise<void> {
  const currentBalance = await getUserBalance(userId);
  const newBalance = currentBalance + amount;

  // Create transaction record (store with 6 decimals for accuracy)
  await db.insert(transaction).values({
    id: nanoid(),
    userId,
    type: "payment",
    amount: amount.toFixed(6),
    balanceAfter: newBalance.toFixed(6),
    description: `Added funds: €${amount.toFixed(2)}`,
    relatedId: paymentId,
    metadata,
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
}

/**
 * Deduct funds from user's account (called after rewrite)
 */
export async function deductFunds(
  userId: string,
  amount: number,
  rewriteId: string,
  metadata?: any
): Promise<void> {
  const currentBalance = await getUserBalance(userId);
  const newBalance = currentBalance - amount;

  if (newBalance < 0) {
    throw new Error("Insufficient balance");
  }

  // Create transaction record (negative amount for debit, store with 6 decimals for accuracy)
  await db.insert(transaction).values({
    id: nanoid(),
    userId,
    type: "rewrite",
    amount: (-amount).toFixed(6),
    balanceAfter: newBalance.toFixed(6),
    description: `AI rewrite: €${amount.toFixed(6)}`,
    relatedId: rewriteId,
    metadata,
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
}

/**
 * Create a payment record (pending)
 */
export async function createPendingPayment(
  userId: string,
  amount: number,
  providerTransactionId: string
): Promise<string> {
  const paymentId = nanoid();

  await db.insert(payment).values({
    id: paymentId,
    userId,
    amount: amount.toFixed(6),
    currency: "EUR",
    status: "pending",
    provider: "stripe",
    providerTransactionId,
    metadata: null,
    createdAt: new Date(),
    completedAt: null,
    updatedAt: new Date(),
  });

  return paymentId;
}

/**
 * Complete a payment (called via webhook)
 */
export async function completePayment(
  paymentId: string,
  metadata?: any
): Promise<void> {
  // Get payment record
  const paymentRecord = await db.query.payment.findFirst({
    where: eq(payment.id, paymentId),
  });

  if (!paymentRecord) {
    throw new Error("Payment not found");
  }

  if (paymentRecord.status === "completed") {
    return; // Already completed
  }

  // Update payment status
  await db
    .update(payment)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
      metadata,
    })
    .where(eq(payment.id, paymentId));

  // Add funds to user's account
  await addFunds(
    paymentRecord.userId,
    parseFloat(paymentRecord.amount),
    paymentId,
    metadata
  );
}

/**
 * Create a rewrite record
 */
export async function createRewriteRecord(
  userId: string,
  inputLength: number,
  outputLength: number,
  tokensUsed: number,
  pricePerToken: number,
  totalCost: number,
  model: string,
  metadata?: any
): Promise<string> {
  const rewriteId = nanoid();

  await db.insert(rewrite).values({
    id: rewriteId,
    userId,
    inputLength,
    outputLength,
    tokensUsed,
    pricePerToken: pricePerToken.toFixed(6),
    totalCost: totalCost.toFixed(6),
    status: "completed",
    model,
    metadata,
    createdAt: new Date(),
  });

  return rewriteId;
}

/**
 * Calculate OpenAI cost with 6x markup
 * Pricing as of 2025 for common models (per 1M tokens)
 */
export function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): { cost: number; pricePerToken: number } {
  // OpenAI pricing per 1M tokens (as of 2025)
  const pricing: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 2.5, output: 10.0 },
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
    "gpt-4-turbo": { input: 10.0, output: 30.0 },
    "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  };

  const modelPricing = pricing[model] || pricing["gpt-4o-mini"];

  // Calculate base cost
  const inputCost = (inputTokens / 1_000_000) * modelPricing.input;
  const outputCost = (outputTokens / 1_000_000) * modelPricing.output;
  const baseCost = inputCost + outputCost;

  // Apply 6x markup
  const finalCost = baseCost * 6;

  // Calculate average price per token for record keeping
  const totalTokens = inputTokens + outputTokens;
  const pricePerToken = totalTokens > 0 ? finalCost / totalTokens : 0;

  return {
    cost: finalCost,
    pricePerToken,
  };
}
