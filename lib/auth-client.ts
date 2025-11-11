import { createAuthClient } from "better-auth/react";
import { twoFactorClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  fetchOptions: {
    credentials: "include",
  },
  plugins: [
    twoFactorClient(),
    adminClient(),
  ],
});
