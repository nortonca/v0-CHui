"use client"

import { X, Brain, Sparkles, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export type ThinkLevel = "off" | "on" | "deep"

interface ThinkPanelProps {
  isExpanded: boolean
  onToggle: () => void
  thinkLevel: ThinkLevel
  onLevelChange: (level: ThinkLevel) => void
  isMobile?: boolean
}

const THINK_LEVELS = [
  {
    id: "off" as const,
    label: "Off",
    icon: X,
    description: "No extended thinking",
    color: "text-muted-foreground",
  },
  {
    id: "on" as const,
    label: "On",
    icon: Brain,
    description: "Basic reasoning for better answers",
    color: "text-blue-500",
  },
  {
    id: "deep" as const,
    label: "Deep",
    icon: Sparkles,
    description: "Extended thinking for complex tasks",
    color: "text-purple-500",
  },
]

export default function ThinkPanel({
  isExpanded,
  onToggle,
  thinkLevel,
  onLevelChange,
  isMobile = false,
}: ThinkPanelProps) {
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
              <Brain className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Think Mode</h3>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Close think panel"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3 space-y-2">
            {THINK_LEVELS.map((level) => {
              const Icon = level.icon
              const isActive = thinkLevel === level.id

              return (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => {
                    onLevelChange(level.id)
                    onToggle()
                  }}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl border transition-all text-left",
                    isActive
                      ? "bg-primary/5 border-primary/20 ring-1 ring-primary/20"
                      : "bg-background border-border hover:border-primary/30 hover:bg-muted/50"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-5 mt-0.5 flex-shrink-0",
                      isActive ? level.color : "text-muted-foreground"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "font-medium text-sm",
                          isActive ? "text-foreground" : "text-foreground"
                        )}
                      >
                        {level.label}
                      </span>
                      {isActive && (
                        <div className="size-2 rounded-full bg-primary animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {level.description}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Footer tip */}
          <div className="px-4 py-3 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground">
              <Zap className="size-3 inline mr-1" />
              Higher thinking levels may take longer but produce better results for complex questions.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
