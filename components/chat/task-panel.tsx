"use client"

import { useState } from "react"
import { Check, ChevronDown, ChevronUp, Plus, X, Pencil } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Task {
  id: string
  text: string
  completed: boolean
  addedBy: "ai" | "user"
}

interface TaskPanelProps {
  isExpanded: boolean
  onToggle: () => void
  tasks: Task[]
  onTaskToggle: (id: string) => void
  onTaskAdd: (text: string) => void
  onTaskEdit: (id: string, text: string) => void
  onTaskDelete: (id: string) => void
  isMobile: boolean
}

export default function TaskPanel({
  isExpanded,
  onToggle,
  tasks,
  onTaskToggle,
  onTaskAdd,
  onTaskEdit,
  onTaskDelete,
  isMobile,
}: TaskPanelProps) {
  const [newTaskText, setNewTaskText] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onTaskAdd(newTaskText.trim())
      setNewTaskText("")
    }
  }

  const handleEditStart = (task: Task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const handleEditSave = (id: string) => {
    if (editText.trim()) {
      onTaskEdit(id, editText.trim())
    }
    setEditingId(null)
    setEditText("")
  }

  const handleEditCancel = () => {
    setEditingId(null)
    setEditText("")
  }

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length

  return (
    <div
      className={cn(
        "absolute left-0 right-0 bg-card border border-border transition-all duration-300",
        isMobile
          ? cn(
              "bottom-full rounded-t-3xl",
              isExpanded ? "max-h-[50vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )
          : cn(
              "bottom-full mb-2 rounded-2xl shadow-lg",
              isExpanded ? "max-h-[60vh] opacity-100" : "max-h-0 opacity-0 overflow-hidden"
            )
      )}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {isExpanded && (
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Tasks</h3>
              {totalCount > 0 && (
                <span className="text-xs text-muted-foreground">
                  {completedCount}/{totalCount}
                </span>
              )}
            </div>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
              aria-label="Collapse tasks"
            >
              {isMobile ? (
                <ChevronDown className="size-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="size-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {tasks.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                No tasks yet. Add one below or let the AI suggest some.
              </p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={cn(
                    "flex items-start gap-3 p-2 rounded-lg transition-colors group",
                    "hover:bg-muted/50"
                  )}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => onTaskToggle(task.id)}
                    className={cn(
                      "mt-0.5 flex-shrink-0 w-4 h-4 rounded border-2 transition-colors",
                      task.completed
                        ? "bg-primary border-primary"
                        : "border-muted-foreground hover:border-primary"
                    )}
                    aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {task.completed && <Check className="size-3 text-white" strokeWidth={3} />}
                  </button>

                  {/* Task Text */}
                  {editingId === task.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEditSave(task.id)
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
                        onClick={() => handleEditSave(task.id)}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <Check className="size-3 text-primary" />
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="p-1 hover:bg-muted rounded transition-colors"
                      >
                        <X className="size-3 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span
                        className={cn(
                          "flex-1 text-sm text-foreground",
                          task.completed && "line-through text-muted-foreground"
                        )}
                      >
                        {task.text}
                      </span>

                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditStart(task)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          aria-label="Edit task"
                        >
                          <Pencil className="size-3 text-muted-foreground" />
                        </button>
                        <button
                          onClick={() => onTaskDelete(task.id)}
                          className="p-1 hover:bg-muted rounded transition-colors"
                          aria-label="Delete task"
                        >
                          <X className="size-3 text-muted-foreground" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Add Task Input */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a task..."
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddTask()
                }}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                className={cn(
                  "flex-1 px-3 py-2 text-sm bg-background border border-border rounded-xl",
                  "focus:outline-none focus:ring-2 focus:ring-primary/20",
                  "placeholder:text-muted-foreground"
                )}
              />
              <button
                onClick={handleAddTask}
                disabled={!newTaskText.trim()}
                className={cn(
                  "p-2 rounded-xl bg-primary text-white transition-colors",
                  "hover:bg-primary/90",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
                aria-label="Add task"
              >
                <Plus className="size-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
