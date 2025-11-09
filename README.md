<div align="center">
  <img src="public/masqify-logo.svg" alt="Masqify Logo" width="200"/>

  # Masqify

  ### Your Story, Securely Told

  [![License](https://img.shields.io/badge/license-Proprietary-blue.svg)](LICENSE)
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

| Guarantee | Status |
|-----------|--------|
| Sensitive data never leaves your browser | ✅ Verified |
| Only sanitized placeholders sent to servers | ✅ Verified |
| No text content stored permanently | ✅ Verified |
| No analytics or tracking services | ✅ Verified |
| No session recordings or keystroke logging | ✅ Verified |
| Sentry configured to filter all user input | ✅ Verified |
| OpenAI only sees generic placeholders | ✅ Verified |

### Security Features

- 🔒 HTTPS-only connections
- 🔑 Secure session management with CSRF protection
- ⏱️ Rate limiting on authentication endpoints
- 🛡️ Two-factor authentication (2FA) support
- 🚫 Account ban functionality
- 🔐 Industry-standard password hashing (bcrypt)

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

This source code is available for **transparency and verification purposes only**.

**Not licensed for redistribution or commercial use.** See [Terms of Service](https://masqify.io/terms) for details.

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
  <sub>Version 0.1.2 | Made with ❤️ by Sander Vreeken</sub>
</div>
