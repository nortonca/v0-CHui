"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActiveButton } from "../types"

interface ThinkButtonProps {
  activeButton: ActiveButton
  toggleButton: (button: ActiveButton) => void
  isStreaming: boolean
  setActiveButton: (button: ActiveButton) => void
  focusTextarea: () => void
}

export default function ThinkButton({
  activeButton,
  toggleButton,
  isStreaming,
  setActiveButton,
  focusTextarea,
}: ThinkButtonProps) {
  const [thinkingLevel, setThinkingLevel] = useState<"Low" | "Medium" | "High" | null>(null)

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        className={cn(
          "rounded-full h-8 px-3 flex items-center border-gray-200 gap-1.5 transition-colors",
          activeButton === "think" && "bg-gray-100 border-gray-300",
        )}
        onClick={() => toggleButton("think")}
        disabled={isStreaming}
      >
        <Lightbulb className={cn("h-4 w-4 text-gray-500", activeButton === "think" && "text-gray-700")} />
        <span className={cn("text-gray-900 text-sm", activeButton === "think" && "font-medium")}>
          {thinkingLevel ? `Think: ${thinkingLevel}` : "Think"}
        </span>
      </Button>

      {activeButton === "think" && (
        <div className="absolute bottom-full left-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] z-10">
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setThinkingLevel(null)
              setActiveButton("none")
              focusTextarea()
            }}
          >
            None
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setThinkingLevel("Low")
              setActiveButton("none")
              focusTextarea()
            }}
          >
            Low
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setThinkingLevel("Medium")
              setActiveButton("none")
              focusTextarea()
            }}
          >
            Medium
          </button>
          <button
            className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-50 text-gray-700"
            onClick={() => {
              setThinkingLevel("High")
              setActiveButton("none")
              focusTextarea()
            }}
          >
            High
          </button>
        </div>
      )}
    </div>
  )
}
