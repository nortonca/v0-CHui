"use client"

import { useState } from "react"
import { X, Plus, Play, BookOpen, Trash2, Edit2, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Playbook {
  id: string
  name: string
  description: string
  steps: string[]
  category: "planning" | "research" | "review" | "custom"
  isBuiltIn?: boolean
}

interface PlaybooksPanelProps {
  isExpanded: boolean
  onToggle: () => void
  playbooks: Playbook[]
  onPlaybookRun: (playbook: Playbook) => void
  onPlaybookAdd: (playbook: Omit<Playbook, "id">) => void
  onPlaybookDelete: (id: string) => void
  isMobile?: boolean
}

const DEFAULT_PLAYBOOKS: Playbook[] = [
  {
    id: "weekly-review",
    name: "Weekly Review",
    description: "Review accomplishments and plan ahead",
    steps: ["Summarize what was accomplished", "Identify blockers", "Plan next week's priorities"],
    category: "review",
    isBuiltIn: true,
  },
  {
    id: "project-kickoff",
    name: "Project Kickoff",
    description: "Start a new project with structure",
    steps: ["Define goals and success criteria", "Identify stakeholders", "Create initial timeline", "List potential risks"],
    category: "planning",
    isBuiltIn: true,
  },
  {
    id: "research-topic",
    name: "Deep Research",
    description: "Comprehensive topic exploration",
    steps: ["Gather background information", "Identify key sources", "Synthesize findings", "Create summary with recommendations"],
    category: "research",
    isBuiltIn: true,
  },
]

const CATEGORY_COLORS = {
  planning: "bg-blue-500/10 text-blue-500",
  research: "bg-purple-500/10 text-purple-500",
  review: "bg-green-500/10 text-green-500",
  custom: "bg-orange-500/10 text-orange-500",
}

export default function PlaybooksPanel({
  isExpanded,
  onToggle,
  playbooks,
  onPlaybookRun,
  onPlaybookAdd,
  onPlaybookDelete,
  isMobile = false,
}: PlaybooksPanelProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [newSteps, setNewSteps] = useState("")
  const [expandedPlaybook, setExpandedPlaybook] = useState<string | null>(null)

  const allPlaybooks = [...DEFAULT_PLAYBOOKS, ...playbooks]

  const handleAdd = () => {
    if (newName.trim()) {
      onPlaybookAdd({
        name: newName.trim(),
        description: newDescription.trim(),
        steps: newSteps.split("\n").filter(s => s.trim()),
        category: "custom",
      })
      setNewName("")
      setNewDescription("")
      setNewSteps("")
      setShowAddForm(false)
    }
  }

  return (
    <div
      className={cn(
        "absolute left-0 right-0 bg-card border border-border transition-all duration-300",
        isMobile
          ? cn(
              "bottom-full rounded-t-3xl",
              isExpanded ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )
          : cn(
              "bottom-full mb-2 rounded-2xl shadow-lg",
              isExpanded ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )
      )}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isExpanded && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <BookOpen className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Playbooks</h3>
              <span className="text-xs text-muted-foreground">
                {allPlaybooks.length} available
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Close playbooks"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(60vh-80px)]">
            {/* Add Button */}
            {!showAddForm && (
              <button
                onClick={() => setShowAddForm(true)}
                className={cn(
                  "w-full p-3 rounded-xl border-2 border-dashed border-border",
                  "hover:border-primary/50 hover:bg-primary/5 transition-all",
                  "flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
                )}
              >
                <Plus className="size-4" />
                <span className="text-sm font-medium">Create Playbook</span>
              </button>
            )}

            {/* Add Form */}
            {showAddForm && (
              <div className="p-4 rounded-xl border border-primary/20 bg-card space-y-3">
                <input
                  type="text"
                  placeholder="Playbook name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-border bg-background",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
                <textarea
                  placeholder="Steps (one per line)"
                  value={newSteps}
                  onChange={(e) => setNewSteps(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                  rows={3}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg border border-border bg-background resize-none",
                    "text-sm text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAdd}
                    disabled={!newName.trim()}
                    className={cn(
                      "flex-1 px-3 py-2 rounded-lg bg-primary text-white",
                      "hover:bg-primary/90 transition-colors text-sm font-medium",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className={cn(
                      "px-3 py-2 rounded-lg border border-border bg-background",
                      "hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Playbook List */}
            {allPlaybooks.map((playbook) => (
              <div
                key={playbook.id}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedPlaybook(
                    expandedPlaybook === playbook.id ? null : playbook.id
                  )}
                  className="w-full flex items-center gap-3 p-3 hover:bg-muted/30 transition-colors text-left"
                >
                  <div className={cn("p-2 rounded-lg", CATEGORY_COLORS[playbook.category])}>
                    <BookOpen className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground">{playbook.name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{playbook.description}</p>
                  </div>
                  <ChevronRight className={cn(
                    "size-4 text-muted-foreground transition-transform",
                    expandedPlaybook === playbook.id && "rotate-90"
                  )} />
                </button>

                {expandedPlaybook === playbook.id && (
                  <div className="px-3 pb-3 space-y-2">
                    <div className="pl-12 space-y-1">
                      {playbook.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="text-xs text-muted-foreground mt-0.5">{i + 1}.</span>
                          <span className="text-xs text-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 pl-12 pt-2">
                      <button
                        onClick={() => onPlaybookRun(playbook)}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                          "bg-primary text-white hover:bg-primary/90",
                          "text-xs font-medium transition-colors"
                        )}
                      >
                        <Play className="size-3" />
                        Run
                      </button>
                      {!playbook.isBuiltIn && (
                        <button
                          onClick={() => onPlaybookDelete(playbook.id)}
                          className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg",
                            "border border-border hover:bg-muted/50",
                            "text-xs font-medium text-muted-foreground transition-colors"
                          )}
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
