import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Replicate the registration schema for testing
const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

describe('Auth Validation', () => {
  describe('Registration Schema', () => {
    it('should accept valid registration data', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it('should reject empty name', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Name is required')
    })

    it('should reject name longer than 100 characters', () => {
      const invalidData = {
        name: 'a'.repeat(101),
        email: 'test@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Name is too long')
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'Test User',
        email: 'not-an-email',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Invalid email address')
    })

    it('should reject password shorter than 8 characters', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Short1',
        confirmPassword: 'Short1',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Password must be at least 8 characters')
    })

    it('should reject password without uppercase letter', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'lowercase123',
        confirmPassword: 'lowercase123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Password must contain at least one uppercase letter')
    })

    it('should reject password without lowercase letter', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'UPPERCASE123',
        confirmPassword: 'UPPERCASE123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Password must contain at least one lowercase letter')
    })

    it('should reject password without number', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'NoNumbersHere',
        confirmPassword: 'NoNumbersHere',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Password must contain at least one number')
    })

    it('should reject mismatched passwords', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecurePass123',
        confirmPassword: 'DifferentPass456',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Passwords do not match')
    })

    it('should accept special characters in password', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'SecureP@ss123!',
        confirmPassword: 'SecureP@ss123!',
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it('should accept various email formats', () => {
      const emails = [
        'user@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'user123@subdomain.example.com',
      ]

      emails.forEach((email) => {
        const validData = {
          name: 'Test User',
          email,
          password: 'SecurePass123',
          confirmPassword: 'SecurePass123',
        }

        expect(() => registerSchema.parse(validData)).not.toThrow()
      })
    })

    it('should reject common weak passwords', () => {
      const weakPasswords = [
        'password',
        'Password',
        'PASSWORD',
        '12345678',
        'abc12345',
      ]

      weakPasswords.forEach((password) => {
        const data = {
          name: 'Test User',
          email: 'test@example.com',
          password,
          confirmPassword: password,
        }

        // At least one of these should fail the validation
        const result = registerSchema.safeParse(data)
        expect(result.success).toBe(false)
      })
    })

    it('should handle edge case: exactly 8 characters with valid format', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Secure1!',
        confirmPassword: 'Secure1!',
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it('should handle edge case: exactly 100 character name', () => {
      const validData = {
        name: 'a'.repeat(100),
        email: 'test@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })
  })

  describe('Email validation edge cases', () => {
    it('should reject email without @ symbol', () => {
      const invalidData = {
        name: 'Test User',
        email: 'testexample.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Invalid email address')
    })

    it('should reject email without domain', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Invalid email address')
    })

    it('should reject email without local part', () => {
      const invalidData = {
        name: 'Test User',
        email: '@example.com',
        password: 'SecurePass123',
        confirmPassword: 'SecurePass123',
      }

      expect(() => registerSchema.parse(invalidData)).toThrow('Invalid email address')
    })
  })
})
