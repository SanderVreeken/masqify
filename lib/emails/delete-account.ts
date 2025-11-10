export function DeleteAccountEmailText(userName: string | undefined, confirmationUrl: string, balance: number): string {
  return `
Hi ${userName || 'there'},

You have requested to permanently delete your Masqify account. This action cannot be undone.

${balance > 0 ? `IMPORTANT: You will lose your account balance

Your current account balance is $${balance.toFixed(2)}. This balance will be permanently forfeited and cannot be refunded or recovered if you proceed with account deletion.

` : ''}What will be deleted:
- Your profile information and settings
- Your rewrite history
- Your transaction history${balance > 0 ? `
- Your account balance ($${balance.toFixed(2)})` : ''}
- All connected accounts (Google, etc.)
- Your active sessions

If you're sure you want to proceed, click the link below to confirm account deletion:

${confirmationUrl}

If you didn't request account deletion, please ignore this email. Your account will remain active. This link will expire in 24 hours.

© ${new Date().getFullYear()} Masqify. All rights reserved.
  `.trim();
}

export function DeleteAccountEmail(userName: string | undefined, confirmationUrl: string, balance: number): string {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Inter', system-ui, sans-serif; background-color: #ffffff;">
      <!-- Header -->
      <div style="padding: 40px 32px 32px; text-align: center; border-bottom: 1px solid #e5e7eb;">
        <div style="margin-bottom: 16px;">
          <img src="https://masqify.io/masqify-logo.svg" alt="Masqify" width="48" height="48" style="display: inline-block;"/>
        </div>
        <h1 style="color: #111827; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">Masqify</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px;">Your Story, Securely Told</p>
      </div>

      <!-- Main content -->
      <div style="padding: 40px 32px;">
        <h2 style="color: #dc2626; font-size: 20px; font-weight: 600; margin: 0 0 24px 0;">Confirm Account Deletion</h2>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          Hi ${userName || 'there'},
        </p>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">
          You have requested to permanently delete your Masqify account. This action cannot be undone.
        </p>

        ${balance > 0 ? `
        <div style="margin: 24px 0; padding: 16px; background-color: #fef2f2; border-left: 4px solid #dc2626; border-radius: 6px;">
          <p style="color: #991b1b; font-size: 14px; font-weight: 600; margin: 0 0 8px 0;">
            Important: You will lose your account balance
          </p>
          <p style="color: #7f1d1d; font-size: 14px; line-height: 1.5; margin: 0;">
            Your current account balance is $${balance.toFixed(2)}. This balance will be permanently forfeited and cannot be refunded or recovered if you proceed with account deletion.
          </p>
        </div>
        ` : ''}

        <div style="margin: 24px 0; padding: 16px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
          <p style="color: #374151; font-size: 14px; font-weight: 600; margin: 0 0 12px 0;">
            What will be deleted:
          </p>
          <ul style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
            <li>Your profile information and settings</li>
            <li>Your rewrite history</li>
            <li>Your transaction history</li>
            ${balance > 0 ? '<li style="color: #dc2626; font-weight: 600;">Your account balance ($' + balance.toFixed(2) + ')</li>' : ''}
            <li>All connected accounts (Google, etc.)</li>
            <li>Your active sessions</li>
          </ul>
        </div>

        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 24px 0;">
          If you're sure you want to proceed, click the button below to confirm account deletion:
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${confirmationUrl}"
             style="background-color: #dc2626; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
            Confirm Account Deletion
          </a>
        </div>

        <!-- Alternative link -->
        <div style="margin-top: 32px; padding: 16px; background-color: #f9fafb; border-radius: 6px; border: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 8px 0;">
            If the button doesn't work, copy and paste this link:
          </p>
          <p style="color: #111827; font-size: 13px; word-break: break-all; margin: 0; font-family: monospace;">
            ${confirmationUrl}
          </p>
        </div>

        <!-- Footer note -->
        <p style="color: #9ca3af; font-size: 13px; margin-top: 40px; padding-top: 24px; border-top: 1px solid #e5e7eb;">
          If you didn't request account deletion, please ignore this email. Your account will remain active. This link will expire in 24 hours.
        </p>
      </div>

      <!-- Email footer -->
      <div style="text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0;">© ${new Date().getFullYear()} Masqify. All rights reserved.</p>
      </div>
    </div>
  `;
}
