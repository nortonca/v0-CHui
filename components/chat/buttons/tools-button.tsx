"use client"

import { Wrench } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModal } from "@/components/providers/modal-provider"
import ToolsSelectorModalContent from "../tools-selector-modal-content"

interface ToolsButtonProps {
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  isStreaming: boolean
}

export default function ToolsButton({ 
  selectedTools, 
  onToolsChange, 
  isStreaming 
}: ToolsButtonProps) {
  const { openModal, closeModal } = useModal()

  const handleClick = () => {
    openModal(
      "tools-selector",
      <ToolsSelectorModalContent
        onClose={() => closeModal("tools-selector")}
        selectedTools={selectedTools}
        onToolsChange={onToolsChange}
      />,
      () => {}
    )
  }

  const hasTools = selectedTools.length > 0

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isStreaming}
      className={cn(
        "rounded-full h-8 px-3 flex items-center gap-1.5 border transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        hasTools
          ? "bg-primary/10 border-primary/20 text-primary"
          : "bg-background border-border text-muted-foreground hover:bg-muted"
      )}
      aria-label="Select tools"
    >
      <Wrench className="size-4" />
      {hasTools && (
        <span className="text-xs font-medium">{selectedTools.length}</span>
      )}
    </button>
  )
}
