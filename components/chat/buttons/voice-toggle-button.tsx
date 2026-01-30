"use client"

import { Button } from "@/components/ui/button"
import { AudioWaveform } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceToggleButtonProps {
  isStreaming: boolean
  onClick: () => void
}

export default function VoiceToggleButton({ isStreaming, onClick }: VoiceToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(
        "rounded-full h-10 w-10 flex-shrink-0 transition-all duration-200 hover:bg-muted",
      )}
      onClick={onClick}
      disabled={isStreaming}
    >
      <AudioWaveform className="h-5 w-5 text-muted-foreground" />
      <span className="sr-only">Voice Mode</span>
    </Button>
  )
}
