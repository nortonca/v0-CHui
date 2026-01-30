"use client"

import { X, Brain, Zap, MessageSquare, Trash2, HelpCircle, ClipboardList } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { 
  SettingsSection, 
  SettingsRadioGroup, 
  SettingsToggle,
  SettingsSlider 
} from "./settings-section"
import {
  EXECUTION_MODES,
  COMMUNICATION_STYLES,
  TASK_PLANNING_OPTIONS,
  QUESTION_FREQUENCY,
  QUESTION_COUNT_LABELS,
  TASK_COMPLEXITY // Import TASK_COMPLEXITY here
} from "./settings-constants"

interface SettingsModalContentProps {
  onClose: () => void
}

export default function SettingsModalContent({ onClose }: SettingsModalContentProps) {
  const [executionMode, setExecutionMode] = useState("collaborative")
  const [communicationStyle, setCommunicationStyle] = useState("balanced")
  const [taskComplexity, setTaskComplexity] = useState("auto")
  const [autoApplyChanges, setAutoApplyChanges] = useState(false)
  const [challengeIdeas, setChallengeIdeas] = useState(false)
  const [memoryEnabled, setMemoryEnabled] = useState(true)
  // Question settings
  const [questionFrequency, setQuestionFrequency] = useState("moderate")
  const [maxQuestions, setMaxQuestions] = useState(2)

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
          <SettingsSection
            icon={Zap}
            title="Execution Mode"
            description="How the agent approaches tasks and decisions."
          >
            <SettingsRadioGroup
              options={EXECUTION_MODES}
              value={executionMode}
              onChange={setExecutionMode}
            />
          </SettingsSection>

          {/* Communication Style Section */}
          <SettingsSection
            icon={MessageSquare}
            title="Communication Style"
            description="How the agent structures and delivers responses."
          >
            <SettingsRadioGroup
              options={COMMUNICATION_STYLES}
              value={communicationStyle}
              onChange={setCommunicationStyle}
            />
          </SettingsSection>

          {/* AI Questions Section */}
          <SettingsSection
            icon={HelpCircle}
            title="AI Questions"
            description="Control how often the AI asks clarifying questions before responding."
          >
            <div className="space-y-4">
              <SettingsRadioGroup
                options={QUESTION_FREQUENCY}
                value={questionFrequency}
                onChange={setQuestionFrequency}
              />
              
              {questionFrequency !== "none" && (
                <SettingsSlider
                  label="Max Questions Per Response"
                  description="Limit how many questions the AI can ask at once"
                  value={maxQuestions}
                  onChange={setMaxQuestions}
                  min={0}
                  max={5}
                  step={1}
                  labels={QUESTION_COUNT_LABELS}
                />
              )}
            </div>
          </SettingsSection>

          {/* Task Planning Section */}
          <SettingsSection
            icon={ClipboardList}
            title="Task Planning"
            description="When to show breakdowns for complex tasks."
          >
            <SettingsRadioGroup
              options={TASK_COMPLEXITY}
              value={taskComplexity}
              onChange={setTaskComplexity}
            />
          </SettingsSection>

          {/* Preferences Section */}
          <SettingsSection
            icon={Brain}
            title="Preferences"
            description="Additional behavior settings."
          >
            <div className="space-y-3">
              <SettingsToggle
                label="Auto-apply Changes"
                description="Apply code changes without confirmation"
                checked={autoApplyChanges}
                onChange={setAutoApplyChanges}
              />
              <SettingsToggle
                label="Challenge Ideas"
                description="Suggest alternatives and improvements"
                checked={challengeIdeas}
                onChange={setChallengeIdeas}
              />
            </div>
          </SettingsSection>

          {/* Conversation Memory Section */}
          <SettingsSection
            icon={Brain}
            title="Conversation Memory"
            description="Control how the assistant remembers information across conversations."
          >
            <div className="space-y-4">
              <SettingsToggle
                label="Enable Memory"
                description="Remember context from previous conversations"
                checked={memoryEnabled}
                onChange={setMemoryEnabled}
              />

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
                    type="button"
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
            </div>
          </SettingsSection>
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
