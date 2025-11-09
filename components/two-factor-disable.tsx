"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertTriangle,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

interface TwoFactorDisableProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TwoFactorDisable({ open, onOpenChange, onSuccess }: TwoFactorDisableProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      toast.error("Please enter your password")
      return
    }

    setIsLoading(true)
    try {
      const response = await authClient.twoFactor.disable({
        password,
      })

      if (response.error) {
        toast.error(response.error.message || "Failed to disable 2FA")
        setIsLoading(false)
        return
      }

      toast.success("2FA disabled successfully")
      onSuccess()
      onOpenChange(false)
      setPassword("")
    } catch (error) {
      toast.error("Failed to disable 2FA")
      console.error("2FA disable error:", error)
    }
    setIsLoading(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setPassword("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Disable Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to disable 2FA? This will make your account less secure.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-orange-800 dark:text-orange-200">
                Security Warning
              </p>
              <p className="text-orange-700 dark:text-orange-300 mt-1">
                Disabling 2FA will remove an important security layer from your account.
                Your account will only be protected by your password.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleDisable2FA} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="disable-password">Confirm your password</Label>
            <div className="relative">
              <Input
                id="disable-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading}
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}