import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables for tests
process.env.BETTER_AUTH_SECRET = 'test-secret-key-for-testing-only'
process.env.BETTER_AUTH_URL = 'http://localhost:3000'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
process.env.DATABASE_URL = 'postgres://test:test@localhost:5432/test'
process.env.OPENAI_API_KEY = 'sk-test-key'
process.env.RESEND_API_KEY = 're_test_key'
process.env.STRIPE_SECRET_KEY = 'sk_test_key'
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test_key'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
