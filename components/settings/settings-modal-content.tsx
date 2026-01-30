"use client"

import { X, User, Brain, Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SettingsModalContentProps {
  onClose: () => void
}

const PERSONALITY_PRESETS = [
  { id: "balanced", name: "Balanced", description: "Professional and helpful" },
  { id: "creative", name: "Creative", description: "Imaginative and expressive" },
  { id: "technical", name: "Technical", description: "Precise and detailed" },
  { id: "casual", name: "Casual", description: "Friendly and conversational" },
  { id: "concise", name: "Concise", description: "Brief and to the point" },
]

export default function SettingsModalContent({ onClose }: SettingsModalContentProps) {
  const [selectedPersonality, setSelectedPersonality] = useState("balanced")
  const [customInstructions, setCustomInstructions] = useState("")
  const [memoryEnabled, setMemoryEnabled] = useState(true)

  return (
    <div className="flex flex-col h-full max-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Settings</h2>
        <button
          onClick={onClose}
          className="p-2 -mr-2 hover:bg-muted/50 rounded-xl transition-colors"
          aria-label="Close settings"
        >
          <X className="size-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
        {/* Assistant Personality Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="size-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Assistant Personality</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Choose how the assistant communicates and responds to your messages.
          </p>

          <div className="space-y-2 mb-4">
            {PERSONALITY_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPersonality(preset.id)}
                className={cn(
                  "w-full flex items-start gap-3 px-4 py-3 rounded-xl transition-colors text-left",
                  "hover:bg-muted/50",
                  selectedPersonality === preset.id && "bg-primary/5 border border-primary/20"
                )}
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={cn(
                    "w-4 h-4 rounded-full border-2 transition-colors",
                    selectedPersonality === preset.id
                      ? "border-primary bg-primary"
                      : "border-muted-foreground"
                  )}>
                    {selectedPersonality === preset.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{preset.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{preset.description}</div>
                </div>
              </button>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Custom Instructions
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="Add specific instructions for how the assistant should behave..."
              className={cn(
                "w-full px-3 py-2 rounded-xl border border-border bg-background",
                "text-sm text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-primary/20",
                "resize-none h-24"
              )}
            />
            <p className="text-xs text-muted-foreground mt-2">
              These instructions will be applied to all conversations.
            </p>
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
  )
}
