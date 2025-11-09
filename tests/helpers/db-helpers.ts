import { vi } from 'vitest'

/**
 * Mock database utilities for testing
 * These help test database operations without hitting a real database
 */

export function createMockDbQuery() {
  return {
    userBalance: {
      findFirst: vi.fn(),
    },
    payment: {
      findFirst: vi.fn(),
    },
    transaction: {
      findFirst: vi.fn(),
    },
    user: {
      findFirst: vi.fn(),
    },
  }
}

export function createMockDb() {
  return {
    query: createMockDbQuery(),
    insert: vi.fn().mockReturnValue({
      values: vi.fn().mockResolvedValue(undefined),
    }),
    update: vi.fn().mockReturnValue({
      set: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue(undefined),
      }),
    }),
    select: vi.fn().mockReturnValue({
      from: vi.fn().mockReturnValue({
        where: vi.fn().mockResolvedValue([]),
      }),
    }),
  }
}

export const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user' as const,
  emailVerified: true,
  twoFactorEnabled: false,
  banned: false,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockAdminUser = {
  ...mockUser,
  id: 'admin-user-id',
  email: 'admin@example.com',
  name: 'Admin User',
  role: 'admin' as const,
}

export const mockSession = {
  session: {
    id: 'test-session-id',
    userId: mockUser.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    token: 'test-session-token',
  },
  user: mockUser,
}

export const mockAdminSession = {
  session: {
    id: 'admin-session-id',
    userId: mockAdminUser.id,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    token: 'admin-session-token',
  },
  user: mockAdminUser,
}
