"use client"

import React, { useState } from "react"
import { X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolsModalContentProps {
  onClose: () => void
}

const MOCK_TOOLS = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    category: "data",
    isConnected: true,
    isAvailable: true,
  },
  {
    id: "calculator",
    name: "Calculator",
    description: "Perform mathematical calculations",
    category: "utilities",
    isConnected: true,
    isAvailable: true,
  },
  {
    id: "weather",
    name: "Weather",
    description: "Get current weather information",
    category: "data",
    isConnected: false,
    isAvailable: true,
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute and analyze code",
    category: "utilities",
    isConnected: false,
    isAvailable: false,
  },
]

const CATEGORIES = [
  { id: "all", name: "All" },
  { id: "data", name: "Data" },
  { id: "integrations", name: "Integrations" },
  { id: "utilities", name: "Utilities" },
]

export default function ToolsModalContent({ onClose }: ToolsModalContentProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [tools, setTools] = useState(MOCK_TOOLS)

  const filteredTools = tools.filter((tool) =>
    activeCategory === "all" ? true : tool.category === activeCategory
  )

  const connectedCount = tools.filter((t) => t.isConnected).length

  const toggleConnection = (toolId: string) => {
    setTools((prev) =>
      prev.map((tool) =>
        tool.id === toolId && tool.isAvailable
          ? { ...tool, isConnected: !tool.isConnected }
          : tool
      )
    )
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-lg max-h-[calc(100vh-8rem)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tools-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 id="tools-modal-title" className="text-lg font-semibold text-foreground">
              MCP Tools
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {connectedCount} {connectedCount === 1 ? "tool" : "tools"} connected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close tools"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-border overflow-x-auto">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {filteredTools.map((tool) => (
              <div
                key={tool.id}
                className={cn(
                  "p-4 rounded-xl border transition-all",
                  tool.isConnected
                    ? "bg-primary/5 border-primary/20"
                    : "bg-card border-border"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Zap className={cn(
                        "size-4",
                        tool.isConnected ? "text-primary" : "text-muted-foreground"
                      )} />
                      <h3 className="font-medium text-foreground">{tool.name}</h3>
                      {!tool.isAvailable && (
                        <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tool.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleConnection(tool.id)}
                    disabled={!tool.isAvailable}
                    className={cn(
                      "relative w-11 h-6 rounded-full transition-colors",
                      tool.isConnected ? "bg-primary" : "bg-muted",
                      !tool.isAvailable && "opacity-50 cursor-not-allowed"
                    )}
                    aria-label={tool.isConnected ? "Disconnect" : "Connect"}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform",
                        tool.isConnected ? "left-[22px]" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
