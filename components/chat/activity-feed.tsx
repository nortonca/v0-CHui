"use client"

import { Activity, Clock, CheckCircle, AlertCircle, Loader2, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ActivityItem {
  id: string
  type: "task" | "schedule" | "completed" | "error" | "artifact"
  title: string
  description?: string
  timestamp: Date
  status: "running" | "scheduled" | "completed" | "error"
  progress?: number
}

interface ActivityFeedProps {
  activities: ActivityItem[]
  onActivityClick?: (id: string) => void
  className?: string
}

const STATUS_CONFIG = {
  running: {
    icon: Loader2,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    label: "In Progress",
  },
  scheduled: {
    icon: Clock,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    label: "Scheduled",
  },
  completed: {
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    label: "Completed",
  },
  error: {
    icon: AlertCircle,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    label: "Needs Attention",
  },
}

export default function ActivityFeed({
  activities,
  onActivityClick,
  className,
}: ActivityFeedProps) {
  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`
    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`
    return date.toLocaleDateString()
  }

  return (
    <div className={cn("space-y-2", className)}>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Activity className="size-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
          <p className="text-xs mt-1">I'll show you what I'm working on here</p>
        </div>
      ) : (
        activities.map((activity) => {
          const StatusIcon = STATUS_CONFIG[activity.status].icon
          const isClickable = onActivityClick && activity.status === "error"

          return (
            <button
              key={activity.id}
              type="button"
              onClick={() => isClickable && onActivityClick(activity.id)}
              disabled={!isClickable}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-xl border border-border bg-card",
                "transition-colors text-left",
                isClickable && "hover:bg-muted/30 cursor-pointer",
                !isClickable && "cursor-default"
              )}
            >
              {/* Status Icon */}
              <div
                className={cn(
                  "flex-shrink-0 size-8 rounded-lg flex items-center justify-center",
                  STATUS_CONFIG[activity.status].bgColor
                )}
              >
                <StatusIcon
                  className={cn(
                    "size-4",
                    STATUS_CONFIG[activity.status].color,
                    activity.status === "running" && "animate-spin"
                  )}
                />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-foreground">{activity.title}</h4>
                    {activity.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.description}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>

                {/* Progress Bar */}
                {activity.status === "running" && activity.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${activity.progress}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground mt-1">
                      {activity.progress}%
                    </span>
                  </div>
                )}
              </div>
            </button>
          )
        })
      )}
    </div>
  )
}
