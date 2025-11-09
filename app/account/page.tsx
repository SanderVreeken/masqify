"use client"

import { Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import { AccountSettingsForm } from "@/components/account-settings-form"
import { AuthToast } from "@/components/auth-toast"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { EditorNav } from "@/components/editor-nav"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AccountPage() {
  const { data: session, isPending } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?message=Please sign in to access your account settings")
    }
  }, [session, isPending, router])

  if (isPending) {
    return (
      <SidebarProvider defaultOpen={false}>
        <SidebarInset>
          <EditorNav />
          <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">
                Account Settings
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Loading account information...
              </p>
            </div>
          </div>
        </SidebarInset>
        <AppSidebar side="right" variant="inset" />
      </SidebarProvider>
    )
  }

  if (!session?.user) {
    return null // Will redirect via useEffect
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset>
        <Suspense fallback={null}>
          <AuthToast />
        </Suspense>
        <EditorNav />

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              Account Settings
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage your account information, security settings, and billing preferences.
            </p>
          </div>

          <AccountSettingsForm user={session.user} />
        </div>
      </SidebarInset>
      <AppSidebar side="right" variant="inset" />
    </SidebarProvider>
  )
}