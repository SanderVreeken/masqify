import "server-only";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor, admin } from "better-auth/plugins";
import { Resend } from "resend";
import { db } from "./db";
import * as schema from "./db/auth-schema";
import { VerifyEmail, VerifyEmailText } from "./emails/verify-email";
import { ResetPasswordEmail, ResetPasswordEmailText } from "./emails/reset-password";

const resend = new Resend(process.env.RESEND_API_KEY);

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "https://masqify.io"
  ],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Masqify <hello@masqify.io>',
        to: user.email,
        subject: 'Verify your email address',
        html: VerifyEmail(user.name, url),
        text: VerifyEmailText(user.name, url),
      })
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    sendVerificationOnUpdate: true,
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: 'Masqify <hello@masqify.io>',
        to: user.email,
        subject: 'Reset your password',
        html: ResetPasswordEmail(user.name, url),
        text: ResetPasswordEmailText(user.name, url),
      })
    },
  },
  socialProviders: {
    google: { 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
    }, 
  },
  rateLimit: {
    window: 60, // 1 minute window
    max: 100, // max 100 requests per window
    storage: "database", // store rate limit data in database
  },
  advanced: {
    cookiePrefix: "better-auth",
  },
  plugins: [
    nextCookies(), // Required for Server Actions to set cookies automatically
    twoFactor({
      issuer: "Masqify", // App name for TOTP apps
    }),
    admin(), // Admin plugin for user management
  ],
});