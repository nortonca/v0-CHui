"use client"

import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Update the interface
interface ImageButtonProps {
  isActive: boolean
  toggleButton: () => void
  isStreaming: boolean
}

// Update the component
export default function ImageButton({ isActive, toggleButton, isStreaming }: ImageButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full h-8 w-8 flex-shrink-0 border-gray-200 p-0 transition-colors",
        isActive && "bg-primary/10 border-primary/20",
      )}
      onClick={toggleButton}
      disabled={isStreaming}
    >
      <ImageIcon className={cn("h-4 w-4 text-gray-500", isActive && "text-primary")} />
      <span className="sr-only">Image</span>
    </Button>
  )
}
