/**
 * Shared types for Server Actions
 */

/**
 * Standard action result type for authentication actions
 */
export type ActionResult<T = void> =
  | { success: true; message: string; data?: T }
  | { success: false; error: string; field?: string }
