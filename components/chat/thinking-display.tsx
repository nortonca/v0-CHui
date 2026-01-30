"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThinkingDisplayProps {
  content: string
  isStreaming?: boolean
  isExpanded?: boolean
}

export default function ThinkingDisplay({ content, isStreaming = false, isExpanded = false }: ThinkingDisplayProps) {
  const [expanded, setExpanded] = useState(isExpanded)

  return (
    <div className="mb-3 max-w-[80%]">
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border transition-all",
          "bg-muted/50 border-border hover:bg-muted/70",
          expanded && "rounded-b-none"
        )}
      >
        <div className="flex items-center gap-2">
          <div className={cn("flex items-center justify-center", isStreaming && "animate-pulse")}>
            <Brain className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium text-foreground">
            {isStreaming ? "Thinking..." : "View thinking"}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="border border-t-0 border-border rounded-b-xl px-4 py-3 bg-muted/30 animate-fadeIn">
          <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{content}</div>
        </div>
      )}
    </div>
  )
}
