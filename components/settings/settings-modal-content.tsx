"use client"

import { X, Brain, ListChecks, Sparkles, Trash2, ShieldQuestion, MessageCircleQuestion } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SettingsModalContentProps {
  onClose: () => void
}

const AGENT_MODES = [
  { 
    id: "normal", 
    label: "Normal", 
    description: "Executes tasks directly with reasonable assumptions" 
  },
  { 
    id: "plan", 
    label: "Plan", 
    description: "Shows a step-by-step plan before executing" 
  },
  { 
    id: "ask", 
    label: "Ask", 
    description: "Asks clarifying questions before taking action" 
  },
]

const PLANNING_MODES = [
  { 
    id: "auto", 
    label: "Auto", 
    description: "Creates task lists for complex requests only" 
  },
  { 
    id: "always", 
    label: "Always", 
    description: "Shows task breakdown for every request" 
  },
  { 
    id: "never", 
    label: "Never", 
    description: "Never show task lists, execute directly" 
  },
]

const FOLLOWUP_MODES = [
  { 
    id: "when-needed", 
    label: "When Needed", 
    description: "Ask questions only when request is ambiguous" 
  },
  { 
    id: "always", 
    label: "Always", 
    description: "Always ask clarifying questions first" 
  },
  { 
    id: "never", 
    label: "Never", 
    description: "Never ask questions, make best assumptions" 
  },
]

export default function SettingsModalContent({ onClose }: SettingsModalContentProps) {
  const [agentMode, setAgentMode] = useState("normal")
  const [planningMode, setPlanningMode] = useState("auto")
  const [followupMode, setFollowupMode] = useState("when-needed")
  const [autoApply, setAutoApply] = useState(true)
  const [memoryEnabled, setMemoryEnabled] = useState(true)

  return (
    <div className="flex items-center justify-center h-full p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-lg max-h-[calc(100vh-8rem)] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 id="settings-modal-title" className="text-lg font-semibold text-foreground">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 hover:bg-muted/50 rounded-lg transition-colors"
            aria-label="Close settings"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
          {/* Agent Mode Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Agent Mode</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              How the agent behaves before taking action.
            </p>

            <div className="space-y-2">
              {AGENT_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setAgentMode(mode.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    agentMode === mode.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      agentMode === mode.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {agentMode === mode.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{mode.label}</div>
                    <div className="text-xs text-muted-foreground">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Task Planning Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ListChecks className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Task Planning</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              When to show a breakdown of steps before execution.
            </p>

            <div className="space-y-2">
              {PLANNING_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setPlanningMode(mode.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    planningMode === mode.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      planningMode === mode.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {planningMode === mode.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{mode.label}</div>
                    <div className="text-xs text-muted-foreground">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Follow-up Questions Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <MessageCircleQuestion className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Follow-up Questions</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              When the agent should ask clarifying questions.
            </p>

            <div className="space-y-2">
              {FOLLOWUP_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setFollowupMode(mode.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    followupMode === mode.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      followupMode === mode.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {followupMode === mode.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{mode.label}</div>
                    <div className="text-xs text-muted-foreground">{mode.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Auto-Apply Section */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <ShieldQuestion className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Confirmations</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Control when the agent asks for confirmation.
            </p>

            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Auto-apply changes</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Apply code changes without asking
                </div>
              </div>
              <button
                onClick={() => setAutoApply(!autoApply)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  autoApply ? "bg-primary" : "bg-muted"
                )}
                aria-label="Toggle auto-apply"
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                  autoApply && "translate-x-5"
                )} />
              </button>
            </div>
          </section>

          {/* Conversation Memory Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Conversation Memory</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Control how the assistant remembers information across conversations.
            </p>

            {/* Memory Toggle */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30 mb-4">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Enable Memory</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Remember context from previous conversations
                </div>
              </div>
              <button
                onClick={() => setMemoryEnabled(!memoryEnabled)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  memoryEnabled ? "bg-primary" : "bg-muted"
                )}
                aria-label="Toggle memory"
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                  memoryEnabled && "translate-x-5"
                )} />
              </button>
            </div>

            {memoryEnabled && (
              <div className="space-y-3">
                <div className="px-4 py-3 rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Memory Storage</span>
                    <span className="text-xs text-muted-foreground">2.4 KB used</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary w-1/4 rounded-full" />
                  </div>
                </div>

                <button
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl",
                    "border border-destructive/20 text-destructive",
                    "hover:bg-destructive/5 transition-colors"
                  )}
                  onClick={() => {}} // Placeholder for clear memory functionality
                >
                  <Trash2 className="size-4" />
                  <span className="text-sm font-medium">Clear All Memory</span>
                </button>

                <p className="text-xs text-muted-foreground px-1">
                  Clearing memory will remove all stored context and preferences. This action cannot be undone.
                </p>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
