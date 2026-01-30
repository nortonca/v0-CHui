"use client"

import { Zap, Users, HandHelping } from "lucide-react"
import { cn } from "@/lib/utils"

export type CollaborationMode = "lead" | "collaborate" | "assist"

interface CollaborationModeProps {
  mode: CollaborationMode
  onModeChange: (mode: CollaborationMode) => void
  isCompact?: boolean
}

const MODES = [
  {
    id: "lead" as const,
    label: "Lead",
    shortLabel: "Lead",
    icon: Zap,
    description: "I'll take initiative",
  },
  {
    id: "collaborate" as const,
    label: "Collaborate",
    shortLabel: "Collab",
    icon: Users,
    description: "We work together",
  },
  {
    id: "assist" as const,
    label: "Assist",
    shortLabel: "Assist",
    icon: HandHelping,
    description: "You lead, I help",
  },
]

export default function CollaborationModeToggle({
  mode,
  onModeChange,
  isCompact = false,
}: CollaborationModeProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-1">
        Collaboration Mode
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-1 rounded-xl bg-muted/50 border border-border">
        {MODES.map((m) => {
          const Icon = m.icon
          const isActive = mode === m.id

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeChange(m.id)}
              className={cn(
                "flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-2.5 sm:py-1.5 rounded-lg transition-all text-xs sm:text-xs font-medium whitespace-nowrap flex-1 sm:flex-none",
                "min-h-[44px] sm:min-h-auto",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground active:bg-muted/75"
              )}
              title={m.description}
            >
              <Icon className="size-4 sm:size-3.5 flex-shrink-0" />
              <span className="sm:hidden">{m.label}</span>
              <span className="hidden sm:inline">{m.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
