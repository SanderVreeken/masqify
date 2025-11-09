import type { Metadata } from "next"
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
    nocache: true,
  },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Server-side check - block access before rendering
  if (!session?.user) {
    redirect("/login?message=Please sign in to access the admin panel");
  }

  if (session.user.role !== "admin") {
    redirect("/editor?message=Access denied. Admin privileges required.");
  }

  return <>{children}</>;
}
