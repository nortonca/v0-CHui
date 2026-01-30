"use client"

import { useState, useRef, useEffect } from "react"
import { Sparkles, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ThinkLevel = "off" | "on" | "deep"

interface ThinkButtonProps {
  thinkLevel: ThinkLevel
  onLevelChange: (level: ThinkLevel) => void
  isStreaming: boolean
}

export default function ThinkButton({
  thinkLevel,
  onLevelChange,
  isStreaming,
}: ThinkButtonProps) {
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

  const isActive = thinkLevel !== "off"

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
          isActive
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/20"
        )}
      >
        <Sparkles className="size-4" />
        <span>Think</span>
        {isActive && (
          <span className="text-xs opacity-80">
            {thinkLevel === "on" ? "On" : "Deep"}
          </span>
        )}
      </button>

      {/* Popover */}
      {isOpen && (
        <div
          className={cn(
            "absolute bottom-full left-0 mb-2 z-50",
            "bg-card border border-border rounded-2xl shadow-xl",
            "w-72 overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2"
          )}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <span className="font-medium text-foreground">Think Mode</span>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="size-6 rounded-full flex items-center justify-center hover:bg-muted/50 text-muted-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Enable extended reasoning for complex tasks.
            </p>

            {/* Segmented Control */}
            <div className="flex bg-muted/50 rounded-xl p-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  onLevelChange("off")
                }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  thinkLevel === "off"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Off
              </button>
              <button
                type="button"
                onClick={() => {
                  onLevelChange("on")
                }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  thinkLevel === "on"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                On
              </button>
              <button
                type="button"
                onClick={() => {
                  onLevelChange("deep")
                }}
                className={cn(
                  "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                  thinkLevel === "deep"
                    ? "bg-primary text-white shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Deep
              </button>
            </div>

            {/* Description based on selection */}
            <div className="rounded-xl bg-muted/30 p-3">
              {thinkLevel === "off" && (
                <p className="text-xs text-muted-foreground">
                  Standard response mode. Best for quick answers and simple
                  tasks.
                </p>
              )}
              {thinkLevel === "on" && (
                <p className="text-xs text-muted-foreground">
                  Basic reasoning enabled. The assistant will think through
                  problems step by step.
                </p>
              )}
              {thinkLevel === "deep" && (
                <p className="text-xs text-muted-foreground">
                  Extended thinking for complex analysis, planning, and
                  multi-step reasoning.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
