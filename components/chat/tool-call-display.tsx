"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronUp,
  Search,
  Code,
  Database,
  FileText,
  Globe,
  Calculator,
  Wrench,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolCall {
  id: string
  name: string
  status: "running" | "completed" | "error"
  input?: string
  output?: string
  timestamp?: number
}

interface ToolCallDisplayProps {
  toolCalls: ToolCall[]
}

const getToolIcon = (toolName: string) => {
  const name = toolName.toLowerCase()
  if (name.includes("search") || name.includes("web")) return Search
  if (name.includes("code") || name.includes("python")) return Code
  if (name.includes("database") || name.includes("sql")) return Database
  if (name.includes("file") || name.includes("read")) return FileText
  if (name.includes("browser") || name.includes("url")) return Globe
  if (name.includes("calc") || name.includes("math")) return Calculator
  return Wrench
}

const getToolColor = (status: ToolCall["status"]) => {
  switch (status) {
    case "running":
      return "text-primary"
    case "completed":
      return "text-green-600 dark:text-green-500"
    case "error":
      return "text-destructive"
    default:
      return "text-muted-foreground"
  }
}

export default function ToolCallDisplay({ toolCalls }: ToolCallDisplayProps) {
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set())

  const toggleTool = (toolId: string) => {
    setExpandedTools((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(toolId)) {
        newSet.delete(toolId)
      } else {
        newSet.add(toolId)
      }
      return newSet
    })
  }

  if (toolCalls.length === 0) return null

  return (
    <div className="mb-3 max-w-[80%] space-y-2">
      {toolCalls.map((tool) => {
        const Icon = getToolIcon(tool.name)
        const isExpanded = expandedTools.has(tool.id)
        const colorClass = getToolColor(tool.status)

        return (
          <div key={tool.id} className="animate-fadeIn">
            <button
              onClick={() => toggleTool(tool.id)}
              className={cn(
                "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border transition-all",
                "bg-card border-border hover:bg-muted/50",
                isExpanded && "rounded-b-none"
              )}
            >
              <div className="flex items-center gap-2.5">
                <div className={cn("flex items-center justify-center", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-foreground">{tool.name}</span>
                <div className="flex items-center">
                  {tool.status === "running" && <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />}
                  {tool.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-500" />}
                </div>
              </div>
              {(tool.input || tool.output) && (
                <>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </>
              )}
            </button>

            {isExpanded && (tool.input || tool.output) && (
              <div className="border border-t-0 border-border rounded-b-xl px-4 py-3 bg-muted/30 space-y-3 animate-fadeIn">
                {tool.input && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Input
                    </div>
                    <div className="text-sm text-foreground bg-background/50 rounded-lg px-3 py-2 font-mono">
                      {tool.input}
                    </div>
                  </div>
                )}
                {tool.output && (
                  <div>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
                      Output
                    </div>
                    <div className="text-sm text-foreground bg-background/50 rounded-lg px-3 py-2 max-h-48 overflow-y-auto">
                      {tool.output}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
