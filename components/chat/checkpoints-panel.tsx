"use client"

import { useState } from "react"
import { X, History, RotateCcw, GitBranch, Clock, MessageSquare, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Checkpoint {
  id: string
  title: string
  description: string
  timestamp: Date
  messageCount: number
  type: "auto" | "manual"
}

interface CheckpointsPanelProps {
  isExpanded: boolean
  onToggle: () => void
  checkpoints: Checkpoint[]
  onRestore: (checkpointId: string) => void
  onCreateCheckpoint: () => void
  currentCheckpointId?: string
  isMobile?: boolean
}

export default function CheckpointsPanel({
  isExpanded,
  onToggle,
  checkpoints,
  onRestore,
  onCreateCheckpoint,
  currentCheckpointId,
  isMobile = false,
}: CheckpointsPanelProps) {
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null)

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

  const handleRestore = (id: string) => {
    if (confirmRestore === id) {
      onRestore(id)
      setConfirmRestore(null)
    } else {
      setConfirmRestore(id)
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
              <History className="size-5 text-primary" />
              <h3 className="font-semibold text-foreground">Checkpoints</h3>
              <span className="text-xs text-muted-foreground">
                {checkpoints.length} saved
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onCreateCheckpoint}
                className={cn(
                  "px-3 py-1 rounded-lg bg-primary/10 text-primary",
                  "hover:bg-primary/20 transition-colors text-xs font-medium"
                )}
              >
                Save Now
              </button>
              <button
                onClick={onToggle}
                className="p-1 hover:bg-muted/50 rounded-lg transition-colors"
                aria-label="Close checkpoints"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 overflow-y-auto p-4 max-h-[calc(60vh-80px)]">
            {checkpoints.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <History className="size-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No checkpoints yet</p>
                <p className="text-xs mt-1">Save your progress to restore later</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

                {/* Checkpoints */}
                <div className="space-y-4">
                  {checkpoints.map((checkpoint, index) => {
                    const isCurrent = checkpoint.id === currentCheckpointId
                    const isConfirming = confirmRestore === checkpoint.id

                    return (
                      <div key={checkpoint.id} className="relative flex items-start gap-4">
                        {/* Timeline dot */}
                        <div
                          className={cn(
                            "relative z-10 size-8 rounded-full flex items-center justify-center",
                            isCurrent
                              ? "bg-primary text-white"
                              : "bg-card border-2 border-border"
                          )}
                        >
                          {isCurrent ? (
                            <CheckCircle className="size-4" />
                          ) : checkpoint.type === "auto" ? (
                            <Clock className="size-4 text-muted-foreground" />
                          ) : (
                            <GitBranch className="size-4 text-muted-foreground" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-4">
                          <div className="rounded-xl border border-border bg-card p-3">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h4 className="text-sm font-medium text-foreground">
                                  {checkpoint.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {checkpoint.description}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {formatTime(checkpoint.timestamp)}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <MessageSquare className="size-3" />
                                {checkpoint.messageCount} messages
                              </div>

                              {!isCurrent && (
                                <button
                                  onClick={() => handleRestore(checkpoint.id)}
                                  className={cn(
                                    "flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium transition-colors",
                                    isConfirming
                                      ? "bg-orange-500/10 text-orange-500 hover:bg-orange-500/20"
                                      : "bg-muted/50 text-muted-foreground hover:bg-muted"
                                  )}
                                >
                                  <RotateCcw className="size-3" />
                                  {isConfirming ? "Click to confirm" : "Restore"}
                                </button>
                              )}

                              {isCurrent && (
                                <span className="text-xs font-medium text-primary">Current</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
