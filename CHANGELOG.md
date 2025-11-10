# Changelog

All notable changes to Masqify will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
