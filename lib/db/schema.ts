import { pgTable, text, timestamp, integer, numeric, json, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

/**
 * User Balance Extension
 *
 * Extends the user table with balance tracking fields.
 * These could be added to the user table via migration, or queried separately.
 *
 * For now, balance is calculated on-demand from transactions table,
 * but can be cached in a separate table if needed for performance.
 */
export const userBalance = pgTable("user_balance", {
  userId: text("user_id")
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  // Cached balance for quick lookups (6 decimals for micro-transaction accuracy)
  balance: numeric("balance", { precision: 10, scale: 6 }).default("0.000000").notNull(),
  balanceUpdatedAt: timestamp("balance_updated_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Enums for transaction and payment types
export const transactionTypeEnum = pgEnum("transaction_type", [
  "payment",
  "rewrite",
  "refund",
  "adjustment",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const rewriteStatusEnum = pgEnum("rewrite_status", [
  "completed",
  "failed",
  "refunded",
]);

/**
 * Transactions Table - Unified Ledger
 *
 * Source of truth for all balance changes.
 * Every credit or debit to a user's account is recorded here.
 */
export const transaction = pgTable("transaction", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: transactionTypeEnum("type").notNull(),
  // Positive for credits (payments), negative for debits (rewrites) - 6 decimals for accuracy
  amount: numeric("amount", { precision: 10, scale: 6 }).notNull(),
  // Snapshot of balance after this transaction
  balanceAfter: numeric("balance_after", { precision: 10, scale: 6 }).notNull(),
  description: text("description").notNull(),
  // References rewrite.id or payment.id depending on type
  relatedId: text("related_id"),
  // Flexible JSON storage for additional data
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Rewrites Table - Usage Details
 *
 * Detailed history of AI rewrite operations with pricing information.
 * Each successful rewrite creates a corresponding transaction.
 */
export const rewrite = pgTable("rewrite", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // Character counts
  inputLength: integer("input_length").notNull(),
  outputLength: integer("output_length").notNull(),
  // Token usage from AI provider
  tokensUsed: integer("tokens_used").notNull(),
  // Price per token at time of rewrite (for historical accuracy)
  pricePerToken: numeric("price_per_token", { precision: 10, scale: 6 }).notNull(),
  // Total cost calculated at time of rewrite (6 decimals for accuracy)
  totalCost: numeric("total_cost", { precision: 10, scale: 6 }).notNull(),
  status: rewriteStatusEnum("status").notNull().default("completed"),
  // AI model used (e.g., 'gpt-4o-mini', 'claude-3-haiku')
  model: text("model").notNull(),
  // Store original/rewritten text if needed for support/debugging
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Payments Table - Fund Additions
 *
 * Records of all payment transactions through Stripe.
 * Payments start as 'pending' and are updated via webhooks.
 */
export const payment = pgTable("payment", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amount: numeric("amount", { precision: 10, scale: 6 }).notNull(),
  currency: text("currency").notNull().default("EUR"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  // Payment provider (currently 'stripe', but allows for future expansion)
  provider: text("provider").notNull().default("stripe"),
  // Stripe transaction reference for reconciliation
  providerTransactionId: text("provider_transaction_id"),
  // Webhook data and other payment details
  metadata: json("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
