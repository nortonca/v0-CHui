"use client"

import { X, Activity, Plus, Clock, CalendarClock } from "lucide-react"
import { cn } from "@/lib/utils"
import ActivityFeed, { type ActivityItem } from "./activity-feed"

interface ScheduledTask {
  id: string
  name: string
  schedule: string
  nextRun: Date
  enabled: boolean
}

interface ActivitySidebarProps {
  isOpen: boolean
  onClose: () => void
  activities: ActivityItem[]
  scheduledTasks: ScheduledTask[]
  onActivityClick?: (id: string) => void
  onScheduleTask?: () => void
  onToggleScheduledTask?: (id: string) => void
}

export default function ActivitySidebar({
  isOpen,
  onClose,
  activities,
  scheduledTasks,
  onActivityClick,
  onScheduleTask,
  onToggleScheduledTask,
}: ActivitySidebarProps) {
  const formatNextRun = (date: Date) => {
    const now = new Date()
    const diffMs = date.getTime() - now.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 0) return "Overdue"
    if (diffMins < 60) return `In ${diffMins}m`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `In ${diffHours}h`
    return date.toLocaleDateString()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 right-0 h-full w-80 bg-card border-l border-border z-50",
          "transform transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Activity className="size-5 text-primary" />
            <h2 className="font-semibold text-foreground">Activity</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close activity sidebar"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Recent Activity */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Recent Activity
            </h3>
            <ActivityFeed
              activities={activities}
              onActivityClick={onActivityClick}
            />
          </div>

          {/* Scheduled Tasks */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Scheduled Tasks
              </h3>
              {onScheduleTask && (
                <button
                  onClick={onScheduleTask}
                  className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
                  aria-label="Add scheduled task"
                >
                  <Plus className="size-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {scheduledTasks.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <CalendarClock className="size-6 mx-auto mb-2 opacity-50" />
                <p className="text-xs">No scheduled tasks</p>
              </div>
            ) : (
              <div className="space-y-2">
                {scheduledTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-border bg-background"
                  >
                    <button
                      onClick={() => onToggleScheduledTask?.(task.id)}
                      className={cn(
                        "relative w-9 h-5 rounded-full transition-colors",
                        task.enabled ? "bg-primary" : "bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform",
                          task.enabled && "translate-x-4"
                        )}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {task.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {task.schedule}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatNextRun(task.nextRun)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
