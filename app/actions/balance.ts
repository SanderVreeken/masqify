"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { getUserBalance, calculateCost } from "@/lib/balance"

export type BalanceResult = {
  success: boolean
  balance?: number
  error?: string
}

export type CostEstimate = {
  success: boolean
  estimatedTokens?: number
  estimatedCost?: number
  error?: string
}

/**
 * Get current user's balance
 */
export async function getBalance(): Promise<BalanceResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    const balance = await getUserBalance(session.user.id)

    return {
      success: true,
      balance,
    }
  } catch (error) {
    console.error("Get balance error:", error)
    return {
      success: false,
      error: "Failed to get balance",
    }
  }
}

/**
 * Estimate cost for a text rewrite
 * Uses simple character-based estimation (4 chars ≈ 1 token)
 */
export async function estimateCost(text: string): Promise<CostEstimate> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    // Estimate tokens (rough approximation: 4 characters ≈ 1 token)
    const estimatedInputTokens = Math.ceil(text.length / 4)

    // Estimate output tokens (assume output is similar length to input)
    const estimatedOutputTokens = Math.ceil(estimatedInputTokens * 1.1)

    // Calculate cost using gpt-4o-mini (default model)
    const { cost } = calculateCost(
      "gpt-4o-mini",
      estimatedInputTokens,
      estimatedOutputTokens
    )

    return {
      success: true,
      estimatedTokens: estimatedInputTokens + estimatedOutputTokens,
      estimatedCost: cost,
    }
  } catch (error) {
    console.error("Estimate cost error:", error)
    return {
      success: false,
      error: "Failed to estimate cost",
    }
  }
}
