"use client"

import { useState } from "react"
import { X, Sparkles, User, Target, Zap, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingModalProps {
  isOpen: boolean
  onComplete: (data: OnboardingData) => void
}

export interface OnboardingData {
  assistantName: string
  userRole: string
  primaryUse: string
  collaborationMode: "lead" | "collaborate" | "assist"
  enableMemory: boolean
}

const COLLABORATION_MODES = [
  {
    id: "lead" as const,
    label: "Lead",
    description: "Take initiative and drive tasks autonomously",
    icon: <Zap className="size-5" />,
  },
  {
    id: "collaborate" as const,
    label: "Collaborate",
    description: "Work together back-and-forth on tasks",
    icon: <Sparkles className="size-5" />,
  },
  {
    id: "assist" as const,
    label: "Assist",
    description: "Follow your lead and provide support",
    icon: <User className="size-5" />,
  },
]

export default function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1)
  const [assistantName, setAssistantName] = useState("Assistant")
  const [userRole, setUserRole] = useState("")
  const [primaryUse, setPrimaryUse] = useState("")
  const [collaborationMode, setCollaborationMode] = useState<"lead" | "collaborate" | "assist">(
    "collaborate"
  )
  const [enableMemory, setEnableMemory] = useState(true)

  const handleComplete = () => {
    onComplete({
      assistantName,
      userRole,
      primaryUse,
      collaborationMode,
      enableMemory,
    })
  }

  const canProceed = () => {
    if (step === 1) return assistantName.trim().length > 0
    if (step === 2) return userRole.trim().length > 0
    if (step === 3) return primaryUse.trim().length > 0
    return true
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        className={cn(
          "bg-card border border-border rounded-2xl shadow-2xl",
          "w-full max-w-2xl max-h-[90vh] overflow-hidden",
          "animate-scaleIn flex flex-col"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Welcome</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Let's set up your co-working assistant
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                Step {step} of 4
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Step 1: Name Your Assistant */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <Sparkles className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Name Your Assistant</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  What would you like to call me?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Assistant Name
                </label>
                <input
                  type="text"
                  value={assistantName}
                  onChange={(e) => setAssistantName(e.target.value)}
                  placeholder="e.g., Jarvis, Alex, Claude..."
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-border bg-background",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: About You */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <User className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">About You</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Help me understand your role and context
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  What do you do?
                </label>
                <input
                  type="text"
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value)}
                  placeholder="e.g., Product Manager, Designer, Founder..."
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-border bg-background",
                    "text-foreground placeholder:text-muted-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 3: Primary Use */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <Target className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">How Will You Use Me?</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  What are you usually working on?
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Primary Use Case
                </label>
                <textarea
                  value={primaryUse}
                  onChange={(e) => setPrimaryUse(e.target.value)}
                  placeholder="e.g., Planning projects, brainstorming ideas, research..."
                  rows={4}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border border-border bg-background",
                    "text-foreground placeholder:text-muted-foreground resize-none",
                    "focus:outline-none focus:ring-2 focus:ring-primary/20"
                  )}
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 4: Collaboration Mode */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-primary/10 mb-4">
                  <Zap className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">How Should We Work?</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Choose your preferred collaboration style
                </p>
              </div>

              <div className="space-y-3">
                {COLLABORATION_MODES.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setCollaborationMode(mode.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left",
                      collaborationMode === mode.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-background hover:bg-muted/30"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 size-10 rounded-lg flex items-center justify-center",
                        collaborationMode === mode.id ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      )}
                    >
                      {mode.icon}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{mode.label}</div>
                      <div className="text-sm text-muted-foreground mt-1">{mode.description}</div>
                    </div>
                    {collaborationMode === mode.id && (
                      <CheckCircle className="size-5 text-primary flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>

              {/* Memory Toggle */}
              <div className="pt-4 border-t border-border">
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <div className="font-medium text-foreground">Enable Memory</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Remember preferences and context across sessions
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEnableMemory(!enableMemory)}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      enableMemory ? "bg-primary" : "bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform",
                        enableMemory && "translate-x-6"
                      )}
                    />
                  </button>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className={cn(
                "px-4 py-2 rounded-lg border border-border bg-background",
                "hover:bg-muted/50 transition-colors text-sm font-medium text-foreground"
              )}
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={() => {
              if (step < 4) {
                setStep(step + 1)
              } else {
                handleComplete()
              }
            }}
            disabled={!canProceed()}
            className={cn(
              "px-6 py-2 rounded-lg bg-primary text-white",
              "hover:bg-primary/90 transition-colors text-sm font-medium",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {step < 4 ? "Continue" : "Get Started"}
          </button>
        </div>
      </div>
    </div>
  )
}
