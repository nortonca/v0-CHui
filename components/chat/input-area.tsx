"use client"

import type React from "react"
import MicrophoneButton from "./buttons/microphone-button" // Import MicrophoneButton
import SearchButton from "./buttons/search-button" // Import SearchButton

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
import { ListTodo } from "lucide-react"

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
}: InputAreaProps) {
  const [hasTyped, setHasTyped] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const [isTaskPanelExpanded, setIsTaskPanelExpanded] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const selectionStateRef = useRef<{ start: number | null; end: number | null }>({ start: null, end: null })

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
      // Focus first, then set selection range
      textarea.focus()
      textarea.setSelectionRange(start, end)
    } else if (textarea) {
      // If no selection was saved, just focus
      textarea.focus()
    }
  }

  const focusTextarea = () => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }

  const handleInputContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only focus if clicking directly on the container, not on buttons or other interactive elements
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

    // Only allow input changes when not streaming
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
    // Handle Cmd+Enter on both mobile and desktop
    if (!isStreaming && e.key === "Enter" && e.metaKey) {
      e.preventDefault()
      handleSubmit(e)
      return
    }

    // Only handle regular Enter key (without Shift) on desktop
    if (!isStreaming && !isMobile && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  // Update the toggleButton function to toggle individual buttons
  const toggleButton = (button: keyof ActiveButtonState) => {
    if (!isStreaming) {
      // Save the current selection state before toggling
      saveSelectionState()

      setActiveButtons((prev) => ({
        ...prev,
        [button]: !prev[button],
      }))

      // Restore the selection state after toggling
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

          // If this is the last file, update state
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

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
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
          {/* Task Panel */}
          <TaskPanel
            isExpanded={isTaskPanelExpanded}
            onToggle={() => setIsTaskPanelExpanded(!isTaskPanelExpanded)}
            tasks={tasks}
            onTaskToggle={handleTaskToggle}
            onTaskAdd={handleTaskAdd}
            onTaskEdit={handleTaskEdit}
            onTaskDelete={handleTaskDelete}
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
              <div className="flex items-center space-x-2">
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

                {/* Task Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsTaskPanelExpanded(!isTaskPanelExpanded)}
                  className={cn(
                    "rounded-full h-8 px-3 flex items-center border border-border gap-1.5 transition-colors bg-background",
                    isTaskPanelExpanded && "bg-primary/10 border-primary/20",
                    tasks.length > 0 && !isTaskPanelExpanded && "border-primary/50"
                  )}
                  disabled={isStreaming}
                  aria-label="Toggle tasks"
                >
                  <ListTodo className={cn("h-4 w-4 text-muted-foreground", isTaskPanelExpanded && "text-primary")} />
                  {tasks.length > 0 && (
                    <span className={cn("text-xs font-medium", isTaskPanelExpanded ? "text-primary" : "text-muted-foreground")}>
                      {tasks.filter(t => t.completed).length}/{tasks.length}
                    </span>
                  )}
                </button>

                {/* Display selected tools as chips */}
                {activeButtons.selectedTools.length > 0 && (
                  <div className="flex items-center gap-1.5 ml-2">
                    {activeButtons.selectedTools.map((tool) => (
                      <span
                        key={tool}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
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
