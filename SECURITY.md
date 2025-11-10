# Security Policy

## 🔒 Our Security Commitment

Masqify is built with privacy and security as core principles. This document outlines our security practices, how to report vulnerabilities, and what users can expect from our security architecture.

## 🛡️ Security Architecture Overview

### Privacy-First Design

Masqify implements a **zero-knowledge architecture** where sensitive user data never leaves the browser:

1. **Client-Side Sanitization** - Sensitive data is replaced with placeholders in the browser before any network transmission
2. **No Text Storage** - Input and output text is never stored in our database
3. **Minimal Logging** - Error logs are sanitized to exclude any user input
4. **No Analytics** - Zero tracking, analytics, or behavioral monitoring services

### Verifiable Security

All security claims can be independently verified by reviewing our open-source codebase:

| Security Feature | Source Code Location |
|-----------------|---------------------|
| Client-side sanitization | [components/text-rewriter.tsx:86-95](components/text-rewriter.tsx#L86-L95) |
| Placeholder transmission | [components/text-rewriter.tsx:105](components/text-rewriter.tsx#L105) |
| Server-side processing | [app/api/rewrite/route.ts:94-108](app/api/rewrite/route.ts#L94-L108) |
| Database schema (no text storage) | [lib/db/schema.ts](lib/db/schema.ts) |
| Error sanitization | [app/api/rewrite/route.ts:164-165](app/api/rewrite/route.ts#L164-L165) |
| Sentry configuration | [instrumentation-client.ts](instrumentation-client.ts) |
| Rate limiting | [lib/rate-limit.ts](lib/rate-limit.ts) |

## 🔐 Security Measures

### Application Security

- ✅ **HTTPS-Only** - All connections encrypted with TLS
- ✅ **CSRF Protection** - HTTP-only cookies with SameSite attributes
- ✅ **SQL Injection Prevention** - Drizzle ORM with parameterized queries
- ✅ **Rate Limiting** - 20 requests/hour per user on sensitive endpoints
- ✅ **Input Validation** - Server-side validation on all inputs
- ✅ **Password Security** - Bcrypt hashing with secure salting
- ✅ **Two-Factor Authentication** - Optional TOTP-based 2FA

### Data Protection

- ✅ **No Text Storage** - Text content never persisted to database
- ✅ **Metadata Only** - Only character counts, token usage, and timestamps stored
- ✅ **Error Sanitization** - User input filtered from all error logs
- ✅ **Sentry Configuration** - Error tracking sanitized (no user data, no stack vars, no breadcrumbs with input)
- ✅ **No Session Recording** - Session replay and keystroke logging disabled
- ✅ **No Analytics** - Zero third-party tracking or analytics services

### Third-Party Service Security

| Service | Purpose | Data Sent | Security Measures |
|---------|---------|-----------|-------------------|
| **OpenAI** | AI text processing | Sanitized text with placeholders only | Never receives original sensitive data |
| **Stripe** | Payment processing | Payment data only | PCI-compliant, no user text data |
| **Resend** | Email delivery | Account emails only | No text processing data |
| **Sentry** | Error tracking | Sanitized errors only | Configured to filter all user input |

## 📊 Supported Versions

We provide security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## 🚨 Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue, please report it responsibly.

### How to Report

**For security vulnerabilities, please email:** security@masqify.io

**Do NOT open a public GitHub issue for security vulnerabilities.**

### What to Include

Please include the following information in your report:

1. **Description** - A clear description of the vulnerability
2. **Impact** - Potential security impact and affected users
3. **Reproduction Steps** - Detailed steps to reproduce the issue
4. **Proof of Concept** - If applicable, include a PoC or example
5. **Suggested Fix** - If you have ideas for remediation
6. **Contact Info** - How we can reach you for follow-up

### Response Timeline

- **Initial Response**: Within 48 hours
- **Triage**: Within 7 days
- **Resolution**: Depends on severity (critical issues prioritized)
- **Disclosure**: After fix is deployed and users have time to update

### Responsible Disclosure

We request that you:

- ✅ Give us reasonable time to fix the issue before public disclosure
- ✅ Avoid exploiting the vulnerability beyond what's necessary to demonstrate it
- ✅ Do not access or modify user data without permission
- ✅ Do not perform DoS attacks or disrupt service availability

### Scope

**In Scope:**
- Authentication and authorization bypass
- Data leakage or privacy violations
- SQL injection, XSS, CSRF vulnerabilities
- Server-side code execution
- Sensitive data exposure
- Rate limiting bypass

**Out of Scope:**
- Social engineering attacks
- Physical security issues
- Denial of Service (DoS/DDoS) attacks
- Vulnerabilities in third-party services (report to them directly)
- Issues that require unlikely user interaction
- Browser-specific issues not affecting core security

## 🏆 Security Researcher Recognition

We appreciate security researchers who help keep Masqify secure. With your permission, we will:

- Acknowledge your contribution in our release notes (if desired)
- List your name on our security acknowledgments page (if desired)
- Provide a detailed response and timeline for fixes

## 🔍 Security Best Practices for Users

### Account Security

1. **Enable Two-Factor Authentication (2FA)** - Add an extra layer of security
2. **Use Strong Passwords** - Minimum 8 characters with complexity
3. **Don't Share Credentials** - Keep your account credentials private
4. **Monitor Account Activity** - Review transaction history regularly

### Data Security

1. **Review Marked Data** - Double-check what you've marked as sensitive
2. **Understand the Architecture** - Read our [security page](https://masqify.io/security)
3. **Use Professional Judgment** - Decide if AI assistance is appropriate for your use case
4. **Verify Source Code** - Review our open-source implementation

## 📜 Security Audit History

| Date | Type | Conducted By | Findings |
|------|------|--------------|----------|
| 2025-01 | Internal Security Review | Masqify Team | No critical issues found |

## 🔄 Security Updates

Security updates are released as needed. Users are notified via:

- Email notifications for critical security updates
- Release notes on GitHub
- In-app notifications for important security patches

## 📖 Additional Resources

- **Privacy Policy**: [https://masqify.io/privacy](https://masqify.io/privacy)
- **Security Architecture**: [https://masqify.io/security](https://masqify.io/security)
- **Terms of Service**: [https://masqify.io/terms](https://masqify.io/terms)
- **GitHub Repository**: [https://github.com/SanderVreeken/masqify](https://github.com/SanderVreeken/masqify)

## 📞 Contact

- **Security Issues**: security@masqify.io
- **General Support**: Available through the platform
- **GitHub Issues**: [Report non-security bugs](https://github.com/SanderVreeken/masqify/issues)

---

**Last Updated**: January 2025

**Note**: This security policy applies to the Masqify application hosted at masqify.io and the open-source codebase. Third-party deployments or forks may have different security policies.
