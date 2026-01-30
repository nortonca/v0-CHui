"use client"

import React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Wrench,
  X,
  Check,
  Globe,
  Calculator,
  Code2,
  ImageIcon,
  FileSearch,
  Database,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Tool {
  id: string
  name: string
  description: string
  icon: React.ElementType
  category: "search" | "compute" | "create"
}

const AVAILABLE_TOOLS: Tool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for information",
    icon: Globe,
    category: "search",
  },
  {
    id: "file-search",
    name: "File Search",
    description: "Search through uploaded documents",
    icon: FileSearch,
    category: "search",
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform mathematical calculations",
    icon: Calculator,
    category: "compute",
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute and analyze code",
    icon: Code2,
    category: "compute",
  },
  {
    id: "database",
    name: "Database",
    description: "Query connected databases",
    icon: Database,
    category: "compute",
  },
  {
    id: "image-gen",
    name: "Image Generation",
    description: "Create images from descriptions",
    icon: ImageIcon,
    category: "create",
  },
]

interface ToolsButtonProps {
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  isStreaming: boolean
}

export default function ToolsButton({
  selectedTools,
  onToolsChange,
  isStreaming,
}: ToolsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onToolsChange(selectedTools.filter((id) => id !== toolId))
    } else {
      onToolsChange([...selectedTools, toolId])
    }
  }

  const selectAll = () => {
    onToolsChange(AVAILABLE_TOOLS.map((t) => t.id))
  }

  const clearAll = () => {
    onToolsChange([])
  }

  const hasTools = selectedTools.length > 0

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isStreaming}
        className={cn(
          "h-8 px-3 rounded-full flex items-center gap-2 transition-all",
          "border text-sm font-medium",
          hasTools
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
        )}
      >
        <Wrench className="size-4" />
        <span>Tools</span>
        {hasTools && (
          <span className="size-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
            {selectedTools.length}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-full left-0 mb-2 z-50",
            "bg-card border border-border rounded-2xl shadow-xl",
            "w-80 overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2"
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Wrench className="size-4 text-primary" />
              <span className="font-medium text-foreground">Tools</span>
            </div>
            <div className="flex items-center gap-2">
              {hasTools ? (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear all
                </button>
              ) : (
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Select all
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-6 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Tools List */}
          <div className="p-2 max-h-80 overflow-y-auto">
            {AVAILABLE_TOOLS.map((tool) => {
              const isSelected = selectedTools.includes(tool.id)
              const Icon = tool.icon

              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                    "hover:bg-muted/50",
                    isSelected && "bg-primary/5"
                  )}
                >
                  {/* Checkbox */}
                  <div
                    className={cn(
                      "size-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                      isSelected
                        ? "bg-primary border-primary"
                        : "border-border"
                    )}
                  >
                    {isSelected && <Check className="size-3 text-white" />}
                  </div>

                  {/* Icon */}
                  <div
                    className={cn(
                      "size-8 rounded-lg flex items-center justify-center flex-shrink-0",
                      isSelected ? "bg-primary/10" : "bg-muted/50"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium truncate",
                        isSelected ? "text-foreground" : "text-foreground/80"
                      )}
                    >
                      {tool.name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {tool.description}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer */}
          {hasTools && (
            <div className="px-4 py-3 border-t border-border bg-muted/30">
              <p className="text-xs text-muted-foreground">
                {selectedTools.length} tool
                {selectedTools.length !== 1 ? "s" : ""} enabled for this
                conversation
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
