"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Send, Plus, X, Mic, Sparkles, AudioWaveform } from "lucide-react"
import type { ActiveButtonState, UploadedImage } from "../types"
import MemoryPanel, { type Memory } from "../memory-panel"
import CheckpointsPanel, { type Checkpoint } from "../checkpoints-panel"
import PlaybooksPanel, { type Playbook } from "../playbooks-panel"
import TaskPanel, { type Task } from "../task-panel"
import ThinkPanel from "../think-panel"
import ToolsPanel from "../tools-panel"
import CollaborationModeToggle, { type CollaborationMode } from "../collaboration-mode"
import ComposerTray from "./composer-tray"
import ImagePreview from "./image-preview"
import VoiceModeModal from "@/components/voice/voice-mode-modal"

interface ComposerProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  isMobile: boolean
  activeButtons: ActiveButtonState
  setActiveButtons: (buttons: ActiveButtonState) => void
  textareaRef: React.RefObject<HTMLTextAreaElement | null>
  uploadedImages: UploadedImage[]
  setUploadedImages: (images: UploadedImage[]) => void
  // Memory
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  // Checkpoints
  checkpoints: Checkpoint[]
  currentCheckpointId?: string
  onCheckpointRestore: (id: string) => void
  onCheckpointCreate: () => void
  // Playbooks
  playbooks: Playbook[]
  onPlaybookRun: (playbook: Playbook) => void
  onPlaybookAdd: (playbook: Omit<Playbook, "id">) => void
  onPlaybookDelete: (id: string) => void
  // Collaboration mode
  collaborationMode: CollaborationMode
  onCollaborationModeChange: (mode: CollaborationMode) => void
}

