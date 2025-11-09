"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { LogOut, Wallet, Plus, History, Cookie, Sun, Moon, LogIn, PenSquare, Settings, Shield } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { logout } from "@/app/actions/logout"
import { toast } from "sonner"
import { useTheme } from "next-themes"
import { BalanceDisplay } from "@/components/balance-display"
import { CookieSettings } from "@/components/cookie-settings"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { data: session } = authClient.useSession()
  const { theme, setTheme } = useTheme()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      const result = await logout()
      if (result.success) {
        window.location.href = `/?message=${encodeURIComponent(result.message)}&type=success`
      } else {
        toast.error(result.error)
        setIsLoggingOut(false)
      }
    } catch (error) {
      toast.error("Failed to sign out. Please try again.")
      setIsLoggingOut(false)
    }
  }

  const isEditorPage = pathname === "/editor"
  const isHomePage = pathname === "/"

  return (
    <Sidebar {...props}>
      <SidebarContent>
        {/* Theme Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Preferences</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Theme Toggle */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  disabled={!mounted}
                >
                  {mounted && theme === "dark" ? (
                    <>
                      <Moon className="h-4 w-4" />
                      <span>Dark Mode</span>
                    </>
                  ) : (
                    <>
                      <Sun className="h-4 w-4" />
                      <span>Light Mode</span>
                    </>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Launch Editor - only on home page and when logged in */}
        {mounted && session?.user && isHomePage && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/editor">
                        <PenSquare className="h-4 w-4" />
                        <span>Launch Editor</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {mounted && session?.user && (
          <>
            <SidebarSeparator />

            {/* Account Group */}
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Balance Display */}
                  <SidebarMenuItem>
                    <div className="px-2 py-1.5">
                      <BalanceDisplay />
                    </div>
                  </SidebarMenuItem>

                  {/* Account Settings */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/account">
                        <Settings className="h-4 w-4" />
                        <span>Account Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  {/* Admin Panel - only show if user has admin role */}
                  {session.user.role === "admin" && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <Link href="/admin">
                          <Shield className="h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* Sign In - only when not logged in and on home page */}
        {mounted && !session?.user && isHomePage && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href="/login">
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      {/* Footer with Cookie Settings and Logout */}
      <SidebarFooter>
        <SidebarMenu>
          {/* Cookie Settings */}
          <SidebarMenuItem>
            <CookieSettings />
          </SidebarMenuItem>

          {/* Divider before logout - only show if user is logged in */}
          {mounted && session?.user && (
            <div className="my-2">
              <SidebarSeparator />
            </div>
          )}

          {/* Sign Out - only when logged in */}
          {mounted && session?.user && (
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Signing out..." : "Sign Out"}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
