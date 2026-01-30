"use client"

import React, { useState } from "react"
import { X, Activity, Clock, CheckCircle, AlertCircle, Play, Pause, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActivityModalContentProps {
  onClose: () => void
  activities?: ActivityItem[]
  scheduledTasks?: ScheduledTask[]
}

export interface ActivityItem {
  id: string
  type: "thinking" | "searching" | "writing" | "completed" | "error"
  message: string
  timestamp: Date
  details?: string
}

export interface ScheduledTask {
  id: string
  name: string
  description: string
  schedule: string
  nextRun: Date
  enabled: boolean
}

const ACTIVITY_ICONS = {
  thinking: Activity,
  searching: Activity,
  writing: Activity,
  completed: CheckCircle,
  error: AlertCircle,
}

const ACTIVITY_COLORS = {
  thinking: "text-primary",
  searching: "text-blue-500",
  writing: "text-primary",
  completed: "text-green-500",
  error: "text-red-500",
}

export default function ActivityModalContent({
  onClose,
  activities = [],
  scheduledTasks = [],
}: ActivityModalContentProps) {
  const [activeTab, setActiveTab] = useState<"activity" | "scheduled">("activity")
  const [tasks, setTasks] = useState<ScheduledTask[]>(scheduledTasks)

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const formatNextRun = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (hours < 1) return "Soon"
    if (hours < 24) return `In ${hours}h`
    return `In ${days}d`
  }

  const toggleTaskEnabled = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, enabled: !task.enabled } : task
      )
    )
  }

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-2xl max-h-[calc(100vh-8rem)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="activity-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="activity-modal-title" className="text-lg font-semibold text-foreground">
            Activity & Tasks
          </h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close activity"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-6 py-3 border-b border-border">
          <button
            onClick={() => setActiveTab("activity")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "activity"
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Activity Feed
          </button>
          <button
            onClick={() => setActiveTab("scheduled")}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "scheduled"
                ? "bg-primary text-white"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Scheduled Tasks
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "activity" && (
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-12">
                  <Activity className="size-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                </div>
              ) : (
                activities.map((activity) => {
                  const Icon = ACTIVITY_ICONS[activity.type]
                  const colorClass = ACTIVITY_COLORS[activity.type]

                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className={cn("flex-shrink-0 mt-0.5", colorClass)}>
                        <Icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        {activity.details && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {activity.details}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatTimestamp(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {activeTab === "scheduled" && (
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="size-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">No scheduled tasks</p>
                  <button
                    className={cn(
                      "px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium",
                      "hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
                    )}
                  >
                    <Plus className="size-4" />
                    Add Scheduled Task
                  </button>
                </div>
              ) : (
                <>
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <button
                        onClick={() => toggleTaskEnabled(task.id)}
                        className={cn(
                          "flex-shrink-0 mt-0.5 p-1 rounded-full transition-colors",
                          task.enabled
                            ? "text-primary hover:bg-primary/10"
                            : "text-muted-foreground hover:bg-muted"
                        )}
                        aria-label={task.enabled ? "Pause task" : "Resume task"}
                      >
                        {task.enabled ? (
                          <Play className="size-4" />
                        ) : (
                          <Pause className="size-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-medium text-foreground">{task.name}</h4>
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-medium",
                              task.enabled
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {task.enabled ? "Active" : "Paused"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="size-3" />
                            {task.schedule}
                          </div>
                          {task.enabled && (
                            <div className="text-xs text-muted-foreground">
                              Next: {formatNextRun(task.nextRun)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    className={cn(
                      "w-full mt-3 px-4 py-3 rounded-xl border-2 border-dashed border-border",
                      "hover:border-primary/50 hover:bg-primary/5 transition-all",
                      "flex items-center justify-center gap-2 text-muted-foreground hover:text-primary",
                      "text-sm font-medium"
                    )}
                  >
                    <Plus className="size-4" />
                    Add Scheduled Task
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
