"use client"

import { useState, useRef, useEffect } from "react"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

interface ThinkButtonProps {
  thinkLevel: "off" | "low" | "medium" | "high"
  onLevelChange: (level: "off" | "low" | "medium" | "high") => void
  isStreaming: boolean
}

const THINK_LEVELS = [
  { id: "off" as const, name: "Off", description: "No reasoning" },
  { id: "low" as const, name: "Low", description: "Basic reasoning" },
  { id: "medium" as const, name: "Medium", description: "Balanced reasoning" },
  { id: "high" as const, name: "High", description: "Deep reasoning" },
]

export default function ThinkButton({ thinkLevel, onLevelChange, isStreaming }: ThinkButtonProps) {
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

  const isActive = thinkLevel !== "off"

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        className={cn(
          "rounded-full h-8 px-3 flex items-center border border-border gap-1.5 transition-colors bg-background",
          isActive && "bg-primary/10 border-primary/20"
        )}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isStreaming}
      >
        <Lightbulb className={cn("h-4 w-4 text-muted-foreground", isActive && "text-primary")} />
        <span className={cn("text-foreground text-sm", isActive && "font-medium")}>
          Think {isActive && `(${thinkLevel})`}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-48 bg-card border border-border rounded-xl shadow-lg overflow-hidden animate-fadeIn z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground px-2 py-1.5">
              Reasoning Level
            </div>
            {THINK_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => {
                  onLevelChange(level.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex flex-col gap-0.5 px-2 py-2 rounded-lg transition-colors hover:bg-muted/50 text-left",
                  thinkLevel === level.id && "bg-primary/5"
                )}
              >
                <span className={cn(
                  "text-sm text-foreground",
                  thinkLevel === level.id && "font-medium text-primary"
                )}>
                  {level.name}
                </span>
                <span className="text-xs text-muted-foreground">{level.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
