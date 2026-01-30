"use client"

import React from "react"
import { X, Settings, History, Sparkles, HelpCircle, User, Plug } from "lucide-react"
import { cn } from "@/lib/utils"
import { useModal } from "@/components/providers/modal-provider"
import ToolsModalContent from "@/components/tools/tools-modal-content"

interface MenuModalContentProps {
  onClose: () => void
}

export default function MenuModalContent({ onClose }: MenuModalContentProps) {
  const { openModal, closeModal } = useModal()

  const handleOpenTools = () => {
    openModal("tools", <ToolsModalContent onClose={() => closeModal("tools")} />, () => {})
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-md max-h-[calc(100vh-8rem)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="menu-modal-title" className="text-lg font-semibold text-foreground">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3 overflow-y-auto">
          <nav className="space-y-1">
            <MenuButton
              icon={<Sparkles className="size-5" />}
              label="New Chat"
              description="Start a fresh conversation"
              onClick={() => {
                console.log("[v0] New chat clicked")
                onClose()
              }}
            />
            <MenuButton
              icon={<History className="size-5" />}
              label="Chat History"
              description="View previous conversations"
              onClick={() => {
                console.log("[v0] Chat history clicked")
                onClose()
              }}
            />
            <MenuButton
              icon={<Plug className="size-5" />}
              label="MCP Tools"
              description="Manage tool connections"
              onClick={handleOpenTools}
              badge="2 active"
            />
            <MenuButton
              icon={<User className="size-5" />}
              label="Profile"
              description="Manage your account"
              onClick={() => {
                console.log("[v0] Profile clicked")
                onClose()
              }}
            />
            <MenuButton
              icon={<Settings className="size-5" />}
              label="Settings"
              description="Customize your experience"
              onClick={() => {
                console.log("[v0] Settings clicked")
                onClose()
              }}
            />
            <MenuButton
              icon={<HelpCircle className="size-5" />}
              label="Help & Support"
              description="Get help and resources"
              onClick={() => {
                console.log("[v0] Help clicked")
                onClose()
              }}
            />
          </nav>
        </div>
      </div>
    </div>
  )
}

interface MenuButtonProps {
  icon: React.ReactNode
  label: string
  description: string
  onClick: () => void
  badge?: string
}

function MenuButton({ icon, label, description, onClick, badge }: MenuButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-start gap-4 px-4 py-3.5 rounded-xl",
        "hover:bg-muted/50 transition-colors text-left"
      )}
    >
      <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
              {badge}
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground mt-0.5">{description}</div>
      </div>
    </button>
  )
}
