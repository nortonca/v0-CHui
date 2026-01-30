"use client"

import React from "react"

import { cn } from "@/lib/utils"
import { 
  ImageIcon, 
  Brain, 
  Wrench, 
  NotebookPen, 
  ListTodo, 
  BookOpen, 
  History,
  Zap
} from "lucide-react"
import type { ActiveButtonState } from "../types"

interface TrayItem {
  id: string
  label: string
  icon: React.ReactNode
  description: string
  isActive?: boolean
  badge?: string | number
}

interface ComposerTrayProps {
  isOpen: boolean
  onClose: () => void
  onPanelToggle: (panel: string) => void
  activePanel: string | null
  activeButtons: ActiveButtonState
  onImageToggle: () => void
  onAddImages: (files: FileList) => void
  memoriesCount: number
  tasksCount: number
  tasksCompletedCount: number
  checkpointsCount: number
  isMobile: boolean
}

export default function ComposerTray({
  isOpen,
  onClose,
  onPanelToggle,
  activePanel,
  activeButtons,
  onImageToggle,
  onAddImages,
  memoriesCount,
  tasksCount,
  tasksCompletedCount,
  checkpointsCount,
  isMobile,
}: ComposerTrayProps) {
  const trayItems: TrayItem[] = [
    {
      id: "image",
      label: "Image",
      icon: <ImageIcon className="w-5 h-5" />,
      description: "Attach images",
      isActive: activeButtons.image,
    },
    {
      id: "think",
      label: "Think",
      icon: <Brain className="w-5 h-5" />,
      description: "Extended reasoning",
      isActive: activeButtons.thinkLevel !== "off",
      badge: activeButtons.thinkLevel !== "off" ? activeButtons.thinkLevel : undefined,
    },
    {
      id: "tools",
      label: "Tools",
      icon: <Wrench className="w-5 h-5" />,
      description: "Enable capabilities",
      isActive: activeButtons.selectedTools.length > 0,
      badge: activeButtons.selectedTools.length > 0 ? activeButtons.selectedTools.length : undefined,
    },
    {
      id: "notebook",
      label: "Notebook",
      icon: <NotebookPen className="w-5 h-5" />,
      description: "View saved context",
      badge: memoriesCount > 0 ? memoriesCount : undefined,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: <ListTodo className="w-5 h-5" />,
      description: "Manage to-dos",
      badge: tasksCount > 0 ? `${tasksCompletedCount}/${tasksCount}` : undefined,
    },
    {
      id: "playbooks",
      label: "Playbooks",
      icon: <BookOpen className="w-5 h-5" />,
      description: "Reusable workflows",
    },
    {
      id: "checkpoints",
      label: "Checkpoints",
      icon: <History className="w-5 h-5" />,
      description: "Restore past states",
      badge: checkpointsCount > 0 ? checkpointsCount : undefined,
    },
    {
      id: "mode",
      label: "Mode",
      icon: <Zap className="w-5 h-5" />,
      description: "Collaboration style",
    },
  ]

  const handleItemClick = (item: TrayItem) => {
    if (item.id === "image") {
      // For image, toggle the upload area
      onImageToggle()
      onClose()
    } else {
      // For others, open the panel
      onPanelToggle(item.id)
    }
  }

  // Handle file input for images
  const handleImageInput = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        onAddImages(files)
        onClose()
      }
    }
    input.click()
  }

  if (!isOpen) return null

  return (
    <div className={cn(
      "mb-3 bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden",
      "shadow-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
    )}>
      {/* Grid of options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border">
        {trayItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => item.id === "image" ? handleImageInput() : handleItemClick(item)}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 sm:p-5",
              "bg-card hover:bg-muted/50 active:bg-muted transition-colors",
              "min-h-[88px] sm:min-h-[100px]",
              (item.isActive || activePanel === item.id) && "bg-primary/5"
            )}
          >
            {/* Icon with active indicator */}
            <div className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-xl",
              "bg-muted/50 transition-colors",
              (item.isActive || activePanel === item.id) && "bg-primary/10 text-primary"
            )}>
              {item.icon}
              {/* Badge */}
              {item.badge && (
                <span className={cn(
                  "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1",
                  "bg-primary text-primary-foreground text-[10px] font-bold",
                  "rounded-full flex items-center justify-center capitalize"
                )}>
                  {item.badge}
                </span>
              )}
            </div>
            
            {/* Label */}
            <span className={cn(
              "text-xs font-medium",
              (item.isActive || activePanel === item.id) ? "text-primary" : "text-foreground"
            )}>
              {item.label}
            </span>

            {/* Active dot */}
            {item.isActive && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
