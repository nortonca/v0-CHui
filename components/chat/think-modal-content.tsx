"use client"

import { X, Brain, Zap, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export type ThinkLevel = "off" | "on" | "deep"

interface ThinkModalContentProps {
  onClose: () => void
  currentLevel: ThinkLevel
  onLevelChange: (level: ThinkLevel) => void
}

const THINK_LEVELS = [
  { 
    id: "off" as const, 
    label: "Off", 
    description: "Standard responses without extended reasoning",
    icon: Brain,
    color: "text-muted-foreground"
  },
  { 
    id: "on" as const, 
    label: "On", 
    description: "Basic reasoning to improve response quality",
    icon: Zap,
    color: "text-blue-500"
  },
  { 
    id: "deep" as const, 
    label: "Deep", 
    description: "Extended thinking for complex problems",
    icon: Sparkles,
    color: "text-primary"
  },
]

export default function ThinkModalContent({ 
  onClose, 
  currentLevel,
  onLevelChange 
}: ThinkModalContentProps) {
  const handleSelect = (level: ThinkLevel) => {
    onLevelChange(level)
    onClose()
  }

  return (
    <div className="w-full max-w-md bg-background rounded-3xl border border-border shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Brain className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Think Mode</h2>
            <p className="text-sm text-muted-foreground">Choose reasoning level</p>
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

      {/* Content */}
      <div className="p-6 space-y-3">
        {THINK_LEVELS.map((level) => {
          const Icon = level.icon
          const isSelected = currentLevel === level.id

          return (
            <button
              key={level.id}
              onClick={() => handleSelect(level.id)}
              className={cn(
                "w-full p-4 rounded-xl text-left transition-all",
                "border-2 hover:border-primary/50",
                isSelected 
                  ? "border-primary bg-primary/5" 
                  : "border-border bg-card hover:bg-muted/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "size-10 rounded-lg flex items-center justify-center flex-shrink-0",
                  isSelected ? "bg-primary/10" : "bg-muted"
                )}>
                  <Icon className={cn("size-5", isSelected ? level.color : "text-muted-foreground")} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground">{level.label}</span>
                    {isSelected && (
                      <div className="size-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {level.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
