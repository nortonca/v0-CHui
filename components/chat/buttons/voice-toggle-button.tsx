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
        "bg-primary text-white",
        "hover:bg-primary/90 transition-all duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "shadow-sm hover:shadow-md",
        "group"
      )}
      onClick={onClick}
      disabled={isStreaming}
      aria-label="Open voice mode"
    >
      <AudioWaveform className={cn(
        "h-5 w-5 transition-transform duration-200",
        "group-hover:scale-110"
      )} />
      
      {/* Subtle glow effect */}
      <span className={cn(
        "absolute inset-0 rounded-full bg-primary opacity-0",
        "group-hover:opacity-50 transition-opacity duration-200",
        "blur-md -z-10"
      )} />
    </button>
  )
}
