"use client"

import { Button } from "@/components/ui/button"
import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActiveButton } from "../types"

interface ImageButtonProps {
  activeButton: ActiveButton
  toggleButton: (button: ActiveButton) => void
  isStreaming: boolean
}

export default function ImageButton({ activeButton, toggleButton, isStreaming }: ImageButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full h-8 w-8 flex-shrink-0 border-gray-200 p-0 transition-colors",
        activeButton === "image" && "bg-gray-100 border-gray-300",
      )}
      onClick={() => toggleButton("image")}
      disabled={isStreaming}
    >
      <ImageIcon className={cn("h-4 w-4 text-gray-500", activeButton === "image" && "text-gray-700")} />
      <span className="sr-only">Image</span>
    </Button>
  )
}
