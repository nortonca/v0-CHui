"use client"

import { useState } from "react"
import { X, Trash2, Edit2, Check, NotebookPen, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Memory {
  id: string
  category: "preference" | "fact" | "workflow" | "context"
  text: string
  createdAt: Date
  source: "user" | "ai"
}

interface MemoryPanelProps {
  isExpanded: boolean
  onToggle: () => void
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  isMobile?: boolean
}

const CATEGORY_LABELS = {
  preference: { label: "Preferences", color: "text-blue-500" },
  fact: { label: "About You", color: "text-green-500" },
  workflow: { label: "How You Work", color: "text-purple-500" },
  context: { label: "Session Context", color: "text-orange-500" },
}

export default function MemoryPanel({
  isExpanded,
  onToggle,
  memories,
  onMemoryEdit,
  onMemoryDelete,
  isMobile = false,
}: MemoryPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const [activeFilter, setActiveFilter] = useState<Memory["category"] | "all">("all")

  const handleEditStart = (memory: Memory) => {
    setEditingId(memory.id)
    setEditText(memory.text)
  }

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      onMemoryEdit(id, editText.trim())
      setEditingId(null)
      setEditText("")
    }
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText("")
  }

  const filteredMemories = memories.filter((m) =>
    activeFilter === "all" ? true : m.category === activeFilter
  )

  const groupedMemories = filteredMemories.reduce((acc, memory) => {
    if (!acc[memory.category]) acc[memory.category] = []
    acc[memory.category].push(memory)
    return acc
  }, {} as Record<Memory["category"], Memory[]>)

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
              <NotebookPen className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Notebook</h3>
              <span className="text-xs text-muted-foreground">
                {memories.length} {memories.length === 1 ? "note" : "notes"}
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Close notebook"
            >
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border overflow-x-auto">
            <button
              onClick={() => setActiveFilter("all")}
              className={cn(
                "px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              )}
            >
              All
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, { label }]) => (
              <button
                key={key}
                onClick={() => setActiveFilter(key as Memory["category"])}
                className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors",
                  activeFilter === key
                    ? "bg-primary text-white"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted"
                )}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Notebook List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(60vh-120px)]">
            {memories.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <NotebookPen className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notes yet</p>
                <p className="text-xs mt-1">{"I'll jot down important details as we work together"}</p>
              </div>
            ) : (
              Object.entries(groupedMemories).map(([category, items]) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={cn(
                        "w-1 h-4 rounded-full",
                        CATEGORY_LABELS[category as Memory["category"]].color.replace(
                          "text-",
                          "bg-"
                        )
                      )}
                    />
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {CATEGORY_LABELS[category as Memory["category"]].label}
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {items.map((memory) => (
                      <div
                        key={memory.id}
                        className="flex items-start gap-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        {editingId === memory.id ? (
                          <>
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") handleEditSave(memory.id)
                                if (e.key === "Escape") handleEditCancel()
                              }}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                              className={cn(
                                "flex-1 px-2 py-1 text-sm bg-background border border-border rounded",
                                "focus:outline-none focus:ring-2 focus:ring-primary/20"
                              )}
                              autoFocus
                            />
                            <button
                              onClick={() => handleEditSave(memory.id)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              aria-label="Save"
                            >
                              <Check className="size-4 text-green-500" />
                            </button>
                            <button
                              onClick={handleEditCancel}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              aria-label="Cancel"
                            >
                              <X className="size-4 text-muted-foreground" />
                            </button>
                          </>
                        ) : (
                          <>
                            <p className="flex-1 text-sm text-foreground">{memory.text}</p>
                            <button
                              onClick={() => handleEditStart(memory)}
                              className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Edit"
                            >
                              <Edit2 className="size-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => onMemoryDelete(memory.id)}
                              className="p-1 hover:bg-muted rounded transition-colors opacity-0 group-hover:opacity-100"
                              aria-label="Delete"
                            >
                              <Trash2 className="size-3.5 text-red-500" />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
