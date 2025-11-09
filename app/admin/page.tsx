"use client"

import { Suspense, useEffect, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { EditorNav } from "@/components/editor-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { Ban, Unlock, Euro, History, Shield, UserCircle } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  emailVerified: boolean
  image: string | null
  role: string | null
  banned: boolean
  banReason: string | null
  banExpires: string | null
  twoFactorEnabled: boolean
  createdAt: string
  updatedAt: string
  balance: string | null
}

interface Transaction {
  id: string
  userId: string
  type: "payment" | "rewrite" | "refund" | "adjustment"
  amount: string
  balanceAfter: string
  description: string
  relatedId: string | null
  metadata: any
  createdAt: string
}

export default function AdminPage() {
  const { data: session, isPending } = authClient.useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showTransactions, setShowTransactions] = useState(false)
  const [showAdjustBalance, setShowAdjustBalance] = useState(false)
  const [showBanDialog, setShowBanDialog] = useState(false)
  const [adjustAmount, setAdjustAmount] = useState("")
  const [adjustReason, setAdjustReason] = useState("")
  const [banReason, setBanReason] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/users")
      if (!response.ok) throw new Error("Failed to fetch users")
      const data = await response.json()
      setUsers(data.users)
    } catch (error) {
      toast.error("Failed to load users")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async (userId: string) => {
    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${userId}/transactions`)
      if (!response.ok) throw new Error("Failed to fetch transactions")
      const data = await response.json()
      setTransactions(data.transactions)
      setShowTransactions(true)
    } catch (error) {
      toast.error("Failed to load transactions")
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleAdjustBalance = async () => {
    if (!selectedUser) return

    const amount = parseFloat(adjustAmount)
    if (isNaN(amount)) {
      toast.error("Please enter a valid amount")
      return
    }

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedUser.id}/adjust-balance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason: adjustReason }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to adjust balance")
      }

      const data = await response.json()
      toast.success(data.message)
      setShowAdjustBalance(false)
      setAdjustAmount("")
      setAdjustReason("")
      fetchUsers()
    } catch (error: any) {
      toast.error(error.message || "Failed to adjust balance")
    } finally {
      setActionLoading(false)
    }
  }

  const handleBanUser = async (ban: boolean) => {
    if (!selectedUser) return

    try {
      setActionLoading(true)
      const response = await fetch(`/api/admin/users/${selectedUser.id}/ban`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          banned: ban,
          banReason: ban ? banReason : null,
          banExpires: null,
        }),
      })

      if (!response.ok) throw new Error("Failed to update ban status")

      const data = await response.json()
      toast.success(data.message)
      setShowBanDialog(false)
      setBanReason("")
      fetchUsers()
    } catch (error) {
      toast.error("Failed to update ban status")
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleImpersonate = async (userId: string, userName: string) => {
    try {
      setActionLoading(true)
      await authClient.admin.impersonateUser({
        userId,
      })
      toast.success(`Now impersonating ${userName}`)
      // Redirect to homepage as the impersonated user
      setTimeout(() => {
        window.location.href = "/"
      }, 500)
    } catch (error) {
      toast.error("Failed to impersonate user")
      console.error(error)
      setActionLoading(false)
    }
  }

  if (isPending || loading) {
    return (
      <SidebarProvider defaultOpen={false}>
        <SidebarInset>
          <EditorNav />
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold tracking-tight">Admin Panel</h1>
              <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </SidebarInset>
        <AppSidebar side="right" variant="inset" />
      </SidebarProvider>
    )
  }

  return (
    <SidebarProvider defaultOpen={false}>
      <SidebarInset>
        <EditorNav />

        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Admin Panel
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage users, funds, and transactions
              </p>
            </div>
            <Button onClick={fetchUsers} variant="outline">
              Refresh
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Users ({users.length})</CardTitle>
              <CardDescription>
                View and manage all registered users
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm bg-muted/50">
                      <th className="px-6 py-4 font-medium">User</th>
                      <th className="px-6 py-4 font-medium">Email</th>
                      <th className="px-6 py-4 font-medium">Balance</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Role</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            {user.image ? (
                              <img
                                src={user.image}
                                alt={user.name}
                                className="h-10 w-10 rounded-full ring-2 ring-border"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center ring-2 ring-border">
                                <span className="text-sm font-medium">
                                  {user.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <div>
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-muted-foreground">
                                ID: {user.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            <div className="text-sm">{user.email}</div>
                            {user.emailVerified && (
                              <Badge variant="secondary" className="w-fit text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="font-mono text-sm font-medium">
                            €{parseFloat(user.balance || "0").toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                            {user.banned ? (
                              <Badge variant="destructive" className="w-fit">
                                Banned
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="w-fit">
                                Active
                              </Badge>
                            )}
                            {user.twoFactorEnabled && (
                              <Badge variant="secondary" className="w-fit text-xs">
                                2FA Enabled
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          {user.role ? (
                            <Badge variant="default" className="w-fit">
                              {user.role}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">No role</span>
                          )}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user)
                                fetchTransactions(user.id)
                              }}
                              title="View transactions"
                              className="h-9 w-9 p-0"
                              disabled={actionLoading}
                            >
                              <History className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowAdjustBalance(true)
                              }}
                              title="Adjust balance"
                              className="h-9 w-9 p-0"
                              disabled={actionLoading}
                            >
                              <Euro className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleImpersonate(user.id, user.name)}
                              title="Impersonate user"
                              className="h-9 w-9 p-0"
                              disabled={actionLoading || user.id === session?.user.id}
                            >
                              <UserCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={user.banned ? "outline" : "destructive"}
                              onClick={() => {
                                setSelectedUser(user)
                                setShowBanDialog(true)
                              }}
                              title={user.banned ? "Unban user" : "Ban user"}
                              className="h-9 w-9 p-0"
                              disabled={actionLoading}
                            >
                              {user.banned ? (
                                <Unlock className="h-4 w-4" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
      <AppSidebar side="right" variant="inset" />

      {/* Transactions Dialog */}
      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} - {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {transactions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No transactions found
              </p>
            ) : (
              transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between border rounded-lg p-4"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          tx.type === "payment"
                            ? "default"
                            : tx.type === "adjustment"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        {tx.type}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(tx.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm">{tx.description}</p>
                    {tx.metadata && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {JSON.stringify(tx.metadata)}
                      </p>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div
                      className={`font-mono font-semibold ${
                        parseFloat(tx.amount) >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {parseFloat(tx.amount) >= 0 ? "+" : ""}€
                      {parseFloat(tx.amount).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Balance: €{parseFloat(tx.balanceAfter).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Adjust Balance Dialog */}
      <Dialog open={showAdjustBalance} onOpenChange={setShowAdjustBalance}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-4">
            <DialogTitle>Adjust Balance</DialogTitle>
            <DialogDescription>
              {selectedUser?.name} - Current balance: €
              {parseFloat(selectedUser?.balance || "0").toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">
                Amount (use negative to deduct, positive to add)
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="10.00"
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                type="text"
                placeholder="Manual adjustment for..."
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
              />
            </div>
            {adjustAmount && (
              <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                New balance will be: €
                {(
                  parseFloat(selectedUser?.balance || "0") +
                  parseFloat(adjustAmount || "0")
                ).toFixed(2)}
              </div>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowAdjustBalance(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button onClick={handleAdjustBalance} disabled={actionLoading}>
              {actionLoading ? "Processing..." : "Adjust Balance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ban/Unban Dialog */}
      <Dialog open={showBanDialog} onOpenChange={setShowBanDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="pb-4">
            <DialogTitle>
              {selectedUser?.banned ? "Unban User" : "Ban User"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.name} - {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {!selectedUser?.banned && (
              <div className="space-y-2">
                <Label htmlFor="banReason">Ban Reason</Label>
                <Input
                  id="banReason"
                  type="text"
                  placeholder="Reason for banning this user..."
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                />
              </div>
            )}
            {selectedUser?.banned && selectedUser.banReason && (
              <div className="text-sm bg-muted p-3 rounded-md">
                <strong>Current ban reason:</strong> {selectedUser.banReason}
              </div>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              variant="outline"
              onClick={() => setShowBanDialog(false)}
              disabled={actionLoading}
            >
              Cancel
            </Button>
            <Button
              variant={selectedUser?.banned ? "default" : "destructive"}
              onClick={() => handleBanUser(!selectedUser?.banned)}
              disabled={actionLoading}
            >
              {actionLoading
                ? "Processing..."
                : selectedUser?.banned
                ? "Unban User"
                : "Ban User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
