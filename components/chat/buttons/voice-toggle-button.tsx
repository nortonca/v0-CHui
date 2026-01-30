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
        "rounded-full h-10 w-10 flex-shrink-0",
        "bg-primary/10 hover:bg-primary/20 border border-primary/30",
        "transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "group"
      )}
      onClick={onClick}
      disabled={isStreaming}
      aria-label="Open voice mode"
    >
      <AudioWaveform className={cn(
        "h-5 w-5 text-primary transition-transform duration-200",
        "group-hover:scale-110"
      )} />
      
      {/* Subtle glow on hover */}
      <span className={cn(
        "absolute inset-0 rounded-full bg-primary/5 opacity-0",
        "group-hover:opacity-100 transition-opacity duration-200",
        "blur-sm -z-10"
      )} />
    </button>
  )
}
