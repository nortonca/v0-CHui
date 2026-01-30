"use client"

import React, { useState } from "react"
import { X, Zap, Search, Plus, Check, Globe, Terminal, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Tool {
  id: string
  name: string
  description: string
  category: string
  isConnected: boolean
  isAvailable: boolean
  isCustom?: boolean
  type?: "local" | "http" | "sse"
  config?: {
    command?: string
    args?: string
    url?: string
    envVars?: string
  }
}

interface ToolsModalContentProps {
  onClose: () => void
}

const MOCK_TOOLS: Tool[] = [
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
  const [tools, setTools] = useState<Tool[]>(MOCK_TOOLS)
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  
  // MCP Form State
  const [serverType, setServerType] = useState<"local" | "http" | "sse">("local")
  const [serverName, setServerName] = useState("")
  const [serverDescription, setServerDescription] = useState("")
  // Local server fields
  const [command, setCommand] = useState("")
  const [args, setArgs] = useState("")
  const [envVars, setEnvVars] = useState("")
  // Remote server fields
  const [serverUrl, setServerUrl] = useState("")

  const [newToolName, setNewToolName] = useState("")
  const [newToolDescription, setNewToolDescription] = useState("")

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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

  const resetForm = () => {
    setServerType("local")
    setServerName("")
    setServerDescription("")
    setCommand("")
    setArgs("")
    setEnvVars("")
    setServerUrl("")
    setShowAddForm(false)
    setNewToolName("")
    setNewToolDescription("")
  }

  const isFormValid = () => {
    if (!serverName.trim()) return false
    if (serverType === "local" && !command.trim()) return false
    if ((serverType === "http" || serverType === "sse") && !serverUrl.trim()) return false
    return true
  }

  const handleAddTool = () => {
    if (!isFormValid()) return

    const newTool: Tool = {
      id: `custom-${Date.now()}`,
      name: serverName,
      description: serverDescription || `Custom ${serverType.toUpperCase()} MCP server`,
      category: "integrations",
      isConnected: false,
      isAvailable: true,
      isCustom: true,
      type: serverType,
      config: serverType === "local" 
        ? { command, args, envVars }
        : { url: serverUrl }
    }

    setTools((prev) => [...prev, newTool])
    resetForm()
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

        {/* Search Bar */}
        <div className="px-6 py-3 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-background",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20"
              )}
            />
          </div>
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
          {/* Add Tool Button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className={cn(
                "w-full mb-3 p-4 rounded-xl border-2 border-dashed border-border",
                "hover:border-primary/50 hover:bg-primary/5 transition-all",
                "flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
              )}
            >
              <Plus className="size-4" />
              <span className="text-sm font-medium">Add MCP Server</span>
            </button>
          )}

          {/* Add MCP Server Form */}
          {showAddForm && (
            <div className="mb-4 p-4 rounded-xl border border-primary/20 bg-card">
              <div className="space-y-4">
                {/* Server Type Selection */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Server Type
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setServerType("local")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        serverType === "local"
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Terminal className="size-4" />
                      Local
                    </button>
                    <button
                      type="button"
                      onClick={() => setServerType("http")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        serverType === "http"
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Globe className="size-4" />
                      HTTP
                    </button>
                    <button
                      type="button"
                      onClick={() => setServerType("sse")}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        serverType === "sse"
                          ? "bg-primary text-white"
                          : "bg-muted/50 text-muted-foreground hover:bg-muted"
                      )}
                    >
                      <Globe className="size-4" />
                      SSE
                    </button>
                  </div>
                </div>

                {/* Server Name */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Server Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., sentry, notion, github"
                    value={serverName}
                    onChange={(e) => setServerName(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-border bg-background",
                      "text-sm text-foreground placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Description <span className="text-muted-foreground/60">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What does this server do?"
                    value={serverDescription}
                    onChange={(e) => setServerDescription(e.target.value)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg border border-border bg-background",
                      "text-sm text-foreground placeholder:text-muted-foreground",
                      "focus:outline-none focus:ring-2 focus:ring-primary/20"
                    )}
                  />
                </div>

                {/* Local Server Fields */}
                {serverType === "local" && (
                  <>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Command
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., npx, docker, node"
                        value={command}
                        onChange={(e) => setCommand(e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border border-border bg-background font-mono",
                          "text-sm text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Arguments <span className="text-muted-foreground/60">(space-separated)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., @sentry/mcp-server@latest --host=https://sentry.io"
                        value={args}
                        onChange={(e) => setArgs(e.target.value)}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border border-border bg-background font-mono",
                          "text-sm text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20"
                        )}
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground mb-2 block">
                        Environment Variables <span className="text-muted-foreground/60">(KEY=value, one per line)</span>
                      </label>
                      <textarea
                        placeholder={"SENTRY_ACCESS_TOKEN=your_token\nSENTRY_HOST=https://sentry.io"}
                        value={envVars}
                        onChange={(e) => setEnvVars(e.target.value)}
                        rows={3}
                        className={cn(
                          "w-full px-3 py-2 rounded-lg border border-border bg-background font-mono",
                          "text-sm text-foreground placeholder:text-muted-foreground",
                          "focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        )}
                      />
                    </div>
                  </>
                )}

                {/* Remote Server Fields (HTTP/SSE) */}
                {(serverType === "http" || serverType === "sse") && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-2 block">
                      Server URL
                    </label>
                    <input
                      type="url"
                      placeholder={serverType === "sse" 
                        ? "e.g., https://docs.mcp.cloudflare.com/sse"
                        : "e.g., https://api.example.com/mcp"
                      }
                      value={serverUrl}
                      onChange={(e) => setServerUrl(e.target.value)}
                      className={cn(
                        "w-full px-3 py-2 rounded-lg border border-border bg-background font-mono",
                        "text-sm text-foreground placeholder:text-muted-foreground",
                        "focus:outline-none focus:ring-2 focus:ring-primary/20"
                      )}
                    />
                    <p className="text-xs text-muted-foreground mt-1.5">
                      {serverType === "sse" 
                        ? "URL endpoint for Server-Sent Events connection"
                        : "HTTP endpoint for the MCP server"
                      }
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleAddTool}
                    disabled={!isFormValid()}
                    className={cn(
                      "flex-1 px-3 py-2.5 rounded-lg bg-primary text-white",
                      "hover:bg-primary/90 transition-colors text-sm font-medium",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "flex items-center justify-center gap-1.5"
                    )}
                  >
                    <Check className="size-4" />
                    Add Server
                  </button>
                  <button
                    onClick={resetForm}
                    className={cn(
                      "px-4 py-2.5 rounded-lg border border-border bg-background",
                      "hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
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
                    <div className="flex items-center gap-2 flex-wrap">
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
                      {tool.isCustom && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                          Custom
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
