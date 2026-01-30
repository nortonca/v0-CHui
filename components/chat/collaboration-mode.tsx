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
    <div className="flex flex-col gap-1.5">
      <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide px-1">
        Mode
      </div>
      <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/50 border border-border">
        {MODES.map((m) => {
          const Icon = m.icon
          const isActive = mode === m.id

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onModeChange(m.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all text-xs font-medium whitespace-nowrap",
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              title={m.description}
            >
              <Icon className="size-3.5" />
              <span>{m.shortLabel}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
