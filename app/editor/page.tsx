import { Suspense } from "react"
import type { Metadata } from "next"
import { EditorNav } from "@/components/editor-nav"
import { TextRewriter } from "@/components/text-rewriter"
import { AuthToast } from "@/components/auth-toast"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export const metadata: Metadata = {
  title: "AI Text Rewriter",
  description: "Rewrite and improve your text with AI while keeping sensitive information private. Mark confidential data, and it never leaves your browser. Perfect for professionals handling sensitive documents.",
  openGraph: {
    title: "AI Text Rewriter | Masqify",
    description: "Rewrite and improve your text with AI while keeping sensitive information private.",
    type: "website",
  },
  alternates: {
    canonical: '/editor',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function EditorPage() {
  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset>
        <Suspense fallback={null}>
          <AuthToast />
        </Suspense>
        <EditorNav />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">
              AI Text Rewriter
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Mark sensitive information, then let AI improve your text while keeping your data private.
            </p>
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded border border-blue-200 dark:border-blue-900">
              <p className="text-xs text-muted-foreground">
                <strong>🔒 Privacy First:</strong> Your sensitive data is masked in your browser before being sent to AI.
                Learn more about{" "}
                <a href="/security" className="text-primary underline font-medium">how we protect your data</a>
                {" "}or review our{" "}
                <a href="https://github.com/SanderVreeken/masqify" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">open-source code</a>.
              </p>
            </div>
          </div>
          <TextRewriter />
        </div>
      </SidebarInset>
      <AppSidebar side="right" variant="inset" />
    </SidebarProvider>
  )
}
