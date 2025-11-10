"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Mail,
  Lock,
  Shield,
  Download,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Chrome,
  Link as LinkIcon,
  Trash2
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import { TwoFactorSetup } from "@/components/two-factor-setup"
import { TwoFactorDisable } from "@/components/two-factor-disable"
import { updateName, updatePassword, updateEmail } from "@/app/actions/update-profile"
import { initiateAccountDeletion } from "@/app/actions/delete-account"
import { getBalance } from "@/app/actions/balance"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface User {
  id: string
  name: string
  email: string
  emailVerified?: boolean
  image?: string | null
  createdAt?: Date
  twoFactorEnabled?: boolean | null
}

interface AccountSettingsFormProps {
  user: User
}

export function AccountSettingsForm({ user }: AccountSettingsFormProps) {
  const router = useRouter()
  const { data: session, refetch: refetchSession } = authClient.useSession()
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user?.twoFactorEnabled || false)
  const [isLoadingName, setIsLoadingName] = useState(false)
  const [isLoadingEmail, setIsLoadingEmail] = useState(false)
  const [isLoadingPassword, setIsLoadingPassword] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [setupDialogOpen, setSetupDialogOpen] = useState(false)
  const [disableDialogOpen, setDisableDialogOpen] = useState(false)
  const [hasPasswordAccount, setHasPasswordAccount] = useState(true)
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([])
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isLoadingDelete, setIsLoadingDelete] = useState(false)
  const [userBalance, setUserBalance] = useState<number>(0)

  // Form states
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(false)

  // Sync form fields with session data
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "")
      setEmail(session.user.email || "")
      setTwoFactorEnabled(session.user.twoFactorEnabled || false)
    }
  }, [session?.user])

  // Check if user has a password/credential account
  useEffect(() => {
    const checkAccounts = async () => {
      try {
        setIsLoadingAccounts(true)
        const result = await authClient.listAccounts()

        // Check if the result has an error
        if (result.error) {
          console.error("Error fetching accounts:", result.error)
          // Default to true to avoid hiding settings on error
          setHasPasswordAccount(true)
          return
        }

        const accounts = result.data || []

        // Store connected accounts for display
        setConnectedAccounts(accounts)

        // Check if user has a credential (email/password) account
        // Users with only social providers won't have a password account
        const hasCredentialAccount = accounts.some(
          (account: any) => account.providerId === "credential"
        )

        setHasPasswordAccount(hasCredentialAccount)
      } catch (error) {
        console.error("Error fetching accounts:", error)
        // Default to true to avoid hiding settings on error
        setHasPasswordAccount(true)
      } finally {
        setIsLoadingAccounts(false)
      }
    }

    checkAccounts()
  }, [])

  // Fetch user balance
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const result = await getBalance()
        if (result.success && result.balance !== undefined) {
          setUserBalance(result.balance)
        }
      } catch (error) {
        console.error("Error fetching balance:", error)
      }
    }

    fetchBalance()
  }, [])

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingName(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const result = await updateName(formData)

      if (result.success) {
        toast.success(result.message)
        // Refetch session to get updated user data
        await refetchSession()
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoadingName(false)
    }
  }

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingEmail(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const result = await updateEmail(formData)

      if (result.success) {
        toast.success(result.message)
        // Don't reset the email field as the change is pending verification
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoadingEmail(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoadingPassword(true)

    try {
      const formData = new FormData(e.target as HTMLFormElement)
      const result = await updatePassword(formData)

      if (result.success) {
        toast.success(result.message)
        // Clear password fields on success
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setRevokeOtherSessions(false)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoadingPassword(false)
    }
  }

  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      setDisableDialogOpen(true)
    } else {
      setSetupDialogOpen(true)
    }
  }

  const handle2FASetupSuccess = () => {
    setTwoFactorEnabled(true)
    // Optionally refresh user data here
  }

  const handle2FADisableSuccess = () => {
    setTwoFactorEnabled(false)
    // Optionally refresh user data here
  }

  const handleDownloadData = async () => {
    setIsLoadingData(true)

    try {
      // Call the export API endpoint
      const response = await fetch("/api/export-data")

      if (!response.ok) {
        throw new Error("Failed to export data")
      }

      // Get the blob from the response
      const blob = await response.blob()

      // Create a download link and trigger it
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success("Transactions exported successfully")
    } catch (error) {
      console.error("Error downloading data:", error)
      toast.error("Failed to export transactions. Please try again.")
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsLoadingDelete(true)

    try {
      const result = await initiateAccountDeletion()

      if (result.success) {
        toast.success(result.message)
        setDeleteDialogOpen(false)
      } else {
        toast.error(result.error)
      }
    } catch (error) {
      console.error("Error initiating account deletion:", error)
      toast.error("Failed to initiate account deletion. Please try again.")
    } finally {
      setIsLoadingDelete(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Name */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Name
          </CardTitle>
          <CardDescription>
            Update your display name.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoadingName}>
                {isLoadingName ? "Updating..." : "Update Name"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Address
          </CardTitle>
          <CardDescription>
            {hasPasswordAccount
              ? "Update your email address."
              : "Your email is managed by your social provider and cannot be changed here."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasPasswordAccount ? (
            <form onSubmit={handleUpdateEmail} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="email"
                    name="newEmail"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="h-10 w-10 flex items-center justify-center">
                          {session?.user?.emailVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{session?.user?.emailVerified ? "Email is verified" : "Email is not verified"}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoadingEmail}>
                  {isLoadingEmail ? "Updating..." : "Update Email"}
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="email-readonly">Email</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="email-readonly"
                  type="email"
                  value={email}
                  disabled
                  className="bg-muted"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-10 w-10 flex items-center justify-center">
                        {session?.user?.emailVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{session?.user?.emailVerified ? "Email is verified" : "Email is not verified"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <p className="text-sm text-muted-foreground">
                This email is managed by your social login provider. To change it, update your email in your {connectedAccounts.find(a => a.providerId !== "credential")?.providerId || "provider"} account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Update - Only show for users with password/credential accounts */}
      {hasPasswordAccount && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    name="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="revoke-sessions"
                checked={revokeOtherSessions}
                onCheckedChange={setRevokeOtherSessions}
              />
              <input
                type="hidden"
                name="revokeOtherSessions"
                value={revokeOtherSessions.toString()}
              />
              <Label htmlFor="revoke-sessions" className="text-sm font-normal cursor-pointer">
                Sign out of all other devices after password change
              </Label>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoadingPassword}>
                {isLoadingPassword ? "Updating..." : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}

      {/* Security Settings - Only show 2FA for users with password/credential accounts */}
      {hasPasswordAccount && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
          <CardDescription>
            Manage additional security features for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account with 2FA.
              </p>
            </div>
            <Switch
              checked={twoFactorEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>

          {twoFactorEnabled && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Two-factor authentication is enabled
                </span>
              </div>
              <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                Your account is protected with an additional security layer.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      )}

      {/* Transaction Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Transactions
          </CardTitle>
          <CardDescription>
            Download your complete transaction history as a CSV file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-2">What's included in your export:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Transaction ID and type (payment, rewrite, refund, adjustment)</li>
                <li>• Amount and balance after each transaction</li>
                <li>• Transaction descriptions</li>
                <li>• Related payment or rewrite IDs</li>
                <li>• Transaction dates and timestamps</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-3">
                Export is provided as a CSV file for easy import into Excel, Google Sheets, or other spreadsheet applications.
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleDownloadData} disabled={isLoadingData} variant="outline">
                {isLoadingData ? "Exporting..." : "Export Transactions"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            View your account details and registration information.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm">
            <div className="grid grid-cols-3 gap-4">
              <span className="text-muted-foreground">Account ID:</span>
              <span className="col-span-2 font-mono">{session?.user?.id}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-muted-foreground">Member since:</span>
              <span className="col-span-2">
                {session?.user?.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : "Unknown"}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <span className="text-muted-foreground">Email status:</span>
              <span className="col-span-2">
                {session?.user?.emailVerified ? (
                  <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                    <CheckCircle className="h-3 w-3" />
                    Verified
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                    <AlertCircle className="h-3 w-3" />
                    Unverified
                  </Badge>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Connected Accounts
          </CardTitle>
          <CardDescription>
            Manage the authentication methods connected to your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingAccounts ? (
            <div className="text-sm text-muted-foreground">Loading connected accounts...</div>
          ) : (
            <div className="space-y-3">
              {connectedAccounts.map((account: any) => (
                <div
                  key={account.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    {account.providerId === "google" && (
                      <Chrome className="h-5 w-5 text-muted-foreground" />
                    )}
                    {account.providerId === "credential" && (
                      <Mail className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <div className="font-medium capitalize">
                        {account.providerId === "credential" ? "Email/Password" : account.providerId}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {account.providerId === "credential"
                          ? "Password authentication"
                          : `Connected via ${account.providerId}`}
                      </div>
                    </div>
                  </div>
                  <Badge variant="secondary">Connected</Badge>
                </div>
              ))}
              {connectedAccounts.length === 0 && (
                <div className="text-sm text-muted-foreground">No connected accounts found.</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Separator />

      {/* Delete Account - Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Delete Account
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-4">
              <h4 className="font-semibold text-destructive mb-2">Warning: This action is permanent</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Deleting your account will:
              </p>
              <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                <li>• Permanently delete all your personal information</li>
                <li>• Remove all your rewrite history</li>
                <li>• Delete all transaction records</li>
                {userBalance > 0 && (
                  <li className="text-destructive font-semibold">
                    • Forfeit your current balance of ${userBalance.toFixed(2)} (non-refundable)
                  </li>
                )}
                <li>• Disconnect all linked accounts (Google, etc.)</li>
                <li>• Sign you out of all active sessions</li>
              </ul>
              <p className="text-sm text-muted-foreground mt-3">
                You will receive an email confirmation link. Your account will only be deleted after you click the confirmation link.
              </p>
            </div>

            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This will initiate the account deletion process. You will receive a confirmation email
              that you must click to complete the deletion.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {userBalance > 0 && (
              <div className="rounded-lg border-2 border-destructive bg-destructive/10 p-4">
                <p className="font-semibold text-destructive mb-2">
                  You will lose ${userBalance.toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Your current account balance will be permanently forfeited and cannot be refunded.
                  By proceeding, you acknowledge that you waive all rights to these funds.
                </p>
              </div>
            )}

            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">What happens next:</p>
              <ol className="text-sm text-muted-foreground space-y-1 ml-4 list-decimal">
                <li>We'll send a confirmation email to {session?.user?.email}</li>
                <li>Click the link in the email within 24 hours to confirm deletion</li>
                <li>Your account and all data will be permanently deleted</li>
                <li>You'll be signed out and can no longer access this account</li>
              </ol>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isLoadingDelete}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isLoadingDelete}
            >
              {isLoadingDelete ? "Sending Email..." : "Send Confirmation Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 2FA Setup Dialog */}
      <TwoFactorSetup
        open={setupDialogOpen}
        onOpenChange={setSetupDialogOpen}
        onSuccess={handle2FASetupSuccess}
      />

      {/* 2FA Disable Dialog */}
      <TwoFactorDisable
        open={disableDialogOpen}
        onOpenChange={setDisableDialogOpen}
        onSuccess={handle2FADisableSuccess}
      />
    </div>
  )
}