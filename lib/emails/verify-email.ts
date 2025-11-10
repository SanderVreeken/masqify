export function VerifyEmailText(userName: string | undefined, verificationUrl: string): string {
  return `
Hi ${userName || 'there'},

Welcome to Masqify! Please verify your email address to complete your registration and start using the platform.

To verify your email, click the link below:

${verificationUrl}

If you didn't create a Masqify account, you can safely ignore this email.

© ${new Date().getFullYear()} Masqify. All rights reserved.
  `.trim();
}

export function VerifyEmail(userName: string | undefined, verificationUrl: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif; background-color: #ffffff;">
      <!-- Header -->
      <div style="padding: 40px 32px 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <div style="margin-bottom: 16px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://masqify.io'}/masqify-logo.svg" alt="Masqify" width="48" height="48" style="display: inline-block;"/>
        </div>
        <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Masqify</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px;">Your Story, Securely Told</p>
      </div>

      <!-- Main content -->
      <div style="padding: 40px 32px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">Verify Your Email</h2>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Hi <strong>${userName || 'there'}</strong>,
        </p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
          Welcome to Masqify! Please verify your email address to complete your registration and start using the platform.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}"
             style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
            Verify Email Address
          </a>
        </div>

        <!-- Alternative link -->
        <div style="margin-top: 32px; padding: 16px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0;">
            If the button doesn't work, copy and paste this link:
          </p>
          <p style="color: #111827; font-size: 13px; word-break: break-all; margin: 0; font-family: monospace;">
            ${verificationUrl}
          </p>
        </div>

        <!-- Footer note -->
        <p style="color: #9ca3af; font-size: 13px; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          If you didn't create a Masqify account, you can safely ignore this email.
        </p>
      </div>

      <!-- Email footer -->
      <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Masqify. All rights reserved.</p>
      </div>
    </div>
  `;
}