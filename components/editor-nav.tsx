"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function EditorNav() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="h-6 w-px bg-border" />
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <Image
              src="/masqify-logo.svg"
              alt="Masqify"
              width={40}
              height={40}
              priority
            />
          </div>
          <span className="text-lg font-semibold tracking-tight">Masqify</span>
        </div>
      </div>
      <SidebarTrigger className="-mr-1 ml-auto rotate-180" />
    </header>
  )
}
