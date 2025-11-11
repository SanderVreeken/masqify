<div align="center">
  <img src="public/masqify-logo.svg" alt="Masqify Logo" width="200"/>

  # Masqify

  ### Your Story, Securely Told

  [![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE.txt)
  [![Node.js](https://img.shields.io/badge/node-%3E%3D20.9.0-brightgreen.svg)](https://nodejs.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.0-black.svg)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

  [Website](https://masqify.io) • [Documentation](#documentation) • [Report Issue](https://github.com/SanderVreeken/masqify/issues)
</div>

---

## 📖 Overview

**Masqify** is a privacy-first AI writing assistant that ensures your sensitive information never leaves your browser. Unlike traditional AI tools, Masqify uses a unique **client-side masking architecture** to protect confidential data while transforming your narrative with the power of AI.

Perfect for professionals handling sensitive documents—lawyers, healthcare providers, financial advisors, and HR professionals who need AI assistance without compromising data privacy.

## ✨ Key Features

### 🔒 Privacy-First Architecture

| Feature | Description |
|---------|-------------|
| **Client-Side Protection** | Sensitive information is masked in your browser before transmission |
| **Zero-Knowledge Processing** | AI services only receive sanitized text with generic placeholders |
| **No Data Storage** | Text content (input and output) is never stored on servers |
| **No Tracking** | Zero analytics, tracking, or advertising services |

### 🛡️ How It Works

```mermaid
graph LR
    A[User Input] --> B[Mark Sensitive Data]
    B --> C[Client-Side Masking]
    C --> D[Send to API]
    D --> E[AI Processing]
    E --> F[Receive Response]
    F --> G[Client-Side Restoration]
    G --> H[Final Output]

    style C fill:#90EE90
    style G fill:#90EE90
    style D fill:#FFB6C1
```

1. **Mark Sensitive Data** → Users highlight confidential information (names, emails, addresses, etc.)
2. **Client-Side Sanitization** → Browser replaces marked data with placeholders like `[REDACTED-1]`
3. **AI Processing** → Only sanitized text is sent to OpenAI's API for rewriting
4. **Client-Side Restoration** → After processing, sensitive data is restored in your browser

**Your actual confidential information never leaves your device.**

### ✅ Verifiable Privacy

This is an **open-source** project. All privacy claims can be independently verified by reviewing the codebase.

**Key Files to Review:**
- [`components/text-input.tsx`](components/text-input.tsx) - Client-side marking interface
- [`components/text-rewriter.tsx`](components/text-rewriter.tsx) - Sanitization and restoration logic
- [`app/api/rewrite/route.ts`](app/api/rewrite/route.ts) - Server endpoint (only receives placeholders)

## 🎯 Perfect For

<table>
<tr>
<td width="50%">

**Legal Professionals**
> "I need to rewrite a client email but can't share their names and case numbers with AI."

Rewrite legal documents without exposing client information.

</td>
<td width="50%">

**Healthcare Providers**
> "I want to improve a patient letter without exposing protected health information."

Improve medical correspondence while protecting patient data.

</td>
</tr>
<tr>
<td width="50%">

**Financial Advisors**
> "I need to polish a report but account numbers must stay confidential."

Polish financial reports without sharing sensitive account details.

</td>
<td width="50%">

**HR Professionals**

Refine employee communications while maintaining confidentiality and GDPR compliance.

</td>
</tr>
</table>

## 🛠️ Technology Stack

<table>
<tr>
<td width="50%" valign="top">

**Frontend**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- Radix UI
- Framer Motion

</td>
<td width="50%" valign="top">

**Backend & Services**
- PostgreSQL + Drizzle ORM
- Better Auth (2FA support)
- OpenAI API
- Stripe Payments
- Resend (Email)
- Sentry (Error tracking)

</td>
</tr>
</table>

## 🔐 Privacy & Security Guarantees

### Privacy Commitments

| Guarantee | Status | Verification |
|-----------|--------|--------------|
| Sensitive data never leaves your browser | ✅ Verified | [text-rewriter.tsx:86-95](components/text-rewriter.tsx#L86-L95) |
| Only sanitized placeholders sent to servers | ✅ Verified | [text-rewriter.tsx:105](components/text-rewriter.tsx#L105) |
| No text content stored permanently | ✅ Verified | [rewrite/route.ts:189-199](app/api/rewrite/route.ts#L189-L199) |
| No analytics or tracking services | ✅ Verified | No analytics code found |
| No session recordings or keystroke logging | ✅ Verified | [sentry config](instrumentation-client.ts#L12) |
| Sentry configured to filter all user input | ✅ Verified | [beforeSend hooks](instrumentation-client.ts#L28-L76) |
| OpenAI only sees generic placeholders | ✅ Verified | [rewrite/route.ts:94-108](app/api/rewrite/route.ts#L94-L108) |
| No telemetry or data collection | ✅ Verified | Next.js telemetry disabled |

### Security Features

- 🔒 **HTTPS-only connections** - All data in transit is encrypted
- 🔑 **Secure session management** - HTTP-only cookies with CSRF protection
- ⏱️ **Rate limiting** - 20 requests/hour per user to prevent abuse ([rewrite/route.ts:44-73](app/api/rewrite/route.ts#L44-L73))
- 🛡️ **Two-factor authentication (2FA)** - Optional TOTP-based 2FA support
- 🚫 **Account ban functionality** - Admin controls for security
- 🔐 **Password security** - Bcrypt hashing with secure salting
- 🗄️ **SQL injection protection** - Drizzle ORM with parameterized queries
- 🚨 **Error sanitization** - No user data in error logs ([rewrite/route.ts:164-165](app/api/rewrite/route.ts#L164-L165))
- 🎯 **Input validation** - Server-side validation on all inputs
- 🔍 **Security headers** - CORS, CSP, and other security headers configured

### Security Architecture Deep Dive

<details>
<summary><strong>🔒 How We Protect Your Data (Click to Expand)</strong></summary>

#### Client-Side Protection Layer

**1. Sanitization Process** ([text-rewriter.tsx:86-95](components/text-rewriter.tsx#L86-L95))
```typescript
// User marks sensitive data, browser replaces with placeholders
let sanitized = text
for (const item of sortedItems) {
  sanitized = sanitized.slice(0, item.startIndex) +
              item.placeholder +
              sanitized.slice(item.endIndex)
}
// Result: "Contact [REDACTED-1] at [REDACTED-2]"
```

**2. Network Transmission** ([text-rewriter.tsx:105](components/text-rewriter.tsx#L105))
```typescript
// ONLY sanitized text is sent
fetch("/api/rewrite", {
  body: JSON.stringify({ text: sanitizedText })  // No original data!
})
```

**3. Response Restoration** ([text-rewriter.tsx:146-150](components/text-rewriter.tsx#L146-L150))
```typescript
// Client-side restoration of original data
let final = data.text
for (const item of sensitiveItems) {
  final = final.replaceAll(item.placeholder, item.text)
}
```

#### Server-Side Protection Layer

**No Text Storage** ([lib/balance.ts:189-199](lib/balance.ts#L189-L199))
```typescript
// Database stores ONLY metadata, never text content
await db.insert(rewrite).values({
  inputLength,     // Character count only
  outputLength,    // Character count only
  tokensUsed,      // Token count only
  totalCost,       // Cost only
  metadata: { inputTokens, outputTokens }  // Technical data only
  // NO text field - content is never stored!
})
```

**Error Sanitization** ([rewrite/route.ts:164-165](app/api/rewrite/route.ts#L164-L165))
```typescript
// Errors logged without user text
console.error("Error:", error instanceof Error ?
  error.constructor.name :  // Type only
  "Unknown error")          // No user data!
```

**Rate Limiting** ([rewrite/route.ts:44-73](app/api/rewrite/route.ts#L44-L73))
```typescript
// 20 requests per hour per user/IP
const rateLimitResult = await checkRateLimit({
  endpoint: '/api/rewrite',
  limit: 20,
  windowSeconds: 3600
}, session.user.id, clientIp)
```

#### Third-Party Service Protection

**Sentry (Error Tracking)** - Configured to filter all user input:
- ✅ Stack trace variables removed ([instrumentation-client.ts:61-73](instrumentation-client.ts#L61-L73))
- ✅ Request data stripped ([instrumentation-client.ts:42-47](instrumentation-client.ts#L42-L47))
- ✅ Breadcrumbs sanitized ([instrumentation-client.ts:106-122](instrumentation-client.ts#L106-L122))
- ✅ Transaction data cleaned ([instrumentation-client.ts:78-103](instrumentation-client.ts#L78-L103))

**OpenAI API** - Only receives placeholder text:
- ✅ System prompt preserves placeholders ([rewrite/route.ts:98-100](app/api/rewrite/route.ts#L98-L100))
- ✅ Server forwards sanitized text only ([rewrite/route.ts:94-108](app/api/rewrite/route.ts#L94-L108))
- ✅ No access to original sensitive data

**Stripe (Payments)** - Completely separate from text processing:
- ✅ No user text data sent to Stripe
- ✅ Only payment metadata transmitted
- ✅ PCI-compliant handling

</details>

### Independent Verification

All security claims can be verified by reviewing the source code. Key security-critical files:

| Component | File | Purpose |
|-----------|------|---------|
| Client Sanitization | [components/text-rewriter.tsx](components/text-rewriter.tsx) | Masks data before transmission |
| Server API | [app/api/rewrite/route.ts](app/api/rewrite/route.ts) | Processes only placeholders |
| Database Schema | [lib/db/schema.ts](lib/db/schema.ts) | No text storage fields |
| Error Tracking Config | [instrumentation-client.ts](instrumentation-client.ts) | Sentry data filtering |
| Rate Limiting | [lib/rate-limit.ts](lib/rate-limit.ts) | Abuse prevention |

## 🚀 Getting Started

### For Users

1. **Visit** [masqify.io](https://masqify.io)
2. **Create** a free account
3. **Add funds** to your balance
4. **Start rewriting** with complete privacy

### For Developers

#### Prerequisites

- Node.js >= 20.9.0
- PostgreSQL database
- API keys (OpenAI, Stripe, Resend)

#### Installation

```bash
# Clone the repository
git clone https://github.com/SanderVreeken/masqify.git
cd masqify

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

#### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run test         # Run all tests
npm run test:unit    # Run unit tests
npm run test:e2e     # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/masqify

# Authentication
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# OpenAI
OPENAI_API_KEY=sk-your-openai-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-stripe-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
STRIPE_PUBLISHABLE_KEY=pk_test_your-publishable-key

# Email
RESEND_API_KEY=re_your-resend-key

# Sentry (Optional)
SENTRY_DSN=your-sentry-dsn
```

## 📚 Documentation

- **[Privacy Policy](https://masqify.io/privacy)** - Detailed privacy architecture explanation
- **[Terms of Service](https://masqify.io/terms)** - Clear terms with privacy guarantees
- **[Architecture Guide](docs/ARCHITECTURE.md)** - Technical implementation details
- **[Contributing Guide](CONTRIBUTING.md)** - How to contribute to the project

## 🤝 Contributing

While this project is open-source for transparency, contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the **GNU Affero General Public License v3.0 or later (AGPL-3.0-or-later)**.

This means:
- ✅ You can use, modify, and distribute this software
- ✅ The code is open source for transparency and trust
- ⚖️ If you modify and deploy this as a service, you **must** release your source code under AGPL-3.0
- 🔒 This protects against commercial exploitation while keeping the project open

See [LICENSE.txt](LICENSE.txt) for the full license text.

## 👤 Author

**Sander Vreeken**

- Website: [masqify.io](https://masqify.io)
- GitHub: [@SanderVreeken](https://github.com/SanderVreeken)

## 🐛 Support & Issues

- **Found a bug?** [Open an issue](https://github.com/SanderVreeken/masqify/issues)
- **Have a question?** Contact us through the platform
- **Security concern?** Please email security@masqify.io

## 🙏 Acknowledgments

- OpenAI for powering the AI rewriting capabilities
- The open-source community for the amazing tools and libraries
- All users who trust us with their privacy

---

<div align="center">
  <strong>Built with privacy in mind 🔒</strong>
  <br><br>
  <sub>Version 0.1.13 | Made with ❤️ by Sander Vreeken</sub>
</div>
