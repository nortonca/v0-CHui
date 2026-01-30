"use client"

import { X, Brain, Zap, MessageSquare, Trash2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SettingsModalContentProps {
  onClose: () => void
}

const WORKING_STYLES = [
  { id: "direct", label: "Direct", description: "Straight to the point" },
  { id: "analytical", label: "Analytical", description: "Detailed breakdowns" },
  { id: "creative", label: "Creative", description: "Exploratory and imaginative" },
  { id: "fast", label: "Fast", description: "Quick responses, less detail" },
]

const DECISION_STYLES = [
  { id: "ask", label: "Ask First", description: "Confirm before taking actions" },
  { id: "balanced", label: "Balanced", description: "Ask for major decisions only" },
  { id: "autonomous", label: "Autonomous", description: "Make reasonable assumptions" },
]

const PERSONALITY_PRESETS = [
  { id: "preset1", name: "Preset 1", description: "Description for Preset 1" },
  { id: "preset2", name: "Preset 2", description: "Description for Preset 2" },
  { id: "preset3", name: "Preset 3", description: "Description for Preset 3" },
]

export default function SettingsModalContent({ onClose }: SettingsModalContentProps) {
  const [workingStyle, setWorkingStyle] = useState("analytical")
  const [detailLevel, setDetailLevel] = useState(50)
  const [decisionStyle, setDecisionStyle] = useState("balanced")
  const [challengeDecisions, setChallengeDecisions] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  const [selectedPersonality, setSelectedPersonality] = useState("preset1")
  const [customInstructions, setCustomInstructions] = useState("")

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
          {/* Working Style Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Working Style</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              How the assistant thinks and approaches tasks.
            </p>

            <div className="space-y-2">
              {WORKING_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setWorkingStyle(style.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    workingStyle === style.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      workingStyle === style.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {workingStyle === style.id && (
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

          {/* Output Detail Level */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Response Detail</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Control how thorough or brief responses should be.
            </p>

            <div className="px-4 py-4 rounded-xl bg-muted/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground">Brief</span>
                <span className="text-xs text-muted-foreground">Thorough</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={detailLevel}
                onChange={(e) => setDetailLevel(Number(e.target.value))}
                className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
              />
            </div>
          </section>

          {/* Decision Style */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="size-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Decision Style</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              How the assistant handles choices and actions.
            </p>

            <div className="space-y-2 mb-4">
              {DECISION_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setDecisionStyle(style.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                    "hover:bg-muted/50",
                    decisionStyle === style.id && "bg-primary/5 border border-primary/20"
                  )}
                >
                  <div className="flex-shrink-0">
                    <div className={cn(
                      "w-4 h-4 rounded-full border-2 transition-colors",
                      decisionStyle === style.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}>
                      {decisionStyle === style.id && (
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

            {/* Challenge decisions toggle */}
            <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-muted/30">
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">Challenge Decisions</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  Suggest alternatives when appropriate
                </div>
              </div>
              <button
                onClick={() => setChallengeDecisions(!challengeDecisions)}
                className={cn(
                  "relative w-11 h-6 rounded-full transition-colors",
                  challengeDecisions ? "bg-primary" : "bg-muted"
                )}
                aria-label="Toggle challenge decisions"
              >
                <div className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                  challengeDecisions && "translate-x-5"
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
