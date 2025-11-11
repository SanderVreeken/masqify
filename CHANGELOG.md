# Changelog

All notable changes to Masqify will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.9] - 2025-11-11

### Changed
- Added spam folder warnings to all email-related success messages and notifications to help users locate emails from our new domain

## [0.1.8] - 2025-11-11

### Changed
- Updated email sender addresses from hello@masqify.io to hello@notifications.masqify.io for all notification emails
- Updated authentication emails (email verification, password reset)
- Updated account management emails (account deletion confirmation, email change verification)

## [0.1.7] - 2025-11-10

### Added
- **Comprehensive Security Documentation**
  - Created `/security` page with detailed architecture explanation and visual security flow
  - Created `SECURITY.md` GitHub security policy with responsible disclosure guidelines
  - Added security verification section in README.md with direct source code references
  - Added expandable "Security Architecture Deep Dive" section in README
  - Added security best practices documentation for users

- **Legal Protection & Disclaimers**
  - Added prominent security disclaimer at top of Privacy Policy (Section 1)
  - Enhanced Privacy Policy Section 11 with comprehensive liability limitations
  - Added critical security disclaimer banner in Terms of Service (Section 4)
  - Created new Terms Section 4.2: "No Security or Privacy Guarantees"
  - Created new Terms Section 4.4: "No Liability for Data Breaches or Security Issues"
  - Added realistic security disclaimer to /security page
  - Added user-friendly security notice on /editor page with educational focus

### Security
- **Enhanced Sentry Configuration**
  - Added `beforeSendTransaction` hooks to all three Sentry configs (client, server, edge)
  - Implemented stack trace variable sanitization to prevent local variable leakage
  - Added transaction name sanitization to remove query parameters
  - Removed sensitive tags (url, user) from performance data
  - Enhanced request data sanitization in transactions

- **Telemetry & Privacy**
  - Disabled Next.js telemetry completely (`NEXT_TELEMETRY_DISABLED=1` in .env)
  - Verified zero analytics or tracking services in codebase
  - Confirmed no external CDN dependencies
  - Validated localStorage only stores cookie consent (no user data)

- **Deep Security Audit**
  - Verified client-side sanitization is bulletproof (no data leakage paths)
  - Confirmed zero user text in all 45+ console.log statements
  - Validated error boundaries don't leak data
  - Verified API routes have proper authentication and rate limiting
  - Confirmed database schema has no text storage fields
  - Validated SQL injection protection via Drizzle ORM parameterized queries

### Changed
- Updated README.md with detailed security guarantees table including source code links
- Enhanced README with privacy commitments verification column
- Updated editor page security banner to be confidence-building instead of alarming (blue info box)
- Changed editor page messaging from warning to educational ("Privacy First" focus)
- Improved cross-referencing between legal pages (/security, /privacy, /terms, GitHub)

### Documentation
- Added code examples in README showing sanitization, transmission, and restoration flow
- Created independent verification section with key security-critical file references
- Added security researcher recognition program in SECURITY.md
- Documented supported versions and security update timeline
- Added comprehensive "what we store" vs "what we don't store" tables
- Created security audit history table in SECURITY.md

### Legal
- Established "best effort basis" legal positioning across all pages
- Implemented comprehensive liability cap ($100 or 12-month fees, whichever is less)
- Added explicit coverage for bugs, vulnerabilities, third-party breaches, and human error
- Created consistent disclaimer messaging across Privacy Policy, Terms, and Security pages
- Added transparency commitment with source code verification encouragement

## [0.1.6] - 2025-11-10

### Changed
- Added AGPL license to the project

## [0.1.5] - 2025-11-10

### Changed
- Added account deletion support
- Added email text support for clients that cannot read HTML

## [0.1.4] - 2025-11-09

### Changed
- Updated alpha to to beta banner

## [0.1.3] - 2025-11-09

### Changed
- Updated all branding from rewrite.sandervreeken.com to masqify.io
- Updated email sender addresses to hello@masqify.io for all Resend emails
- Updated GitHub repository references to github.com/SanderVreeken/masqify
- Updated Privacy Policy and Terms of Service with correct GitHub repository links
- Updated structured data, sitemap, and robots.txt with new domain
- Updated all email templates with new masqify.io domain

### Fixed
- GitHub Actions workflow authentication error (removed unnecessary token requirement)
- GitHub Actions git clone authentication using oauth2 protocol
- Email verification templates now reference correct domain
- Security email address updated to security@masqify.io

## [0.1.1] - 2025-11-09

### Added
- GitHub Actions workflow for automatic syncing to public repository
- Professional README.md with comprehensive documentation
- CHANGELOG.md for tracking version history
- Automated release creation with version tags

### Changed
- Enhanced README with visual elements, badges, and better organization
- Improved documentation structure for open-source transparency

## [0.1.0] - 2025-11-09

### Added
- Initial release of Masqify
- Privacy-first storytelling companion with client-side data protection
- Client-side sensitive data masking and restoration
- AI-powered text rewriting using OpenAI API
- User authentication with Better Auth and 2FA support
- Stripe payment integration for credit-based system
- PostgreSQL database with Drizzle ORM
- Email notifications via Resend
- Error tracking with Sentry (configured to filter user input)
- Comprehensive privacy guarantees and zero-knowledge architecture
- Open-source codebase for transparency and verification

### Security
- HTTPS-only connections
- Secure session management with CSRF protection
- Rate limiting on authentication endpoints
- Two-factor authentication support
- Password hashing with industry-standard algorithms
