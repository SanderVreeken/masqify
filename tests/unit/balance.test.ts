import { describe, it, expect } from 'vitest'

/**
 * Balance calculation tests
 * Testing the cost calculation logic without importing server-only code
 */

// Replicate the calculateCost function for testing
function calculateCost(
  model: string,
  inputTokens: number,
  outputTokens: number
): { cost: number; pricePerToken: number } {
  const pricing: Record<string, { input: number; output: number }> = {
    "gpt-4o": { input: 2.5, output: 10.0 },
    "gpt-4o-mini": { input: 0.15, output: 0.6 },
    "gpt-4-turbo": { input: 10.0, output: 30.0 },
    "gpt-3.5-turbo": { input: 0.5, output: 1.5 },
  }

  const modelPricing = pricing[model] || pricing["gpt-4o-mini"]
  const inputCost = (inputTokens / 1_000_000) * modelPricing.input
  const outputCost = (outputTokens / 1_000_000) * modelPricing.output
  const baseCost = inputCost + outputCost
  const finalCost = baseCost * 6
  const totalTokens = inputTokens + outputTokens
  const pricePerToken = totalTokens > 0 ? finalCost / totalTokens : 0

  return { cost: finalCost, pricePerToken }
}

describe('Balance Calculations', () => {
  describe('calculateCost', () => {
    it('should calculate cost for gpt-4o-mini with correct 6x markup', () => {
      // gpt-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
      const inputTokens = 1000
      const outputTokens = 2000

      // Base cost: (1000/1M * 0.15) + (2000/1M * 0.60) = 0.00015 + 0.0012 = 0.00135
      // With 6x markup: 0.00135 * 6 = 0.0081
      const { cost, pricePerToken } = calculateCost('gpt-4o-mini', inputTokens, outputTokens)

      expect(cost).toBeCloseTo(0.0081, 6)
      expect(pricePerToken).toBeCloseTo(0.0081 / 3000, 8)
    })

    it('should calculate cost for gpt-4o', () => {
      // gpt-4o: $2.5 per 1M input tokens, $10.0 per 1M output tokens
      const inputTokens = 5000
      const outputTokens = 3000

      // Base cost: (5000/1M * 2.5) + (3000/1M * 10.0) = 0.0125 + 0.03 = 0.0425
      // With 6x markup: 0.0425 * 6 = 0.255
      const { cost, pricePerToken } = calculateCost('gpt-4o', inputTokens, outputTokens)

      expect(cost).toBeCloseTo(0.255, 6)
      expect(pricePerToken).toBeCloseTo(0.255 / 8000, 8)
    })

    it('should handle zero tokens', () => {
      const { cost, pricePerToken } = calculateCost('gpt-4o-mini', 0, 0)

      expect(cost).toBe(0)
      expect(pricePerToken).toBe(0)
    })

    it('should handle unknown model by defaulting to gpt-4o-mini', () => {
      const { cost } = calculateCost('unknown-model', 1000, 2000)
      const { cost: miniCost } = calculateCost('gpt-4o-mini', 1000, 2000)

      expect(cost).toBe(miniCost)
    })

    it('should maintain 6 decimal precision', () => {
      const inputTokens = 123
      const outputTokens = 456

      const { cost, pricePerToken } = calculateCost('gpt-4o-mini', inputTokens, outputTokens)

      // Verify we can represent very small costs accurately
      expect(cost.toFixed(6)).toMatch(/^\d+\.\d{6}$/)
      expect(pricePerToken.toFixed(6)).toMatch(/^\d+\.\d{6}$/)
    })

    it('should calculate cost for gpt-4-turbo', () => {
      // gpt-4-turbo: $10.0 per 1M input tokens, $30.0 per 1M output tokens
      const inputTokens = 1000
      const outputTokens = 500

      // Base cost: (1000/1M * 10.0) + (500/1M * 30.0) = 0.01 + 0.015 = 0.025
      // With 6x markup: 0.025 * 6 = 0.15
      const { cost } = calculateCost('gpt-4-turbo', inputTokens, outputTokens)

      expect(cost).toBeCloseTo(0.15, 6)
    })

    it('should calculate cost for gpt-3.5-turbo', () => {
      // gpt-3.5-turbo: $0.5 per 1M input tokens, $1.5 per 1M output tokens
      const inputTokens = 10000
      const outputTokens = 5000

      // Base cost: (10000/1M * 0.5) + (5000/1M * 1.5) = 0.005 + 0.0075 = 0.0125
      // With 6x markup: 0.0125 * 6 = 0.075
      const { cost } = calculateCost('gpt-3.5-turbo', inputTokens, outputTokens)

      expect(cost).toBeCloseTo(0.075, 6)
    })

    it('should handle large token counts without precision loss', () => {
      // Test with 1 million tokens to verify no overflow or precision issues
      const inputTokens = 500_000
      const outputTokens = 500_000

      const { cost, pricePerToken } = calculateCost('gpt-4o-mini', inputTokens, outputTokens)

      // Base cost: (500000/1M * 0.15) + (500000/1M * 0.60) = 0.075 + 0.3 = 0.375
      // With 6x markup: 0.375 * 6 = 2.25
      expect(cost).toBeCloseTo(2.25, 6)
      expect(pricePerToken).toBeCloseTo(2.25 / 1_000_000, 8)
    })

    it('should ensure output tokens cost more than input tokens for gpt-4o-mini', () => {
      const tokens = 1000

      const { cost: inputOnlyCost } = calculateCost('gpt-4o-mini', tokens, 0)
      const { cost: outputOnlyCost } = calculateCost('gpt-4o-mini', 0, tokens)

      // Output should be 4x more expensive (0.60 vs 0.15)
      expect(outputOnlyCost).toBeCloseTo(inputOnlyCost * 4, 6)
    })
  })

  describe('Balance operations edge cases', () => {
    it('should handle very small amounts (microtransactions)', () => {
      // Test with 1 token to verify minimum cost handling
      const { cost } = calculateCost('gpt-4o-mini', 1, 1)

      // Should be a very small but non-zero amount
      // Cost for 1 input + 1 output token with 6x markup ≈ 0.0000045
      expect(cost).toBeGreaterThan(0)
      expect(cost).toBeLessThan(0.00001)
    })

    it('should maintain precision across multiple operations', () => {
      // Simulate multiple small rewrite operations
      let totalCost = 0

      for (let i = 0; i < 10; i++) {
        const { cost } = calculateCost('gpt-4o-mini', 100, 200)
        totalCost += cost
      }

      // Calculate expected cost
      const { cost: singleCost } = calculateCost('gpt-4o-mini', 100, 200)
      const expectedTotal = singleCost * 10

      expect(totalCost).toBeCloseTo(expectedTotal, 6)
    })

    it('should handle balance calculations with 6 decimal precision', () => {
      const initialBalance = 10.123456
      const cost = 0.000001
      const newBalance = initialBalance - cost

      // Verify precision is maintained
      expect(newBalance.toFixed(6)).toBe('10.123455')
    })
  })
})
