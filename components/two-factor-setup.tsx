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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Smartphone,
  Copy,
  CheckCircle,
  AlertTriangle,
  Download,
  Eye,
  EyeOff
} from "lucide-react"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"
import QRCode from "react-qr-code"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface TwoFactorSetupProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TwoFactorSetup({ open, onOpenChange, onSuccess }: TwoFactorSetupProps) {
  const [step, setStep] = useState<"setup" | "verify" | "backup">("setup")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [setupData, setSetupData] = useState<{
    qrCode: string
    secret: string
    backupCodes: string[]
  } | null>(null)

  const handleEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password) {
      toast.error("Please enter your password")
      return
    }

    setIsLoading(true)
    try {
      const response = await authClient.twoFactor.enable({
        password,
        issuer: "Masqify",
      })

      if (response.error) {
        toast.error(response.error.message || "Failed to enable 2FA")
        setIsLoading(false)
        return
      }

      if (response.data) {
        // Extract secret from TOTP URI
        const secret = new URL(response.data.totpURI).searchParams.get('secret') || ''

        setSetupData({
          qrCode: response.data.totpURI,
          secret: secret,
          backupCodes: response.data.backupCodes || [],
        })
        setStep("verify")
      }
    } catch (error) {
      toast.error("Failed to enable 2FA")
      console.error("2FA enable error:", error)
    }
    setIsLoading(false)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!verificationCode) {
      toast.error("Please enter the verification code")
      return
    }

    setIsLoading(true)
    try {
      const response = await authClient.twoFactor.verifyTotp({
        code: verificationCode,
        trustDevice: true,
      })

      if (response.error) {
        toast.error(response.error.message || "Invalid verification code")
        setIsLoading(false)
        return
      }

      toast.success("2FA enabled successfully!")
      setStep("backup")
    } catch (error) {
      toast.error("Failed to verify code")
      console.error("2FA verify error:", error)
    }
    setIsLoading(false)
  }

  const handleCopySecret = () => {
    if (setupData?.secret) {
      navigator.clipboard.writeText(setupData.secret)
      toast.success("Secret key copied to clipboard")
    }
  }

  const handleCopyBackupCodes = () => {
    if (setupData?.backupCodes) {
      navigator.clipboard.writeText(setupData.backupCodes.join("\n"))
      toast.success("Backup codes copied to clipboard")
    }
  }

  const handleDownloadBackupCodes = () => {
    if (setupData?.backupCodes) {
      const content = `Masqify 2FA Backup Codes\n\nGenerated: ${new Date().toLocaleDateString()}\n\n${setupData.backupCodes.join("\n")}\n\nKeep these codes safe! They can be used to access your account if you lose your authenticator device.`
      const blob = new Blob([content], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "securerewrite-backup-codes.txt"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Backup codes downloaded")
    }
  }

  const handleFinish = () => {
    onSuccess()
    onOpenChange(false)
    setStep("setup")
    setPassword("")
    setVerificationCode("")
    setSetupData(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Set Up Two-Factor Authentication
          </DialogTitle>
          <DialogDescription>
            Add an extra layer of security to your account
          </DialogDescription>
        </DialogHeader>

        {step === "setup" && (
          <form onSubmit={handleEnable2FA} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setup-password">Confirm your password</Label>
              <div className="relative">
                <Input
                  id="setup-password"
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

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
              <div className="flex items-start gap-2">
                <Smartphone className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-800 dark:text-blue-200">
                    You'll need an authenticator app
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 mt-1">
                    Download apps like Google Authenticator, Authy, or 1Password to scan the QR code.
                  </p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Setting up..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        )}

        {step === "verify" && setupData && (
          <div className="space-y-4">
            <Tabs defaultValue="qr" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="qr">QR Code</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>

              <TabsContent value="qr" className="space-y-4">
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg">
                    {setupData.qrCode ? (
                      <QRCode value={setupData.qrCode} size={200} />
                    ) : (
                      <div className="w-[200px] h-[200px] flex items-center justify-center text-muted-foreground">
                        QR Code not available
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Scan this QR code with your authenticator app
                </p>
              </TabsContent>

              <TabsContent value="manual" className="space-y-4">
                <div className="space-y-2">
                  <Label>Secret Key</Label>
                  <div className="flex items-center gap-2">
                    <Input value={setupData.secret} readOnly className="font-mono text-xs" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleCopySecret}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter this secret key manually in your authenticator app
                </p>
              </TabsContent>
            </Tabs>

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Verification Code</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={verificationCode}
                    onChange={(value) => setVerificationCode(value)}
                    disabled={isLoading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-center text-muted-foreground text-xs">
                  Enter the 6-digit code from your authenticator app
                </p>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setStep("setup")}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading || verificationCode.length !== 6}>
                  {isLoading ? "Verifying..." : "Verify & Enable"}
                </Button>
              </DialogFooter>
            </form>
          </div>
        )}

        {step === "backup" && setupData && (
          <div className="space-y-4">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
              <h3 className="text-lg font-semibold">2FA Enabled Successfully!</h3>
              <p className="text-sm text-muted-foreground">
                Save your backup codes in a safe place
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Backup Codes
                </CardTitle>
                <CardDescription>
                  Use these codes if you lose access to your authenticator device
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                  {setupData.backupCodes.map((code, index) => (
                    <Badge key={index} variant="secondary" className="justify-center py-1">
                      {code}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyBackupCodes}
                    className="flex-1"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadBackupCodes}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button onClick={handleFinish} className="w-full">
                Finish Setup
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}