"use client"

import { AudioWaveform } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceToggleButtonProps {
  isStreaming: boolean
  onClick: () => void
}

export default function VoiceToggleButton({ isStreaming, onClick }: VoiceToggleButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative flex items-center justify-center",
        "rounded-full h-8 w-8 flex-shrink-0",
        "bg-primary text-white",
        "hover:bg-primary/90 transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
      onClick={onClick}
      disabled={isStreaming}
      aria-label="Open voice mode"
    >
      <AudioWaveform className="h-4 w-4" />
    </button>
  )
}