export function Composer({
  inputValue,
  setInputValue,
  handleSubmit,
  isStreaming,
  isMobile,
  activeButtons,
  setActiveButtons,
  textareaRef,
  uploadedImages,
  setUploadedImages,
  memories,
  onMemoryEdit,
  onMemoryDelete,
  checkpoints,
  currentCheckpointId,
  onCheckpointRestore,
  onCheckpointCreate,
  playbooks,
  onPlaybookRun,
  onPlaybookAdd,
  onPlaybookDelete,
  collaborationMode,
  onCollaborationModeChange,
}: ComposerProps) {
  const [isTrayOpen, setIsTrayOpen] = useState(false)
  const [activePanel, setActivePanel] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Derived states
  const activeFeatureCount = [
    activeButtons.thinkLevel !== "off",
    activeButtons.selectedTools.length > 0,
    activeButtons.image,
  ].filter(Boolean).length

  const hasContent = inputValue.trim().length > 0 || uploadedImages.length > 0

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 200))
      textarea.style.height = `${newHeight}px`
    }
  }, [inputValue, textareaRef])

  // Close tray when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsTrayOpen(false)
        setActivePanel(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isStreaming) return
    
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handlePanelToggle = (panel: string) => {
    if (activePanel === panel) {
      setActivePanel(null)
    } else {
      setActivePanel(panel)
      setIsTrayOpen(false)
    }
  }

  const handleThinkLevelChange = (level: "off" | "on" | "deep") => {
    setActiveButtons({ ...activeButtons, thinkLevel: level })
  }

  const handleToolsChange = (tools: string[]) => {
    setActiveButtons({ ...activeButtons, selectedTools: tools })
  }

  const handleImageToggle = () => {
    setActiveButtons({ ...activeButtons, image: !activeButtons.image })
  }

  const handleRemoveImage = (id: string) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id))
  }

  const handleAddImages = (files: FileList) => {
    const newImages: UploadedImage[] = []
    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          newImages.push({
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: e.target.result as string,
            thumbnail: e.target.result as string,
          })
          if (newImages.length === files.length) {
            setUploadedImages([...uploadedImages, ...newImages])
          }
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleMicrophoneClick = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
    } else {
      // Start recording - simulate for now
      setIsRecording(true)
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50)
      }
      
      // Simulate stopping after 3 seconds with transcribed text
      setTimeout(() => {
        setIsRecording(false)
        setInputValue(inputValue + (inputValue ? " " : "") + "This is simulated voice input.")
      }, 3000)
    }
  }

  const handleVoiceModeClick = () => {
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
    setIsVoiceModeOpen(true)
  }

  // Task handlers
  const handleTaskToggle = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }
  const handleTaskAdd = (text: string) => {
    setTasks(prev => [...prev, { id: `task-${Date.now()}`, text, completed: false, addedBy: "user" }])
  }
  const handleTaskEdit = (id: string, text: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, text } : t))
  }
  const handleTaskDelete = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background to-transparent pt-8 pb-safe"
    >
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Panels - Using actual panel components with old UI */}
        <div className="relative">
          {/* Memory/Notebook Panel */}
          <MemoryPanel
            isExpanded={activePanel === "notebook"}
            onToggle={() => handlePanelToggle("notebook")}
            memories={memories}
            onMemoryEdit={onMemoryEdit}
            onMemoryDelete={onMemoryDelete}
            isMobile={isMobile}
          />

          {/* Task Panel */}
          <TaskPanel
            isExpanded={activePanel === "tasks"}
            onToggle={() => handlePanelToggle("tasks")}
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskAdd={handleTaskAdd}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            isMobile={isMobile}
          />

          {/* Think Panel */}
          <ThinkPanel
            isExpanded={activePanel === "think"}
            onToggle={() => handlePanelToggle("think")}
            thinkLevel={activeButtons.thinkLevel}
            onLevelChange={handleThinkLevelChange}
            isMobile={isMobile}
          />

          {/* Tools Panel */}
          <ToolsPanel
            isExpanded={activePanel === "tools"}
            onToggle={() => handlePanelToggle("tools")}
            selectedTools={activeButtons.selectedTools}
            onToolsChange={handleToolsChange}
            isMobile={isMobile}
          />

          {/* Playbooks Panel */}
          <PlaybooksPanel
            isExpanded={activePanel === "playbooks"}
            onToggle={() => handlePanelToggle("playbooks")}
            playbooks={playbooks}
            onPlaybookRun={onPlaybookRun}
            onPlaybookAdd={onPlaybookAdd}
            onPlaybookDelete={onPlaybookDelete}
            isMobile={isMobile}
          />

          {/* Checkpoints Panel */}
          <CheckpointsPanel
            isExpanded={activePanel === "checkpoints"}
            onToggle={() => handlePanelToggle("checkpoints")}
            checkpoints={checkpoints}
            currentCheckpointId={currentCheckpointId}
            onRestore={onCheckpointRestore}
            onCreateCheckpoint={onCheckpointCreate}
            isMobile={isMobile}
          />

          {/* Collaboration Mode Panel */}
          {activePanel === "mode" && (
            <div className={cn(
              "absolute left-0 right-0 bottom-full mb-2 p-4 bg-card border border-border rounded-2xl shadow-lg",
              "animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-2"
            )}>
              <CollaborationModeToggle
                mode={collaborationMode}
                onModeChange={onCollaborationModeChange}
              />
            </div>
          )}
        </div>

        {/* Expandable Tray */}
        <ComposerTray
          isOpen={isTrayOpen}
          onClose={() => setIsTrayOpen(false)}
          onPanelToggle={handlePanelToggle}
          activePanel={activePanel}
          activeButtons={activeButtons}
          onImageToggle={handleImageToggle}
          onAddImages={handleAddImages}
          memoriesCount={memories.length}
          tasksCount={tasks.length}
          tasksCompletedCount={tasks.filter(t => t.completed).length}
          checkpointsCount={checkpoints.length}
          isMobile={isMobile}
        />

        {/* Image Preview */}
        {uploadedImages.length > 0 && (
          <ImagePreview 
            images={uploadedImages} 
            onRemove={handleRemoveImage} 
          />
        )}

        {/* Main Input */}
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "relative flex items-end gap-2 sm:gap-3 p-2 sm:p-3",
            "bg-card border border-border rounded-2xl sm:rounded-3xl",
            "shadow-lg transition-all duration-200",
            isStreaming && "opacity-70"
          )}>
            {/* Plus Button - Opens Tray */}
            <button
              type="button"
              onClick={() => {
                setIsTrayOpen(!isTrayOpen)
                setActivePanel(null)
              }}
              className={cn(
                "relative flex-shrink-0 flex items-center justify-center",
                "w-10 h-10 sm:w-9 sm:h-9 rounded-full",
                "bg-muted/50 hover:bg-muted active:bg-muted/75",
                "transition-all duration-200",
                isTrayOpen && "bg-primary/10 text-primary rotate-45"
              )}
              aria-label={isTrayOpen ? "Close options" : "Open options"}
            >
              <Plus className="w-5 h-5" />
              {/* Active feature badge */}
              {activeFeatureCount > 0 && !isTrayOpen && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {activeFeatureCount}
                </span>
              )}
            </button>

            {/* Textarea */}
            <div className="flex-1 min-w-0">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message..."
                disabled={isStreaming}
                rows={1}
                className={cn(
                  "w-full bg-transparent border-0 outline-none resize-none",
                  "text-base sm:text-[15px] text-foreground placeholder:text-muted-foreground/60",
                  "py-2 px-1 min-h-[24px] max-h-[200px]",
                  "leading-relaxed"
                )}
              />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
              {/* Think indicator */}
              {activeButtons.thinkLevel !== "off" && (
                <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  <span className="capitalize">{activeButtons.thinkLevel}</span>
                </div>
              )}

              {/* Microphone Button - Speech-to-text */}
              <button
                type="button"
                onClick={handleMicrophoneClick}
                disabled={isStreaming}
                className={cn(
                  "flex items-center justify-center",
                  "w-10 h-10 sm:w-9 sm:h-9 rounded-full",
                  "transition-all duration-150",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  isRecording 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-muted/50 hover:bg-muted active:bg-muted/75"
                )}
                aria-label={isRecording ? "Stop recording" : "Voice to text"}
              >
                <Mic className="w-4 h-4" />
              </button>

              {/* Voice Mode / Send Button */}
              {hasContent ? (
                <button
                  type="submit"
                  disabled={isStreaming}
                  className={cn(
                    "flex items-center justify-center",
                    "w-10 h-10 sm:w-9 sm:h-9 rounded-full",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 active:scale-95",
                    "transition-all duration-150",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleVoiceModeClick}
                  disabled={isStreaming}
                  className={cn(
                    "flex items-center justify-center",
                    "w-10 h-10 sm:w-9 sm:h-9 rounded-full",
                    "bg-primary text-primary-foreground",
                    "hover:bg-primary/90 active:scale-95",
                    "transition-all duration-150",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  aria-label="Open voice mode"
                >
                  <AudioWaveform className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Keyboard hint - desktop only */}
          <div className="hidden sm:flex justify-center mt-2">
            <span className="text-[11px] text-muted-foreground/50">
              Press Enter to send, Shift+Enter for new line
            </span>
          </div>
        </form>
      </div>

      {/* Voice Mode Modal */}
      <VoiceModeModal 
        isOpen={isVoiceModeOpen} 
        onClose={() => setIsVoiceModeOpen(false)} 
      />
    </div>
  )
}
