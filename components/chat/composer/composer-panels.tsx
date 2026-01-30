"use client"

import { cn } from "@/lib/utils"
import { X, Brain, Wrench, Search, Code, Globe, ImageIcon, Sparkles, Check } from "lucide-react"
import type { Memory } from "../memory-panel"
import type { Checkpoint } from "../checkpoints-panel"
import type { Playbook } from "../playbooks-panel"
import type { Task } from "../task-panel"
import type { CollaborationMode } from "../collaboration-mode"

interface ComposerPanelsProps {
  activePanel: string | null
  onClose: () => void
  isMobile: boolean
  // Think
  thinkLevel: "off" | "on" | "deep"
  onThinkLevelChange: (level: "off" | "on" | "deep") => void
  // Tools
  selectedTools: string[]
  onToolsChange: (tools: string[]) => void
  // Memory
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  // Tasks
  tasks: Task[]
  onTaskToggle: (id: string) => void
  onTaskAdd: (text: string) => void
  onTaskEdit: (id: string, text: string) => void
  onTaskDelete: (id: string) => void
  // Playbooks
  playbooks: Playbook[]
  onPlaybookRun: (playbook: Playbook) => void
  onPlaybookAdd: (playbook: Omit<Playbook, "id">) => void
  onPlaybookDelete: (id: string) => void
  // Checkpoints
  checkpoints: Checkpoint[]
  currentCheckpointId?: string
  onCheckpointRestore: (id: string) => void
  onCheckpointCreate: () => void
  // Collaboration
  collaborationMode: CollaborationMode
  onCollaborationModeChange: (mode: CollaborationMode) => void
}

const THINK_LEVELS = [
  { id: "off" as const, label: "Off", description: "Standard responses" },
  { id: "on" as const, label: "On", description: "Basic reasoning" },
  { id: "deep" as const, label: "Deep", description: "Extended thinking" },
]

const AVAILABLE_TOOLS = [
  { id: "search", label: "Web Search", icon: Search, description: "Search the internet" },
  { id: "code", label: "Code", icon: Code, description: "Write and run code" },
  { id: "browse", label: "Browse", icon: Globe, description: "Visit websites" },
  { id: "image", label: "Image Gen", icon: ImageIcon, description: "Create images" },
]

const COLLAB_MODES = [
  { id: "lead" as const, label: "Lead", description: "I take initiative and drive the work" },
  { id: "collaborate" as const, label: "Collaborate", description: "We work together as partners" },
  { id: "assist" as const, label: "Assist", description: "I follow your lead and help when asked" },
]

