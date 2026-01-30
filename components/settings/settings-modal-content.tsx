"use client"

import { X, Brain, Zap, MessageSquare, Trash2, HelpCircle, ClipboardList, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SettingsModalContentProps {
  onClose: () => void
}

const EXECUTION_MODES = [
  { id: "autonomous", label: "Autonomous", description: "Execute directly with reasonable assumptions" },
  { id: "collaborative", label: "Collaborative", description: "Ask clarifying questions when needed" },
  { id: "guided", label: "Guided", description: "Show plans and ask for approval before executing" },
]

const COMMUNICATION_STYLES = [
  { id: "concise", label: "Concise", description: "Brief, direct responses" },
  { id: "balanced", label: "Balanced", description: "Clear with context" },
  { id: "detailed", label: "Detailed", description: "Thorough explanations" },
]

const TASK_COMPLEXITY = [
  { id: "auto", label: "Auto", description: "Show task breakdowns for complex requests only" },
  { id: "always", label: "Always", description: "Always show task planning" },
  { id: "never", label: "Never", description: "Execute directly without showing plans" },
]

const AGENT_MODES = [
  { id: "normal", label: "Normal", description: "Standard operation mode" },
  { id: "enhanced", label: "Enhanced", description: "Advanced operation mode" },
]

const TASK_PLANNING = [
  { id: "auto", label: "Auto", description: "Show task breakdowns for complex requests only" },
  { id: "always", label: "Always", description: "Always show task planning" },
  { id: "never", label: "Never", description: "Execute directly without showing plans" },
]

const FOLLOWUP_QUESTIONS = [
  { id: "whenNeeded", label: "When Needed", description: "Ask questions only when necessary" },
  { id: "always", label: "Always", description: "Always ask clarifying questions" },
  { id: "never", label: "Never", description: "Never ask questions" },
]

const WORKING_STYLES = [
  { id: "analytical", label: "Analytical", description: "Think through problems step-by-step" },
  { id: "creative", label: "Creative", description: "Approach tasks with creativity" },
]

const DECISION_STYLES = [
  { id: "balanced", label: "Balanced", description: "Make decisions carefully" },
  { id: "quick", label: "Quick", description: "Make decisions quickly" },
]

export default function SettingsModalContent({ onClose }: SettingsModalContentProps) {
  const [executionMode, setExecutionMode] = useState("collaborative")
  const [communicationStyle, setCommunicationStyle] = useState("balanced")
  const [taskComplexity, setTaskComplexity] = useState("auto")
  const [autoApplyChanges, setAutoApplyChanges] = useState(false)
  const [challengeIdeas, setChallengeIdeas] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [agentMode, setAgentMode] = useState("normal")
  const [taskPlanning, setTaskPlanning] = useState("auto")
  const [followupQuestions, setFollowupQuestions] = useState("whenNeeded")
  const [workingStyle, setWorkingStyle] = useState("analytical")
  const [detailLevel, setDetailLevel] = useState(50)
  const [decisionStyle, setDecisionStyle] = useState("balanced")
  const [challengeDecisions, setChallengeDecisions] = useState(false)

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
          {/* Execution Mode Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Execution Mode</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              How the agent approaches tasks and decisions.
            </p>

            <div className="space-y-2">
              {EXECUTION_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setExecutionMode(mode.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    executionMode === mode.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      executionMode === mode.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {executionMode === mode.id && (
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

          {/* Communication Style Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Communication Style</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              How the agent structures and delivers responses.
            </p>

            <div className="space-y-2">
              {COMMUNICATION_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setCommunicationStyle(style.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    communicationStyle === style.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      communicationStyle === style.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {communicationStyle === style.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{style.label}</div>
                    <div className="text-xs text-muted-foreground">{style.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Task Complexity Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ClipboardList className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Task Planning</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              When to show breakdowns for complex tasks.
            </p>

            <div className="space-y-2">
              {TASK_COMPLEXITY.map((complexity) => (
                <button
                  key={complexity.id}
                  onClick={() => setTaskComplexity(complexity.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    taskComplexity === complexity.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      taskComplexity === complexity.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {taskComplexity === complexity.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{complexity.label}</div>
                    <div className="text-xs text-muted-foreground">{complexity.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Preferences Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Preferences</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Additional behavior settings.
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30">
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Auto-apply Changes</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Apply code changes without confirmation
                  </div>
                </div>
                <button
                  onClick={() => setAutoApplyChanges(!autoApplyChanges)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    autoApplyChanges ? "bg-primary" : "bg-muted"
                  )}
                  aria-label="Toggle auto-apply changes"
                >
                  <div className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    autoApplyChanges && "translate-x-5"
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30">
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">Challenge Ideas</div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Suggest alternatives and improvements
                  </div>
                </div>
                <button
                  onClick={() => setChallengeIdeas(!challengeIdeas)}
                  className={cn(
                    "relative w-11 h-6 rounded-full transition-colors",
                    challengeIdeas ? "bg-primary" : "bg-muted"
                  )}
                  aria-label="Toggle challenge ideas"
                >
                  <div className={cn(
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                    challengeIdeas && "translate-x-5"
                  )} />
                </button>
              </div>
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
