"use client"

import type React from "react"
import MicrophoneButton from "./buttons/microphone-button"
import SearchButton from "./buttons/search-button"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import type { ActiveButtonState, UploadedImage } from "./types"
import ImageUpload from "./image-upload"
import TextareaInput from "./textarea-input"
import ImageButton from "./buttons/image-button"
import ToolsButton from "./buttons/tools-button"
import ThinkButton from "./buttons/think-button"
import VoiceToggleButton from "./buttons/voice-toggle-button"
import SendButton from "./buttons/send-button"
import VoiceModeModal from "@/components/voice/voice-mode-modal"
import TaskPanel, { type Task } from "./task-panel"
import MemoryPanel, { type Memory } from "./memory-panel"
import PlaybooksPanel, { type Playbook } from "./playbooks-panel"
import CheckpointsPanel, { type Checkpoint } from "./checkpoints-panel"
import QuickActions from "./quick-actions"
import CollaborationModeToggle, { type CollaborationMode } from "./collaboration-mode"
import { ListTodo, Brain, BookOpen, History } from "lucide-react"

interface InputAreaProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  isMobile: boolean
  activeButtons: ActiveButtonState
  setActiveButtons: (buttons: ActiveButtonState) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  uploadedImages: UploadedImage[]
  setUploadedImages: (images: UploadedImage[]) => void
  // Memory props
  memories: Memory[]
  onMemoryEdit: (id: string, text: string) => void
  onMemoryDelete: (id: string) => void
  // Checkpoint props
  checkpoints: Checkpoint[]
  currentCheckpointId?: string
  onCheckpointRestore: (id: string) => void
  onCheckpointCreate: () => void
  // Playbook props
  playbooks: Playbook[]
  onPlaybookRun: (playbook: Playbook) => void
  onPlaybookAdd: (playbook: Omit<Playbook, "id">) => void
  onPlaybookDelete: (id: string) => void
  // Collaboration mode props
  collaborationMode: CollaborationMode
  onCollaborationModeChange: (mode: CollaborationMode) => void
}

