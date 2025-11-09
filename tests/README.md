# Testing Documentation

This project uses **Vitest** for unit/integration tests and **Playwright** for E2E tests.

## Test Structure

```
tests/
├── setup.ts                    # Test environment setup
├── helpers/                    # Test utilities and mock helpers
│   └── db-helpers.ts          # Database mocking utilities
├── unit/                      # Unit tests
│   ├── balance.test.ts        # Balance calculation tests
│   ├── auth-validation.test.ts # Auth validation tests
│   ├── webhook-validation.test.ts # Stripe webhook tests
│   ├── api-validation.test.ts # API endpoint tests
│   └── admin-validation.test.ts # Admin function tests
└── e2e/                       # End-to-end tests
    └── user-journey.spec.ts   # Complete user flow tests
```

## Running Tests

### Unit Tests
```bash
# Run unit tests in watch mode
npm test

# Run unit tests once
npm run test:unit

# Run with UI
npm run test:ui

# Run with coverage
npm run test:coverage
```

### E2E Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### All Tests
```bash
# Run all tests (unit + E2E)
npm run test:all
```

## Test Coverage

Current test coverage includes:

### ✅ Balance Calculations (12 tests)
- Cost calculation with 6x markup
- Support for multiple OpenAI models (gpt-4o, gpt-4o-mini, gpt-4-turbo, gpt-3.5-turbo)
- Precision handling (6 decimal places)
- Edge cases (zero tokens, large numbers, microtransactions)

### ✅ Auth Validation (17 tests)
- Registration schema validation
- Password strength requirements (8+ chars, uppercase, lowercase, number)
- Email format validation
- Password confirmation matching
- Edge cases for name length and special characters

### ✅ Webhook Validation (20 tests)
- Payment metadata validation
- Idempotency checks (duplicate payment prevention)
- Event type handling (checkout.session.completed, async payments)
- Amount parsing edge cases
- Session metadata extraction

### ✅ API Validation (29 tests)
- Request validation for /api/rewrite
- Balance sufficiency checks
- Token usage calculations
- Response structure validation
- User authentication and ban checks
- Error response formats (401, 402, 403, 500)

### ✅ Admin Validation (31 tests)
- Role-based access control
- Balance adjustment validation (positive/negative amounts)
- Negative balance prevention
- Transaction metadata tracking
- User ban/unban validation
- Admin response validation

### ✅ E2E Tests (Multiple scenarios)
- Landing page and public pages
- Login/registration flows
- Password reset flow
- Protected page access control
- Form validation
- Responsive design (mobile, tablet, desktop)
- Performance checks

## Test Environment

Tests run with:
- **Node.js**: 20.9.0+
- **Vitest**: 4.0.7
- **Playwright**: 1.56.1
- **Testing Library**: React 16.3.0
- **jsdom**: 27.1.0 (for DOM simulation)

## Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect } from 'vitest'

describe('Feature Name', () => {
  it('should do something', () => {
    const result = myFunction()
    expect(result).toBe(expected)
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test('should perform user action', async ({ page }) => {
  await page.goto('/page')
  await page.click('button')
  await expect(page.locator('selector')).toBeVisible()
})
```

## Continuous Integration

Tests should be run in CI/CD pipeline:

```yaml
# Example GitHub Actions
- name: Run tests
  run: |
    npm run test:unit
    npm run test:e2e
```

## Critical Test Areas

When making changes, ensure these areas have test coverage:

1. **Payment Flow**: Balance updates, transaction records, Stripe webhooks
2. **Cost Calculations**: Precision, markup, multiple models
3. **Authentication**: Password validation, email verification, 2FA
4. **Balance Management**: Deductions, additions, negative prevention
5. **Admin Functions**: Access control, balance adjustments, bans

## Debugging Tests

### Debug Unit Tests
```bash
# Run specific test file
npm test balance.test.ts

# Run with verbose output
npm test -- --reporter=verbose

# Run with UI for debugging
npm run test:ui
```

### Debug E2E Tests
```bash
# Run with Playwright UI
npm run test:e2e:ui

# Run with headed browser
npx playwright test --headed

# Run specific test
npx playwright test user-journey.spec.ts
```

## Coverage Goals

- **Unit Tests**: Aim for 80%+ code coverage
- **Critical Paths**: 100% coverage (payments, auth, balance)
- **E2E Tests**: Cover main user journeys

## Future Improvements

- [ ] Add integration tests with test database
- [ ] Add API mocking with MSW for isolated tests
- [ ] Add visual regression tests
- [ ] Add performance benchmarks
- [ ] Add load testing for API endpoints
