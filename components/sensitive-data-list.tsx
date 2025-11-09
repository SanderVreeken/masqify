import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Shield } from "lucide-react"
import type { SensitiveItem } from "./text-rewriter"

type Props = {
  items: SensitiveItem[]
}

export function SensitiveDataList({ items }: Props) {
  if (items.length === 0) return null

  // Group items by unique lowercase text
  const uniqueItems = Array.from(
    new Map(
      items.map((item) => [
        item.text.toLowerCase(),
        item
      ])
    ).values()
  )

  return (
    <Card className="p-4 sm:p-5 border-border">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <Shield className="h-4 w-4" />
        <h3 className="font-semibold" style={{ fontSize: 'clamp(0.75rem, 1vw + 0.15rem, 1rem)' }}>Protected Information</h3>
      </div>
      <div className="space-y-2">
        {uniqueItems.map((item, index) => (
          <div key={item.text.toLowerCase()} className="flex items-center justify-between p-2 sm:p-3 rounded-lg border border-border">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Badge variant="outline" className="shrink-0 font-mono" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
                {String(index + 1).padStart(2, "0")}
              </Badge>
              <span className="text-muted-foreground truncate font-mono" style={{ fontSize: 'clamp(0.7rem, 0.875vw + 0.1rem, 0.875rem)' }}>{item.text.toLowerCase()}</span>
            </div>
            <Badge variant="secondary" className="shrink-0 ml-2 sm:ml-3 font-mono" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
              {item.placeholder}
            </Badge>
          </div>
        ))}
      </div>
      <p className="mt-3 sm:mt-4 text-muted-foreground leading-relaxed" style={{ fontSize: 'clamp(0.625rem, 0.75vw + 0.1rem, 0.75rem)' }}>
        These items will be replaced with placeholders before sending to AI, then restored in the final result.
      </p>
    </Card>
  )
}
