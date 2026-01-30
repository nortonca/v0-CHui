"use client"

import React from "react"

import { useState } from "react"
import { 
  X, 
  Plug, 
  Check, 
  ChevronRight,
  Database,
  Globe,
  FileText,
  Code,
  Search,
  MessageSquare,
  Zap,
  Shield
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface MCPTool {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  category: "data" | "integration" | "utility"
  isConnected: boolean
  isAvailable: boolean
}

const mcpTools: MCPTool[] = [
  {
    id: "context7",
    name: "Context7",
    description: "Documentation and context tools for enhanced responses",
    icon: <FileText className="size-5" />,
    category: "data",
    isConnected: true,
    isAvailable: true,
  },
  {
    id: "groq",
    name: "Groq",
    description: "Fast LLM inference for quick responses",
    icon: <Zap className="size-5" />,
    category: "integration",
    isConnected: true,
    isAvailable: true,
  },
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the web for real-time information",
    icon: <Globe className="size-5" />,
    category: "utility",
    isConnected: false,
    isAvailable: true,
  },
  {
    id: "database",
    name: "Database",
    description: "Connect to databases for data operations",
    icon: <Database className="size-5" />,
    category: "data",
    isConnected: false,
    isAvailable: true,
  },
  {
    id: "code-interpreter",
    name: "Code Interpreter",
    description: "Execute code and analyze results",
    icon: <Code className="size-5" />,
    category: "utility",
    isConnected: false,
    isAvailable: true,
  },
  {
    id: "semantic-search",
    name: "Semantic Search",
    description: "Advanced search with semantic understanding",
    icon: <Search className="size-5" />,
    category: "data",
    isConnected: false,
    isAvailable: false,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Connect to Slack workspaces",
    icon: <MessageSquare className="size-5" />,
    category: "integration",
    isConnected: false,
    isAvailable: false,
  },
  {
    id: "auth",
    name: "Authentication",
    description: "Secure authentication services",
    icon: <Shield className="size-5" />,
    category: "integration",
    isConnected: false,
    isAvailable: false,
  },
]

export default function ToolsModal({ isOpen, onClose }: ToolsModalProps) {
  const [tools, setTools] = useState<MCPTool[]>(mcpTools)
  const [activeCategory, setActiveCategory] = useState<"all" | "data" | "integration" | "utility">("all")

  const filteredTools = activeCategory === "all" 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory)

  const connectedCount = tools.filter(t => t.isConnected).length

  const handleToggleConnection = (toolId: string) => {
    setTools(prev => prev.map(tool => {
      if (tool.id === toolId && tool.isAvailable) {
        return { ...tool, isConnected: !tool.isConnected }
      }
      return tool
    }))
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed top-16 left-4 right-4 md:left-auto md:right-auto md:top-20 md:left-1/2 md:-translate-x-1/2",
          "bg-card border border-border rounded-2xl shadow-2xl z-50",
          "w-auto md:w-[480px] max-h-[calc(100vh-120px)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tools-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
              <Plug className="size-5 text-primary" />
            </div>
            <div>
              <h2 id="tools-modal-title" className="text-base font-semibold text-foreground">
                MCP Tools
              </h2>
              <p className="text-xs text-muted-foreground">
                {connectedCount} of {tools.length} connected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close tools"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1 px-4 py-3 border-b border-border overflow-x-auto">
          {[
            { key: "all", label: "All" },
            { key: "data", label: "Data" },
            { key: "integration", label: "Integrations" },
            { key: "utility", label: "Utilities" },
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key as typeof activeCategory)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                activeCategory === category.key
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-muted/50"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Tools List */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="space-y-2">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onToggle={() => handleToggleConnection(tool.id)}
              />
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                <Plug className="size-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No tools in this category</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground text-center">
            Tools extend AI capabilities with external integrations
          </p>
        </div>
      </div>
    </>
  )
}

interface ToolCardProps {
  tool: MCPTool
  onToggle: () => void
}

function ToolCard({ tool, onToggle }: ToolCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 rounded-xl border transition-colors",
        tool.isConnected 
          ? "border-primary/20 bg-primary/5" 
          : "border-border bg-card hover:bg-muted/30",
        !tool.isAvailable && "opacity-50"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0",
        tool.isConnected ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {tool.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground truncate">
            {tool.name}
          </span>
          {tool.isConnected && (
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              <Check className="size-3" />
              Connected
            </span>
          )}
          {!tool.isAvailable && (
            <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
              Coming Soon
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {tool.description}
        </p>
      </div>

      {/* Action */}
      <button
        onClick={onToggle}
        disabled={!tool.isAvailable}
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 transition-colors",
          tool.isAvailable 
            ? tool.isConnected
              ? "bg-primary text-white hover:bg-primary/90"
              : "bg-muted hover:bg-muted/80 text-muted-foreground"
            : "bg-muted/50 text-muted-foreground cursor-not-allowed"
        )}
        aria-label={tool.isConnected ? `Disconnect ${tool.name}` : `Connect ${tool.name}`}
      >
        {tool.isConnected ? (
          <Check className="size-4" />
        ) : (
          <ChevronRight className="size-4" />
        )}
      </button>
    </div>
  )
}
