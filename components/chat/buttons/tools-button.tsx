"use client"

import { useState, useRef, useEffect } from "react"
import { Wrench, Check, Search, Calculator, Code, Palette } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToolsButtonProps {
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  isStreaming: boolean
}

const AVAILABLE_TOOLS = [
  { id: "web-search", name: "Web Search", Icon: Search },
  { id: "calculator", name: "Calculator", Icon: Calculator },
  { id: "code-interpreter", name: "Code Interpreter", Icon: Code },
  { id: "image-gen", name: "Image Generation", Icon: Palette },
]

export default function ToolsButton({ selectedTools, onToolsChange, isStreaming }: ToolsButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const toggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      onToolsChange(selectedTools.filter(id => id !== toolId))
    } else {
      onToolsChange([...selectedTools, toolId])
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          "rounded-full h-8 px-3 flex items-center border border-border gap-1.5 transition-colors bg-background",
          selectedTools.length > 0 && "bg-primary/10 border-primary/20"
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isStreaming}
      >
        <Wrench className={cn("h-4 w-4 text-muted-foreground", selectedTools.length > 0 && "text-primary")} />
        <span className={cn("text-foreground text-sm", selectedTools.length > 0 && "font-medium")}>
          Tools {selectedTools.length > 0 && `(${selectedTools.length})`}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-56 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Select Tools
            </div>
            {AVAILABLE_TOOLS.map((tool) => {
              const isSelected = selectedTools.includes(tool.id)
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => toggleTool(tool.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2 py-2 rounded-lg transition-colors hover:bg-muted/50",
                    isSelected && "bg-primary/5"
                  )}
                >
                  <tool.Icon className={cn("h-4 w-4 text-muted-foreground", isSelected && "text-primary")} />
                  <span className="flex-1 text-left text-sm text-foreground">{tool.name}</span>
                  {isSelected && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
