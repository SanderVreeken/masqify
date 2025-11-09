export function ChangeEmailVerification(userName: string | undefined, newEmail: string, verificationUrl: string): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif; background-color: #ffffff;">
      <!-- Header -->
      <div style="padding: 40px 32px 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <div style="margin-bottom: 16px;">
          <img src="${process.env.NEXT_PUBLIC_APP_URL || 'https://rewrite.sandervreeken.com'}/masqify-logo.svg" alt="Masqify" width="48" height="48" style="display: inline-block;"/>
        </div>
        <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Masqify</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px;">Your Story, Securely Told</p>
      </div>

      <!-- Main content -->
      <div style="padding: 40px 32px;">
        <h2 style="color: #111827; font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">Verify Your New Email</h2>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Hi <strong>${userName || 'there'}</strong>,
        </p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          We received a request to change your email address to:
        </p>

        <div style="padding: 16px; background-color: #f9fafb; border-radius: 6px; margin: 0 0 24px 0; border: 1px solid #e5e7eb;">
          <p style="color: #111827; font-size: 16px; font-weight: 600; margin: 0; font-family: monospace;">
            ${newEmail}
          </p>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
          To complete this change, please verify your new email address by clicking the button below.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}"
             style="background-color: #111827; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
            Verify New Email
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

        <!-- Security notice -->
        <div style="margin-top: 32px; padding: 16px; background-color: #fef9c3; border-radius: 6px; border: 1px solid #fde047;">
          <p style="color: #854d0e; font-size: 14px; line-height: 1.5; margin: 0;">
            <strong>Security Notice:</strong> This verification link will expire in 1 hour.
          </p>
        </div>

        <!-- Footer note -->
        <p style="color: #9ca3af; font-size: 13px; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          If you didn't request an email change, please contact support immediately. Your current email address will remain unchanged.
        </p>
      </div>

      <!-- Email footer -->
      <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Masqify. All rights reserved.</p>
      </div>
    </div>
  `;
}
