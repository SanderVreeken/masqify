import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Eye, Shield } from "lucide-react"
import type { SensitiveItem } from "./text-rewriter"
import type React from "react" // Import React to declare JSX

type Props = {
  title: string
  text: string
  sensitiveItems?: SensitiveItem[]
  isSanitized?: boolean
}

export function TextPreview({ title, text, sensitiveItems = [], isSanitized = false }: Props) {
  const renderText = () => {
    if (!isSanitized && sensitiveItems.length > 0) {
      const parts: React.ReactNode[] = [] // Declare parts as React.ReactNode
      let lastIndex = 0

      sensitiveItems.forEach((item, index) => {
        if (item.startIndex > lastIndex) {
          parts.push(<span key={`text-${index}`}>{text.slice(lastIndex, item.startIndex)}</span>)
        }

        parts.push(
          <mark key={`mark-${index}`} className="bg-accent/30 text-accent-foreground rounded px-1">
            {item.text}
          </mark>,
        )

        lastIndex = item.endIndex
      })

      if (lastIndex < text.length) {
        parts.push(<span key="text-end">{text.slice(lastIndex)}</span>)
      }

      return parts
    }

    return text
  }

  return (
    <Card className="p-4 sm:p-5 border-border">
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>{title}</h3>
          {isSanitized ? (
            <Badge variant="secondary" className="gap-1.5" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
              <Shield className="h-3 w-3" />
              Sanitized
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
              <Eye className="h-3 w-3" />
              Original
            </Badge>
          )}
        </div>
        <div className="p-3 sm:p-4 rounded-lg border border-border min-h-[160px] sm:min-h-[200px] whitespace-pre-wrap break-words leading-relaxed" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>
          {renderText()}
        </div>
      </div>
    </Card>
  )
}
