"use client"

import React, { useState } from "react"

import { X, Settings, History, Sparkles, HelpCircle, User, Plug } from "lucide-react"
import { cn } from "@/lib/utils"
import ToolsModal from "@/components/tools/tools-modal"

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  const [isToolsOpen, setIsToolsOpen] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Tools Modal */}
      <ToolsModal isOpen={isToolsOpen} onClose={() => setIsToolsOpen(false)} />

      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={cn(
          "fixed top-16 left-4 right-4 md:left-auto md:right-auto md:top-20 md:left-1/2 md:-translate-x-1/2",
          "bg-card border border-border rounded-2xl shadow-2xl z-50",
          "w-auto md:w-[420px] max-h-[calc(100vh-120px)] overflow-hidden",
          "animate-scaleIn"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="menu-modal-title" className="text-lg font-semibold text-foreground">
            Menu
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3">
          <nav className="space-y-1">
            <MenuButton
              icon={<Sparkles className="size-5" />}
              label="New Chat"
              description="Start a fresh conversation"
              onClick={() => {
                // Handle new chat
                onClose()
              }}
            />
            <MenuButton
              icon={<History className="size-5" />}
              label="Chat History"
              description="View previous conversations"
              onClick={() => {
                // Handle history
                onClose()
              }}
            />
            <MenuButton
              icon={<Plug className="size-5" />}
              label="MCP Tools"
              description="Manage tool connections"
              onClick={() => {
                setIsToolsOpen(true)
                onClose()
              }}
              badge="2 active"
            />
            <MenuButton
              icon={<User className="size-5" />}
              label="Profile"
              description="Manage your account"
              onClick={() => {
                // Handle profile
                onClose()
              }}
            />
            <MenuButton
              icon={<Settings className="size-5" />}
              label="Settings"
              description="Customize your experience"
              onClick={() => {
                // Handle settings
                onClose()
              }}
            />
            <MenuButton
              icon={<HelpCircle className="size-5" />}
              label="Help & Support"
              description="Get help and resources"
              onClick={() => {
                // Handle help
                onClose()
              }}
            />
          </nav>
        </div>
      </div>
    </>
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
        "hover:bg-muted/50 transition-colors text-left group"
      )}
    >
      <div className="flex-shrink-0 mt-0.5 text-muted-foreground transition-colors">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {label}
          </span>
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
