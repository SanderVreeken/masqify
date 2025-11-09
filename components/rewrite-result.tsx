"use client"

import { useState } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Copy, Check, RotateCcw, FileText, Shield, Sparkles } from "lucide-react"
import type { SensitiveItem } from "./text-rewriter"

type Props = {
  originalText: string
  sanitizedText: string
  rewrittenText: string
  finalText: string
  sensitiveItems: SensitiveItem[]
  onReset: () => void
}

export function RewriteResult({
  originalText,
  sanitizedText,
  rewrittenText,
  finalText,
  sensitiveItems,
  onReset,
}: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(finalText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-border">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-lg border border-border bg-background">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-1">Rewrite Complete</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your text has been successfully rewritten. All sensitive data has been restored.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border-border">
        <Tabs defaultValue="final" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="final" className="gap-2 text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Final</span>
            </TabsTrigger>
            <TabsTrigger value="original" className="gap-2 text-xs">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Original</span>
            </TabsTrigger>
            <TabsTrigger value="sanitized" className="gap-2 text-xs">
              <Shield className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sanitized</span>
            </TabsTrigger>
            <TabsTrigger value="rewritten" className="gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">AI Output</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="final" className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="gap-1.5 text-xs">
                <Check className="h-3 w-3" />
                Ready to use
              </Badge>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 bg-transparent">
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 rounded-lg border border-border min-h-[300px] whitespace-pre-wrap break-words text-sm leading-relaxed">
              {finalText}
            </div>
          </TabsContent>

          <TabsContent value="original" className="mt-6">
            <div className="p-4 rounded-lg border border-border min-h-[300px] whitespace-pre-wrap break-words text-sm leading-relaxed">
              {originalText}
            </div>
          </TabsContent>

          <TabsContent value="sanitized" className="space-y-4 mt-6">
            <Badge variant="secondary" className="gap-1.5 text-xs">
              <Shield className="h-3 w-3" />
              Sent to AI
            </Badge>
            <div className="p-4 rounded-lg border border-border min-h-[300px] whitespace-pre-wrap break-words text-sm leading-relaxed">
              {sanitizedText}
            </div>
          </TabsContent>

          <TabsContent value="rewritten" className="space-y-4 mt-6">
            <Badge variant="secondary" className="gap-1.5 text-xs">
              <Sparkles className="h-3 w-3" />
              Before restoration
            </Badge>
            <div className="p-4 rounded-lg border border-border min-h-[300px] whitespace-pre-wrap break-words text-sm leading-relaxed">
              {rewrittenText}
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {sensitiveItems.length > 0 && (
        <Card className="p-6 border-border">
          <div className="flex items-center gap-2 mb-5">
            <Shield className="h-4 w-4" />
            <h3 className="font-semibold text-base">Protected Data Summary</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {/* Group items by unique lowercase text */}
            {Array.from(
              new Map(
                sensitiveItems.map((item) => [
                  item.text.toLowerCase(),
                  item
                ])
              ).values()
            ).map((item, index) => (
              <div key={item.text.toLowerCase()} className="flex items-center gap-2 p-2.5 rounded-lg border border-border text-xs">
                <Badge variant="outline" className="shrink-0 font-mono">
                  {String(index + 1).padStart(2, "0")}
                </Badge>
                <span className="text-muted-foreground truncate flex-1 font-mono">{item.placeholder}</span>
                <span className="truncate font-mono">→ {item.text.toLowerCase()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="flex justify-center pt-4">
        <Button variant="outline" onClick={onReset} className="gap-2 bg-transparent">
          <RotateCcw className="h-4 w-4" />
          Rewrite Another Text
          <kbd className="hidden sm:inline-flex ml-2 px-2 py-1 text-xs font-semibold bg-background/50 border border-border rounded">
            ⌘⇧⌫
          </kbd>
        </Button>
      </div>
    </div>
  )
}
