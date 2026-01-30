"use client"

import { X, Wrench, Search, Calculator, ImageIcon, Code, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface ToolsSelectorModalContentProps {
  onClose: () => void
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
}

const AVAILABLE_TOOLS = [
  { 
    id: "web-search", 
    label: "Web Search", 
    description: "Search the web for real-time information",
    icon: Search,
    category: "data"
  },
  { 
    id: "calculator", 
    label: "Calculator", 
    description: "Perform mathematical calculations",
    icon: Calculator,
    category: "utilities"
  },
  { 
    id: "image-gen", 
    label: "Image Generation", 
    description: "Generate images from text descriptions",
    icon: ImageIcon,
    category: "creative"
  },
  { 
    id: "code-exec", 
    label: "Code Execution", 
    description: "Run code snippets safely",
    icon: Code,
    category: "development"
  },
  { 
    id: "file-read", 
    label: "File Reader", 
    description: "Read and analyze file contents",
    icon: FileText,
    category: "utilities"
  },
]

export default function ToolsSelectorModalContent({ 
  onClose, 
  selectedTools,
  onToolsChange 
}: ToolsSelectorModalContentProps) {
  const [localSelection, setLocalSelection] = useState<string[]>(selectedTools)

  const handleToggle = (toolId: string) => {
    setLocalSelection(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    )
  }

  const handleSelectAll = () => {
    setLocalSelection(AVAILABLE_TOOLS.map(t => t.id))
  }

  const handleClearAll = () => {
    setLocalSelection([])
  }

  const handleSave = () => {
    onToolsChange(localSelection)
    onClose()
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="size-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Select Tools</h2>
              <p className="text-sm text-muted-foreground">
                {localSelection.length} tool{localSelection.length !== 1 ? 's' : ''} selected
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "size-8 rounded-full flex items-center justify-center",
              "hover:bg-muted transition-colors"
            )}
          >
            <X className="size-4 text-muted-foreground" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-6 pt-4 flex gap-2">
          <button
            onClick={handleSelectAll}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              "bg-muted hover:bg-muted/70 text-foreground"
            )}
          >
            Select All
          </button>
          <button
            onClick={handleClearAll}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              "bg-muted hover:bg-muted/70 text-foreground"
            )}
          >
            Clear All
          </button>
        </div>

        {/* Tools List */}
        <div className="p-6 space-y-2 max-h-[400px] overflow-y-auto">
          {AVAILABLE_TOOLS.map((tool) => {
            const Icon = tool.icon
            const isSelected = localSelection.includes(tool.id)

            return (
              <button
                key={tool.id}
                onClick={() => handleToggle(tool.id)}
                className={cn(
                  "w-full p-3 rounded-xl text-left transition-all",
                  "border-2 hover:border-primary/50",
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border bg-card hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "size-10 rounded-lg flex items-center justify-center flex-shrink-0",
                    isSelected ? "bg-primary/10" : "bg-muted"
                  )}>
                    <Icon className={cn("size-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-foreground mb-0.5">{tool.label}</div>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {tool.description}
                    </p>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="size-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex gap-3">
          <button
            onClick={onClose}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors",
              "bg-muted hover:bg-muted/70 text-foreground"
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl font-medium transition-colors",
              "bg-primary hover:bg-primary/90 text-white"
            )}
          >
          Save Selection
        </button>
      </div>
      </div>
    </div>
  )
}
