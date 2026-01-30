"use client"

import { Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModal } from "@/components/providers/modal-provider"
import ThinkModalContent, { type ThinkLevel } from "../think-modal-content"

export type { ThinkLevel }

interface ThinkButtonProps {
  thinkLevel: ThinkLevel
  onLevelChange: (level: ThinkLevel) => void
  isStreaming: boolean
}

export default function ThinkButton({ 
  thinkLevel, 
  onLevelChange, 
  isStreaming 
}: ThinkButtonProps) {
  const { openModal, closeModal } = useModal()

  const handleClick = () => {
    openModal(
      "think",
      <ThinkModalContent
        onClose={() => closeModal("think")}
        currentLevel={thinkLevel}
        onLevelChange={onLevelChange}
      />,
      () => {}
    )
  }

  const isActive = thinkLevel !== "off"

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isStreaming}
      className={cn(
        "rounded-full h-8 px-3 flex items-center gap-1.5 border transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isActive
          ? "bg-primary/10 border-primary/20 text-primary"
          : "bg-background border-border text-muted-foreground hover:bg-muted"
      )}
      aria-label="Think mode"
    >
      <Brain className="size-4" />
      {isActive && (
        <span className="text-xs font-medium capitalize">{thinkLevel}</span>
      )}
    </button>
  )
}
