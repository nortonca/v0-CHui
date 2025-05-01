"use client"

import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"

// Update the interface
interface ThinkButtonProps {
  isActive: boolean
  toggleButton: () => void
  isStreaming: boolean
}

// Update the component
export default function ThinkButton({ isActive, toggleButton, isStreaming }: ThinkButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "rounded-full h-8 px-3 flex items-center border-gray-200 gap-1.5 transition-colors",
        isActive && "bg-primary/10 border-primary/20",
      )}
      onClick={toggleButton}
      disabled={isStreaming}
    >
      <Lightbulb className={cn("h-4 w-4 text-gray-500", isActive && "text-primary")} />
      <span className={cn("text-gray-900 text-sm", isActive && "font-medium")}>Think</span>
    </Button>
  )
}
