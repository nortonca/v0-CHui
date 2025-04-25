"use client"

import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ActiveButton } from "../types"

interface SearchButtonProps {
  activeButton: ActiveButton
  toggleButton: (button: ActiveButton) => void
  isStreaming: boolean
}

export default function SearchButton({ activeButton, toggleButton, isStreaming }: SearchButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className={cn(
        "rounded-full h-8 px-3 flex items-center border-gray-200 gap-1.5 transition-colors",
        activeButton === "deepSearch" && "bg-gray-100 border-gray-300",
      )}
      onClick={() => toggleButton("deepSearch")}
      disabled={isStreaming}
    >
      <Search className={cn("h-4 w-4 text-gray-500", activeButton === "deepSearch" && "text-gray-700")} />
      <span className={cn("text-gray-900 text-sm", activeButton === "deepSearch" && "font-medium")}>Search</span>
    </Button>
  )
}