export default function ComposerPanels({
  activePanel,
  onClose,
  isMobile,
  thinkLevel,
  onThinkLevelChange,
  selectedTools,
  onToolsChange,
  memories,
  onMemoryEdit,
  onMemoryDelete,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  playbooks,
  onPlaybookRun,
  onPlaybookAdd,
  onPlaybookDelete,
  checkpoints,
  currentCheckpointId,
  onCheckpointRestore,
  onCheckpointCreate,
  collaborationMode,
  onCollaborationModeChange,
}: ComposerPanelsProps) {
  if (!activePanel) return null

  const renderPanelContent = () => {
    switch (activePanel) {
      case "think":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="w-4 h-4" />
              <span>Extended reasoning mode</span>
            </div>
            <div className="flex flex-col gap-2">
              {THINK_LEVELS.map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => onThinkLevelChange(level.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all",
                    "min-h-[60px] text-left",
                    thinkLevel === level.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div>
                    <div className={cn(
                      "font-medium",
                      thinkLevel === level.id && "text-primary"
                    )}>
                      {level.label}
                    </div>
                    <div className="text-sm text-muted-foreground">{level.description}</div>
                  </div>
                  {thinkLevel === level.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case "tools":
        return (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="w-4 h-4" />
                <span>Available capabilities</span>
              </div>
              {selectedTools.length > 0 && (
                <button
                  type="button"
                  onClick={() => onToolsChange([])}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_TOOLS.map((tool) => {
                const isSelected = selectedTools.includes(tool.id)
                const Icon = tool.icon
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        onToolsChange(selectedTools.filter(t => t !== tool.id))
                      } else {
                        onToolsChange([...selectedTools, tool.id])
                      }
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                      "min-h-[80px]",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected && "text-primary")} />
                    <span className={cn(
                      "text-xs font-medium",
                      isSelected && "text-primary"
                    )}>
                      {tool.label}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )

      case "mode":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>How should I work with you?</span>
            </div>
            <div className="flex flex-col gap-2">
              {COLLAB_MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onCollaborationModeChange(mode.id)}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all",
                    "min-h-[60px] text-left",
                    collaborationMode === mode.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                >
                  <div>
                    <div className={cn(
                      "font-medium",
                      collaborationMode === mode.id && "text-primary"
                    )}>
                      {mode.label}
                    </div>
                    <div className="text-sm text-muted-foreground">{mode.description}</div>
                  </div>
                  {collaborationMode === mode.id && (
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )

      case "notebook":
        return (
          <div className="space-y-3">
            {memories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No notes yet</p>
                <p className="text-xs mt-1">{"Context will be saved as we work together"}</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {memories.map((memory) => (
                  <div
                    key={memory.id}
                    className="p-3 rounded-xl border border-border bg-muted/30"
                  >
                    <p className="text-sm">{memory.text}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground capitalize">{memory.category}</span>
                      <button
                        type="button"
                        onClick={() => onMemoryDelete(memory.id)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "tasks":
        return (
          <div className="space-y-3">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No tasks yet</p>
                <p className="text-xs mt-1">Add tasks to track progress</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border transition-colors",
                      task.completed ? "border-primary/30 bg-primary/5" : "border-border"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => onTaskToggle(task.id)}
                      className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
                        task.completed ? "border-primary bg-primary" : "border-muted-foreground"
                      )}
                    >
                      {task.completed && <Check className="w-3 h-3 text-primary-foreground" />}
                    </button>
                    <span className={cn(
                      "flex-1 text-sm",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.text}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case "playbooks":
        return (
          <div className="space-y-3">
            {playbooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p className="text-sm">No playbooks yet</p>
                <p className="text-xs mt-1">Create reusable workflows</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {playbooks.map((playbook) => (
                  <button
                    key={playbook.id}
                    type="button"
                    onClick={() => onPlaybookRun(playbook)}
                    className="w-full p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/50 text-left transition-colors"
                  >
                    <div className="font-medium">{playbook.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {playbook.steps.length} steps
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      case "checkpoints":
        return (
          <div className="space-y-3">
            <button
              type="button"
              onClick={onCheckpointCreate}
              className="w-full p-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/50 text-sm text-muted-foreground transition-colors"
            >
              + Save checkpoint
            </button>
            {checkpoints.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <p className="text-sm">No checkpoints yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {checkpoints.map((checkpoint) => (
                  <button
                    key={checkpoint.id}
                    type="button"
                    onClick={() => onCheckpointRestore(checkpoint.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border text-left transition-colors",
                      checkpoint.id === currentCheckpointId
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <div className="font-medium">{checkpoint.label}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(checkpoint.timestamp).toLocaleString()}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  const getPanelTitle = () => {
    switch (activePanel) {
      case "think": return "Think Mode"
      case "tools": return "Tools"
      case "mode": return "Collaboration Mode"
      case "notebook": return "Notebook"
      case "tasks": return "Tasks"
      case "playbooks": return "Playbooks"
      case "checkpoints": return "Checkpoints"
      default: return ""
    }
  }

  return (
    <div className={cn(
      "mb-3 bg-card border border-border rounded-2xl sm:rounded-3xl overflow-hidden",
      "shadow-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-200"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="font-semibold text-sm">{getPanelTitle()}</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          aria-label="Close panel"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 max-h-[50vh] overflow-y-auto">
        {renderPanelContent()}
      </div>
    </div>
  )
}
