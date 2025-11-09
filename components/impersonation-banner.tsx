"use client"

import { useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { toast } from "sonner"

export function ImpersonationBanner() {
  const { data: session } = authClient.useSession()
  const [stopping, setStopping] = useState(false)

  if (!session?.session?.impersonatedBy) {
    return null
  }

  const handleStopImpersonation = async () => {
    try {
      setStopping(true)
      await authClient.admin.stopImpersonating()
      toast.success("Stopped impersonating user")
      window.location.href = "/admin"
    } catch (error) {
      toast.error("Failed to stop impersonation")
      console.error(error)
      setStopping(false)
    }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-purple-600 dark:bg-purple-700 text-white px-4 py-2 shadow-lg border-b-2 border-purple-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-bold">⚠️ WARNING:</span>
            <span className="font-medium">
              You are currently in admin mode impersonating: <span className="font-bold">{session.user.name}</span> <span className="opacity-90">({session.user.email})</span>
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleStopImpersonation}
          disabled={stopping}
          className="gap-2 bg-white text-purple-700 hover:bg-purple-50 font-semibold flex-shrink-0 h-7 text-xs"
        >
          <X className="h-3 w-3" />
          {stopping ? "Stopping..." : "Stop Impersonating"}
        </Button>
      </div>
    </div>
  )
}
