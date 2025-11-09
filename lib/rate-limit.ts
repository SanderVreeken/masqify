export interface RateLimitConfig {
  // Endpoint identifier (e.g., '/api/rewrite', 'resend-verification')
  endpoint: string;
  // Maximum number of requests allowed in the window
  limit: number;
  // Window duration in seconds
  windowSeconds: number;
  // Optional: identifier override (defaults to userId or IP)
  identifier?: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp when the window resets
}

interface RateLimitEntry {
  count: number;
  windowStart: number; // Unix timestamp in milliseconds
}

/**
 * In-memory rate limit storage
 * Key format: `${identifier}:${endpoint}`
 */
const rateLimitStore = new Map<string, RateLimitEntry>();

/**
 * Check and enforce rate limiting for a given endpoint and identifier.
 * Uses in-memory storage that persists for the lifetime of the server process.
 *
 * @param config - Rate limit configuration
 * @param userId - Optional user ID (takes precedence over IP)
 * @param ip - Optional IP address (used if userId not provided)
 * @returns RateLimitResult indicating if request is allowed
 */
export async function checkRateLimit(
  config: RateLimitConfig,
  userId?: string | null,
  ip?: string | null
): Promise<RateLimitResult> {
  // Determine identifier: use custom > userId > IP > 'anonymous'
  const identifier = config.identifier || userId || ip || 'anonymous';
  const key = `${identifier}:${config.endpoint}`;

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const windowStart = now - windowMs;

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  // If entry exists but window has expired, reset it
  if (entry && entry.windowStart < windowStart) {
    entry = undefined;
  }

  let currentCount = 0;
  let resetTime = now + windowMs;

  if (entry) {
    currentCount = entry.count;
    resetTime = entry.windowStart + windowMs;

    // Check if limit exceeded
    if (currentCount >= config.limit) {
      return {
        success: false,
        limit: config.limit,
        remaining: 0,
        reset: Math.floor(resetTime / 1000),
      };
    }

    // Increment count
    entry.count += 1;
    currentCount = entry.count;
  } else {
    // Create new entry
    rateLimitStore.set(key, {
      count: 1,
      windowStart: now,
    });
    currentCount = 1;
    resetTime = now + windowMs;
  }

  return {
    success: true,
    limit: config.limit,
    remaining: Math.max(0, config.limit - currentCount),
    reset: Math.floor(resetTime / 1000),
  };
}

/**
 * Helper to get client IP from Next.js request headers
 */
export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  return null;
}

/**
 * Cleanup old rate limit entries from memory
 * Should be called periodically to prevent memory leaks
 */
export function cleanupRateLimits(): number {
  const now = Date.now();
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours
  let deleted = 0;

  for (const [key, entry] of rateLimitStore.entries()) {
    if (now - entry.windowStart > maxAge) {
      rateLimitStore.delete(key);
      deleted++;
    }
  }

  return deleted;
}

/**
 * Clear all rate limit entries (useful for testing)
 */
export function clearRateLimits(): void {
  rateLimitStore.clear();
}

/**
 * Get current size of rate limit store (useful for monitoring)
 */
export function getRateLimitStoreSize(): number {
  return rateLimitStore.size;
}

// Auto-cleanup: Run cleanup every hour
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    cleanupRateLimits();
  }, 60 * 60 * 1000); // 1 hour
}
