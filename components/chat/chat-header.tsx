"use client"

import { Button } from "@/components/ui/button"
import { Menu, PenSquare, Activity } from "lucide-react"
import { useModal } from "@/components/providers/modal-provider"
import MenuModalContent from "./menu-modal-content"
import { cn } from "@/lib/utils"

interface ChatHeaderProps {
  onActivityClick?: () => void
  assistantName?: string
  activityCount?: number
}

export default function ChatHeader({ 
  onActivityClick, 
  assistantName,
  activityCount = 0 
}: ChatHeaderProps) {
  const { openModal, closeModal } = useModal()

  const handleOpenMenu = () => {
    openModal("menu", <MenuModalContent onClose={() => closeModal("menu")} />, () => {})
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-12 flex items-center px-4 z-20 bg-background border-b border-border">
      <div className="w-full flex items-center justify-between px-2">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-8 w-8"
          onClick={handleOpenMenu}
        >
          <Menu className="h-5 w-5 text-foreground" />
          <span className="sr-only">Menu</span>
        </Button>

        <h1 className="text-base font-medium text-foreground">
          {assistantName || "Assistant"}
        </h1>

        <div className="flex items-center gap-1">
          {onActivityClick && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full h-8 w-8 relative"
              onClick={onActivityClick}
            >
              <Activity className="h-5 w-5 text-foreground" />
              {activityCount > 0 && (
                <span className={cn(
                  "absolute -top-0.5 -right-0.5 size-4 rounded-full",
                  "bg-primary text-white text-[10px] font-medium",
                  "flex items-center justify-center"
                )}>
                  {activityCount}
                </span>
              )}
              <span className="sr-only">Activity</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
            <PenSquare className="h-5 w-5 text-foreground" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
