"use client"

import { useState, useRef, useEffect } from "react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Shield, ArrowRight, X } from "lucide-react"
import type { SensitiveItem } from "./text-rewriter"

type Props = {
  onSubmit: (text: string, items: SensitiveItem[]) => void
}

export function TextInput({ onSubmit }: Props) {
  const [text, setText] = useState("")
  const [sensitiveItems, setSensitiveItems] = useState<SensitiveItem[]>([])
  const editorRef = useRef<HTMLDivElement>(null)

  // Autofocus on mount
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus()
    }
  }, [])

  // Keyboard shortcut: Cmd/Ctrl + Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey
      if (isCmdOrCtrl && e.key === "Enter" && !e.shiftKey) {
        e.preventDefault()
        if (text.trim()) {
          handleSubmit()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [text, sensitiveItems])

  useEffect(() => {
    if (!editorRef.current) return

    const editor = editorRef.current
    const selection = window.getSelection()
    const range = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

    // Save cursor position
    let cursorOffset = 0
    if (range) {
      const preCaretRange = range.cloneRange()
      preCaretRange.selectNodeContents(editor)
      preCaretRange.setEnd(range.endContainer, range.endOffset)
      cursorOffset = preCaretRange.toString().length
    }

    // Build HTML with highlights
    let html = ""
    let lastIndex = 0

    const sortedItems = [...sensitiveItems].sort((a, b) => a.startIndex - b.startIndex)

    sortedItems.forEach((item) => {
      // Add text before highlight
      html += escapeHtml(text.slice(lastIndex, item.startIndex))
      // Add highlighted text
      html += `<mark class="bg-yellow-200 text-foreground rounded px-0.5">${escapeHtml(item.text)}</mark>`
      lastIndex = item.endIndex
    })

    // Add remaining text
    html += escapeHtml(text.slice(lastIndex))

    editor.innerHTML = html || "<br>"

    // Restore cursor position
    if (cursorOffset > 0) {
      try {
        const newRange = document.createRange()
        const sel = window.getSelection()
        let currentOffset = 0
        let found = false

        const walk = (node: Node) => {
          if (found) return
          if (node.nodeType === Node.TEXT_NODE) {
            const textLength = node.textContent?.length || 0
            if (currentOffset + textLength >= cursorOffset) {
              newRange.setStart(node, cursorOffset - currentOffset)
              newRange.collapse(true)
              sel?.removeAllRanges()
              sel?.addRange(newRange)
              found = true
            } else {
              currentOffset += textLength
            }
          } else {
            node.childNodes.forEach(walk)
          }
        }

        walk(editor)
      } catch (e) {
        // Cursor restoration failed, ignore
      }
    }
  }, [text, sensitiveItems])

  const escapeHtml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
      .replace(/\n/g, "<br>")
  }

  const handleInput = () => {
    if (!editorRef.current) return
    const newText = editorRef.current.innerText
    setText(newText)

    // Adjust sensitive item indices if text changed
    if (newText.length !== text.length) {
      // If text is shorter, remove items that are out of bounds
      setSensitiveItems(sensitiveItems.filter((item) => item.endIndex <= newText.length))
    }
  }

  const handleSelection = () => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const originalSelectedText = selection.toString()
    const selectedText = originalSelectedText.trim()
    if (!selectedText) return

    // Work with the plain text state
    const plainText = text

    // Check if this word (case-insensitive) already exists in sensitiveItems
    const existingItem = sensitiveItems.find(
      (item) => item.text.toLowerCase() === selectedText.toLowerCase()
    )

    // Find all occurrences of the selected text in the document (case-insensitive)
    const occurrences: Array<{ start: number; end: number; actualText: string }> = []
    const lowerSelectedText = selectedText.toLowerCase()
    let searchStart = 0

    while (searchStart < plainText.length) {
      const remainingText = plainText.slice(searchStart)
      const lowerRemainingText = remainingText.toLowerCase()
      const index = lowerRemainingText.indexOf(lowerSelectedText)

      if (index === -1) break

      const absoluteStart = searchStart + index
      const absoluteEnd = absoluteStart + selectedText.length

      occurrences.push({
        start: absoluteStart,
        end: absoluteEnd,
        actualText: plainText.slice(absoluteStart, absoluteEnd),
      })

      searchStart = absoluteStart + 1
    }

    if (occurrences.length === 0) return

    // Check which occurrences don't overlap with existing items
    const nonOverlappingOccurrences = occurrences.filter(({ start, end }) => {
      return !sensitiveItems.some(
        (item) =>
          (start >= item.startIndex && start < item.endIndex) ||
          (end > item.startIndex && end <= item.endIndex) ||
          (start <= item.startIndex && end >= item.endIndex),
      )
    })

    if (nonOverlappingOccurrences.length === 0) return

    // Use existing placeholder if word already exists (case-insensitive), otherwise create new one
    let placeholder: string
    if (existingItem) {
      placeholder = existingItem.placeholder
    } else {
      // Count unique placeholders to determine the next number
      const uniquePlaceholders = new Set(sensitiveItems.map((item) => item.placeholder))
      const nextNumber = uniquePlaceholders.size + 1
      placeholder = `[REDACTED-${nextNumber}]`
    }

    // Create items for all non-overlapping occurrences with the same placeholder
    // Store the actual text as it appears (with original case)
    const newItems: SensitiveItem[] = nonOverlappingOccurrences.map(({ start, end, actualText }) => ({
      id: Math.random().toString(36).substr(2, 9),
      text: actualText,
      placeholder,
      startIndex: start,
      endIndex: end,
    }))

    setSensitiveItems([...sensitiveItems, ...newItems].sort((a, b) => a.startIndex - b.startIndex))

    // Clear selection
    selection.removeAllRanges()
  }

  const removeItem = (id: string) => {
    // Find the item to remove
    const itemToRemove = sensitiveItems.find((item) => item.id === id)
    if (!itemToRemove) return

    // Remove all items with the same text and placeholder (all occurrences of this word)
    setSensitiveItems(
      sensitiveItems.filter(
        (item) => !(item.text === itemToRemove.text && item.placeholder === itemToRemove.placeholder)
      )
    )
  }

  const handleSubmit = () => {
    if (!text.trim()) {
      alert("Please enter some text first.")
      return
    }
    onSubmit(text, sensitiveItems)
  }

  return (
    <Card className="p-6 border-border">
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold">Enter Your Text</h2>
          <Badge variant="secondary" className="gap-1.5 font-mono text-xs">
            <Shield className="h-3 w-3" />
            {sensitiveItems.length}
          </Badge>
        </div>

        <div className="relative">
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onMouseUp={handleSelection}
            onTouchEnd={handleSelection}
            className="w-full min-h-[300px] p-4 rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-1 focus:ring-ring leading-relaxed text-sm overflow-auto"
            style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}
            data-placeholder="Paste or type your text here. Select any sensitive information to mark it as private..."
            data-sentry-mask="true"
            data-private="true"
            data-sensitive="true"
          />
          <style jsx>{`
            div[contenteditable]:empty:before {
              content: attr(data-placeholder);
              color: hsl(var(--muted-foreground));
              pointer-events: none;
            }
          `}</style>
        </div>

        {sensitiveItems.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm font-medium">Marked Sensitive Data</p>
            <div className="flex flex-wrap gap-2">
              {/* Group items by unique lowercase text */}
              {Array.from(
                new Map(
                  sensitiveItems.map((item) => [
                    item.text.toLowerCase(),
                    item
                  ])
                ).values()
              ).map((item) => (
                <Badge key={item.text.toLowerCase()} variant="secondary" className="gap-2 pr-1.5 font-normal">
                  <span className="max-w-[200px] truncate text-xs">{item.text.toLowerCase()}</span>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="hover:bg-muted rounded p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button onClick={handleSubmit} disabled={!text.trim()} size="lg" className="gap-2">
            Continue to Preview
            <ArrowRight className="h-4 w-4" />
            <kbd className="hidden sm:inline-flex ml-1 px-2 py-1 text-xs font-semibold bg-background/50 border border-border rounded">
              ⌘↵
            </kbd>
          </Button>
        </div>
      </div>
    </Card>
  )
}
