"use client"

import { cn } from "@/lib/utils"
import { NotebookPen, ListTodo, BookOpen, History, Brain, Wrench } from "lucide-react"
import ImageButton from "../buttons/image-button"
import CollaborationModeToggle, { type CollaborationMode } from "../collaboration-mode"
import type { ActiveButtonState } from "../types"

interface InputControlsProps {
  activeButtons: ActiveButtonState
  isStreaming: boolean
  isMemoryPanelExpanded: boolean
  isTaskPanelExpanded: boolean
  isPlaybooksPanelExpanded: boolean
  isCheckpointsPanelExpanded: boolean
  isThinkPanelExpanded: boolean
  isToolsPanelExpanded: boolean
  memoriesCount: number
  tasksCount: number
  tasksCompletedCount: number
  checkpointsCount: number
  collaborationMode: CollaborationMode
  onToggleButton: (button: keyof ActiveButtonState) => void
  onTogglePanel: (panel: "memory" | "task" | "playbooks" | "checkpoints" | "think" | "tools") => void
  onCollaborationModeChange: (mode: CollaborationMode) => void
  onThinkLevelChange: (level: number) => void
  onToolsChange: (tools: string[]) => void
}

export default function InputControls({
  activeButtons,
  isStreaming,
  isMemoryPanelExpanded,
  isTaskPanelExpanded,
  isPlaybooksPanelExpanded,
  isCheckpointsPanelExpanded,
  isThinkPanelExpanded,
  isToolsPanelExpanded,
  memoriesCount,
  tasksCount,
  tasksCompletedCount,
  checkpointsCount,
  collaborationMode,
  onToggleButton,
  onTogglePanel,
  onCollaborationModeChange,
}: InputControlsProps) {
  const isThinkActive = activeButtons.thinkLevel !== "off"
  const hasToolsSelected = activeButtons.selectedTools.length > 0

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto">
      <ImageButton
        isActive={activeButtons.image}
        toggleButton={() => onToggleButton("image")}
        isStreaming={isStreaming}
      />

      {/* Think Toggle Button */}
      <button
        type="button"
        onClick={() => onTogglePanel("think")}
        className={cn(
          "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
          isThinkPanelExpanded && "bg-primary/10 border-primary/20",
          isThinkActive && !isThinkPanelExpanded && "border-primary/50"
        )}
        disabled={isStreaming}
        aria-label="Toggle think mode"
        title="Think Mode"
      >
        <Brain className={cn("h-4 w-4 text-muted-foreground", (isThinkPanelExpanded || isThinkActive) && "text-primary")} />
        {isThinkActive && (
          <span className={cn("text-xs font-medium capitalize", isThinkPanelExpanded ? "text-primary" : "text-muted-foreground")}>
            {activeButtons.thinkLevel}
          </span>
        )}
      </button>

      {/* Tools Toggle Button */}
      <button
        type="button"
        onClick={() => onTogglePanel("tools")}
        className={cn(
          "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
          isToolsPanelExpanded && "bg-primary/10 border-primary/20",
          hasToolsSelected && !isToolsPanelExpanded && "border-primary/50"
        )}
        disabled={isStreaming}
        aria-label="Toggle tools"
        title="Tools"
      >
        <Wrench className={cn("h-4 w-4 text-muted-foreground", (isToolsPanelExpanded || hasToolsSelected) && "text-primary")} />
        {hasToolsSelected && (
          <span className={cn("text-xs font-medium", isToolsPanelExpanded ? "text-primary" : "text-muted-foreground")}>
            {activeButtons.selectedTools.length}
          </span>
        )}
      </button>

      {/* Divider */}
      <div className="w-px h-5 bg-border mx-1" />

      {/* Notebook Toggle Button */}
      <button
        type="button"
        onClick={() => onTogglePanel("memory")}
        className={cn(
          "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
          isMemoryPanelExpanded && "bg-primary/10 border-primary/20",
          memoriesCount > 0 && !isMemoryPanelExpanded && "border-primary/50"
        )}
        disabled={isStreaming}
        aria-label="Toggle notebook"
        title="Notebook"
      >
        <NotebookPen className={cn("h-4 w-4 text-muted-foreground", isMemoryPanelExpanded && "text-primary")} />
        {memoriesCount > 0 && (
          <span className={cn("text-xs font-medium", isMemoryPanelExpanded ? "text-primary" : "text-muted-foreground")}>
            {memoriesCount}
          </span>
        )}
      </button>

      {/* Task Toggle Button */}
      <button
        type="button"
        onClick={() => onTogglePanel("task")}
        className={cn(
          "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
          isTaskPanelExpanded && "bg-primary/10 border-primary/20",
          tasksCount > 0 && !isTaskPanelExpanded && "border-primary/50"
        )}
        disabled={isStreaming}
        aria-label="Toggle tasks"
        title="Tasks"
      >
        <ListTodo className={cn("h-4 w-4 text-muted-foreground", isTaskPanelExpanded && "text-primary")} />
        {tasksCount > 0 && (
          <span className={cn("text-xs font-medium", isTaskPanelExpanded ? "text-primary" : "text-muted-foreground")}>
            {tasksCompletedCount}/{tasksCount}
          </span>
        )}
      </button>

      {/* Playbooks Toggle Button */}
      <button
        type="button"
        onClick={() => onTogglePanel("playbooks")}
        className={cn(
          "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
          isPlaybooksPanelExpanded && "bg-primary/10 border-primary/20"
        )}
        disabled={isStreaming}
        aria-label="Toggle playbooks"
        title="Playbooks"
      >
        <BookOpen className={cn("h-4 w-4 text-muted-foreground", isPlaybooksPanelExpanded && "text-primary")} />
      </button>

      {/* Checkpoints Toggle Button */}
      <button
        type="button"
        onClick={() => onTogglePanel("checkpoints")}
        className={cn(
          "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
          isCheckpointsPanelExpanded && "bg-primary/10 border-primary/20",
          checkpointsCount > 0 && !isCheckpointsPanelExpanded && "border-primary/50"
        )}
        disabled={isStreaming}
        aria-label="Toggle checkpoints"
        title="Checkpoints"
      >
        <History className={cn("h-4 w-4 text-muted-foreground", isCheckpointsPanelExpanded && "text-primary")} />
        {checkpointsCount > 0 && (
          <span className={cn("text-xs font-medium", isCheckpointsPanelExpanded ? "text-primary" : "text-muted-foreground")}>
            {checkpointsCount}
          </span>
        )}
      </button>

      {/* Collaboration Mode Toggle */}
      <div className="hidden sm:block ml-1">
        <CollaborationModeToggle
          mode={collaborationMode}
          onModeChange={onCollaborationModeChange}
          isCompact={true}
        />
      </div>
    </div>
  )
}
