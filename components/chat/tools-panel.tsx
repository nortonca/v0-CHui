"use client"

import { useState } from "react"
import { X, Wrench, Search, Globe, Code, FileText, Database, CheckCheck } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolsPanelProps {
  isExpanded: boolean
  onToggle: () => void
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  isMobile?: boolean
}

const AVAILABLE_TOOLS = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for current information",
    icon: Search,
  },
  {
    id: "browser",
    name: "Browser",
    description: "Visit and extract content from websites",
    icon: Globe,
  },
  {
    id: "code-executor",
    name: "Code Executor",
    description: "Run code snippets and scripts",
    icon: Code,
  },
  {
    id: "file-reader",
    name: "File Reader",
    description: "Read and analyze file contents",
    icon: FileText,
  },
  {
    id: "database",
    name: "Database",
    description: "Query and manage database records",
    icon: Database,
  },
]

export default function ToolsPanel({
  isExpanded,
  onToggle,
  selectedTools,
  onToolsChange,
  isMobile = false,
}: ToolsPanelProps) {
  const [localSelection, setLocalSelection] = useState<string[]>(selectedTools)

  const handleToggle = (toolId: string) => {
    const newSelection = localSelection.includes(toolId)
      ? localSelection.filter((id) => id !== toolId)
      : [...localSelection, toolId]
    setLocalSelection(newSelection)
    onToolsChange(newSelection)
  }

  const handleSelectAll = () => {
    const allIds = AVAILABLE_TOOLS.map((t) => t.id)
    setLocalSelection(allIds)
    onToolsChange(allIds)
  }

  const handleClearAll = () => {
    setLocalSelection([])
    onToolsChange([])
  }

  return (
    <div
      className={cn(
        "absolute left-0 right-0 bg-card border border-border transition-all duration-300",
        isMobile
          ? cn(
              "bottom-full rounded-t-3xl",
              isExpanded ? "max-h-[50vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )
          : cn(
              "bottom-full mb-2 rounded-2xl shadow-lg",
              isExpanded ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )
      )}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isExpanded && (
        <div className="flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Wrench className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Tools</h3>
              <span className="text-xs text-muted-foreground">
                {localSelection.length} selected
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Close tools panel"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-2 border-b border-border bg-muted/30 flex items-center justify-between">
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-xs text-primary hover:underline font-medium"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Tools List */}
          <div className="p-3 space-y-2 max-h-[calc(60vh-120px)] overflow-y-auto">
            {AVAILABLE_TOOLS.map((tool) => {
              const Icon = tool.icon
              const isSelected = localSelection.includes(tool.id)

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToggle(tool.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                    isSelected
                      ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20"
                      : "bg-background border-border hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 mt-0.5 flex-shrink-0",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          isSelected ? "text-foreground" : "text-foreground"
                        )}
                      >
                        {tool.name}
                      </span>
                      {isSelected && (
                        <CheckCheck className="size-3.5 text-primary" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