export default function InputArea({
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
}: InputAreaProps) {
  const [hasTyped, setHasTyped] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false)
  const [isMemoryPanelExpanded, setIsMemoryPanelExpanded] = useState(false)
  const [isPlaybooksPanelExpanded, setIsPlaybooksPanelExpanded] = useState(false)
  const [isCheckpointsPanelExpanded, setIsCheckpointsPanelExpanded] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const selectionStateRef = useRef<{ start: number | null; end: number | null }>({ start: null, end: null })

  // Toggle panel with exclusive behavior - only one panel open at a time
  const togglePanel = (panel: "task" | "memory" | "playbooks" | "checkpoints") => {
    const isCurrentlyOpen = 
      (panel === "task" && isTaskPanelExpanded) ||
      (panel === "memory" && isMemoryPanelExpanded) ||
      (panel === "playbooks" && isPlaybooksPanelExpanded) ||
      (panel === "checkpoints" && isCheckpointsPanelExpanded)

    // Close all panels first
    setIsTaskPanelExpanded(false)
    setIsMemoryPanelExpanded(false)
    setIsPlaybooksPanelExpanded(false)
    setIsCheckpointsPanelExpanded(false)

    // If the panel was closed, open it
    if (!isCurrentlyOpen) {
      switch (panel) {
        case "task":
          setIsTaskPanelExpanded(true)
          break
        case "memory":
          setIsMemoryPanelExpanded(true)
          break
        case "playbooks":
          setIsPlaybooksPanelExpanded(true)
          break
        case "checkpoints":
          setIsCheckpointsPanelExpanded(true)
          break
      }
    }
  }

  // Save the current selection state
  const saveSelectionState = () => {
    if (textareaRef.current) {
      selectionStateRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      }
    }
  }

  // Restore the saved selection state
  const restoreSelectionState = () => {
    const textarea = textareaRef.current
    const { start, end } = selectionStateRef.current

    if (textarea && start !== null && end !== null) {
      textarea.focus()
      textarea.setSelectionRange(start, end)
    } else if (textarea) {
      textarea.focus()
    }
  }

  const focusTextarea = () => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }

  const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target === e.currentTarget ||
      (e.currentTarget === inputContainerRef.current && !(e.target as HTMLElement).closest("button"))
    ) {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value

    if (!isStreaming) {
      setInputValue(newValue)

      if (newValue.trim() !== "" && !hasTyped) {
        setHasTyped(true)
      } else if (newValue.trim() === "" && hasTyped) {
        setHasTyped(false)
      }

      const textarea = textareaRef.current
      if (textarea) {
        textarea.style.height = "auto"
        const newHeight = Math.max(24, Math.min(textarea.scrollHeight, 160))
        textarea.style.height = `${newHeight}px`
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!isStreaming && e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    if (!isStreaming && !isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const toggleButton = (button: keyof ActiveButtonState) => {
    if (!isStreaming) {
      saveSelectionState()

      setActiveButtons((prev) => ({
        ...prev,
        [button]: !prev[button],
      }))

      setTimeout(() => {
        restoreSelectionState()
      }, 0)
    }
  }

  const handleAddImages = (files: FileList) => {
    const newImages: UploadedImage[] = []

    Array.from(files).forEach((file) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        if (e.target?.result) {
          const newImage = {
            id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            url: e.target.result as string,
            thumbnail: e.target.result as string,
          }

          newImages.push(newImage)

          if (newImages.length === files.length) {
            setUploadedImages([...uploadedImages, ...newImages])
          }
        }
      }

      reader.readAsDataURL(file)
    })
  }

  const handleRemoveImage = (id: string) => {
    setUploadedImages(uploadedImages.filter((img) => img.id !== id))
  }

  // Task management functions
  const handleTaskToggle = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const handleTaskAdd = (text: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      text,
      completed: false,
      addedBy: "user",
    }
    setTasks((prev) => [...prev, newTask])
  }

  const handleTaskEdit = (id: string, text: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, text } : task
      )
    )
  }

  const handleTaskDelete = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  // Quick action handler
  const handleQuickAction = (prompt: string) => {
    setInputValue(prompt)
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = "auto"
      const newHeight = Math.max(24, Math.min(textareaRef.current.scrollHeight, 160))
      textareaRef.current.style.height = `${newHeight}px`
    }
    setHasTyped(true)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Quick Actions Bar */}
        <QuickActions
          onActionSelect={handleQuickAction}
          isStreaming={isStreaming}
          className="mb-3"
        />

        {/* Image upload area */}
        <ImageUpload
          images={uploadedImages}
          onRemoveImage={handleRemoveImage}
          onAddImages={handleAddImages}
          isVisible={activeButtons.image}
        />

        <div
          ref={inputContainerRef}
          className={cn(
            "relative w-full rounded-3xl border border-border bg-card p-3 cursor-text",
            isStreaming && "opacity-80",
          )}
          onClick={handleInputContainerClick}
        >
          {/* Memory Panel */}
          <MemoryPanel
            isExpanded={isMemoryPanelExpanded}
            onToggle={() => togglePanel("memory")}
            memories={memories}
            onMemoryEdit={onMemoryEdit}
            onMemoryDelete={onMemoryDelete}
            isMobile={isMobile}
          />

          {/* Task Panel */}
          <TaskPanel
            isExpanded={isTaskPanelExpanded}
            onToggle={() => togglePanel("task")}
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskAdd={handleTaskAdd}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
            isMobile={isMobile}
          />

          {/* Playbooks Panel */}
          <PlaybooksPanel
            isExpanded={isPlaybooksPanelExpanded}
            onToggle={() => togglePanel("playbooks")}
            playbooks={playbooks}
            onPlaybookRun={onPlaybookRun}
            onPlaybookAdd={onPlaybookAdd}
            onPlaybookDelete={onPlaybookDelete}
            isMobile={isMobile}
          />

          {/* Checkpoints Panel */}
          <CheckpointsPanel
            isExpanded={isCheckpointsPanelExpanded}
            onToggle={() => togglePanel("checkpoints")}
            checkpoints={checkpoints}
            currentCheckpointId={currentCheckpointId}
            onRestore={onCheckpointRestore}
            onCreateCheckpoint={onCheckpointCreate}
            isMobile={isMobile}
          />

          <div className="pb-9">
            <TextareaInput
              textareaRef={textareaRef}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              isStreaming={isStreaming}
              isMobile={isMobile}
            />
          </div>

          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <ImageButton
                  isActive={activeButtons.image}
                  toggleButton={() => toggleButton("image")}
                  isStreaming={isStreaming}
                />

                <ThinkButton
                  thinkLevel={activeButtons.thinkLevel}
                  onLevelChange={(level) => {
                    saveSelectionState()
                    setActiveButtons((prev) => ({ ...prev, thinkLevel: level }))
                    setTimeout(() => restoreSelectionState(), 0)
                  }}
                  isStreaming={isStreaming}
                />

                <ToolsButton
                  selectedTools={activeButtons.selectedTools}
                  onToolsChange={(tools) => {
                    saveSelectionState()
                    setActiveButtons((prev) => ({ ...prev, selectedTools: tools }))
                    setTimeout(() => restoreSelectionState(), 0)
                  }}
                  isStreaming={isStreaming}
                />

                {/* Divider */}
                <div className="w-px h-5 bg-border mx-1" />

                {/* Memory Toggle Button */}
                <button
                  type="button"
                  onClick={() => togglePanel("memory")}
                  className={cn(
                    "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
                    isMemoryPanelExpanded && "bg-primary/10 border-primary/20",
                    memories.length > 0 && !isMemoryPanelExpanded && "border-primary/50"
                  )}
                  disabled={isStreaming}
                  aria-label="Toggle memory"
                  title="Memory"
                >
                  <Brain className={cn("h-4 w-4 text-muted-foreground", isMemoryPanelExpanded && "text-primary")} />
                  {memories.length > 0 && (
                    <span className={cn("text-xs font-medium", isMemoryPanelExpanded ? "text-primary" : "text-muted-foreground")}>
                      {memories.length}
                    </span>
                  )}
                </button>

                {/* Task Toggle Button */}
                <button
                  type="button"
                  onClick={() => togglePanel("task")}
                  className={cn(
                    "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
                    isTaskPanelExpanded && "bg-primary/10 border-primary/20",
                    tasks.length > 0 && !isTaskPanelExpanded && "border-primary/50"
                  )}
                  disabled={isStreaming}
                  aria-label="Toggle tasks"
                  title="Tasks"
                >
                  <ListTodo className={cn("h-4 w-4 text-muted-foreground", isTaskPanelExpanded && "text-primary")} />
                  {tasks.length > 0 && (
                    <span className={cn("text-xs font-medium", isTaskPanelExpanded ? "text-primary" : "text-muted-foreground")}>
                      {tasks.filter(t => t.completed).length}/{tasks.length}
                    </span>
                  )}
                </button>

                {/* Playbooks Toggle Button */}
                <button
                  type="button"
                  onClick={() => togglePanel("playbooks")}
                  className={cn(
                    "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
                    isPlaybooksPanelExpanded && "bg-primary/10 border-primary/20"
                  )}
                  disabled={isStreaming}
                  aria-label="Toggle playbooks"
                  title="Playbooks"
                >
                  <BookOpen className={cn("h-4 w-4 text-muted-foreground", isPlaybooksPanelExpanded && "text-primary")} />
                </button>

                {/* Checkpoints Toggle Button */}
                <button
                  type="button"
                  onClick={() => togglePanel("checkpoints")}
                  className={cn(
                    "rounded-full h-8 px-2.5 flex items-center border border-border gap-1 transition-colors bg-background",
                    isCheckpointsPanelExpanded && "bg-primary/10 border-primary/20",
                    checkpoints.length > 0 && !isCheckpointsPanelExpanded && "border-primary/50"
                  )}
                  disabled={isStreaming}
                  aria-label="Toggle checkpoints"
                  title="Checkpoints"
                >
                  <History className={cn("h-4 w-4 text-muted-foreground", isCheckpointsPanelExpanded && "text-primary")} />
                  {checkpoints.length > 0 && (
                    <span className={cn("text-xs font-medium", isCheckpointsPanelExpanded ? "text-primary" : "text-muted-foreground")}>
                      {checkpoints.length}
                    </span>
                  )}
                </button>

                {/* Collaboration Mode Toggle */}
                <div className="hidden sm:block ml-1">
                  <CollaborationModeToggle
                    mode={collaborationMode}
                    onModeChange={onCollaborationModeChange}
                    isCompact={true}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <MicrophoneButton 
                  isStreaming={isStreaming} 
                  setInputValue={setInputValue} 
                  setHasTyped={setHasTyped} 
                />
                
                {!hasTyped && uploadedImages.length === 0 ? (
                  <VoiceToggleButton
                    isStreaming={isStreaming}
                    onClick={() => setIsVoiceModalOpen(true)}
                  />
                ) : (
                  <SendButton
                    hasTyped={hasTyped}
                    inputValue={inputValue}
                    isStreaming={isStreaming}
                    uploadedImages={uploadedImages}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Voice Mode Modal */}
      <VoiceModeModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </div>
  )
}
