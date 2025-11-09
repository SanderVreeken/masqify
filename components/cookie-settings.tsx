"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { SidebarMenuButton } from "./ui/sidebar"
import { Cookie } from "lucide-react"

export function CookieSettings() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <Cookie className="h-4 w-4" />
          <span>Cookie Information</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Cookie Information</DialogTitle>
          <DialogDescription>
            Information about the cookies we use on this website.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold">Essential Cookies</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Required for authentication, security, and basic website functionality
                </p>
              </div>
              <div className="text-xs font-medium text-green-600">Always On</div>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1 pl-4 mt-2">
              <li>• Authentication session cookies</li>
              <li>• Cookie consent preferences</li>
              <li>• Security tokens (CSRF protection)</li>
            </ul>
          </div>

          <div className="space-y-2 pt-4 border-t">
            <p className="text-sm font-semibold text-green-600">No Analytics or Tracking</p>
            <p className="text-xs text-muted-foreground">
              We do not use any analytics, tracking, or advertising cookies. Your browsing activity is not monitored or shared with third parties.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
