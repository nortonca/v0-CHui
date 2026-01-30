"use client"

import type React from "react"
import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import type { ActiveButtonState, UploadedImage } from "../types"
import type { CollaborationMode } from "../collaboration-mode"
import ImageUpload from "../image-upload"
import TextareaInput from "../textarea-input"
import InputControls from "./input-controls"
import InputActions from "./input-actions"
import VoiceModeModal from "@/components/voice/voice-mode-modal"

interface InputBarProps {
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
  // Panel states
  isMemoryPanelExpanded: boolean
  isTaskPanelExpanded: boolean
  isPlaybooksPanelExpanded: boolean
  isCheckpointsPanelExpanded: boolean
  memoriesCount: number
  tasksCount: number
  tasksCompletedCount: number
  checkpointsCount: number
  collaborationMode: CollaborationMode
  onTogglePanel: (panel: "memory" | "task" | "playbooks" | "checkpoints") => void
  onCollaborationModeChange: (mode: CollaborationMode) => void
}

export default function InputBar({
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
  isMemoryPanelExpanded,
  isTaskPanelExpanded,
  isPlaybooksPanelExpanded,
  isCheckpointsPanelExpanded,
  memoriesCount,
  tasksCount,
  tasksCompletedCount,
  checkpointsCount,
  collaborationMode,
  onTogglePanel,
  onCollaborationModeChange,
}: InputBarProps) {
  const [hasTyped, setHasTyped] = useState(false)
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false)
  const inputContainerRef = useRef<HTMLDivElement>(null)
  const selectionStateRef = useRef<{ start: number | null; end: number | null }>({ start: null, end: null })

  // Save/restore selection state
  const saveSelectionState = () => {
    if (textareaRef.current) {
      selectionStateRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      }
    }
  }

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

  // Handlers
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
      setTimeout(() => restoreSelectionState(), 0)
    }
  }

  const handleThinkLevelChange = (level: "off" | "on" | "deep") => {
    // Type matches ThinkLevel from think-button.tsx
    saveSelectionState()
    setActiveButtons((prev) => ({ ...prev, thinkLevel: level }))
    setTimeout(() => restoreSelectionState(), 0)
  }

  const handleToolsChange = (tools: string[]) => {
    saveSelectionState()
    setActiveButtons((prev) => ({ ...prev, selectedTools: tools }))
    setTimeout(() => restoreSelectionState(), 0)
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

  return (
    <>
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
            "relative w-full rounded-3xl border border-border bg-card p-3 cursor-text overflow-visible",
            isStreaming && "opacity-80",
          )}
          onClick={handleInputContainerClick}
        >
          <div className="pb-12">
            <TextareaInput
              textareaRef={textareaRef}
              inputValue={inputValue}
              handleInputChange={handleInputChange}
              handleKeyDown={handleKeyDown}
              isStreaming={isStreaming}
              isMobile={isMobile}
            />
          </div>

          <div className="absolute bottom-3 left-3 right-3 z-10">
            <div className="flex items-center justify-between">
              <InputControls
                activeButtons={activeButtons}
                isStreaming={isStreaming}
                isMemoryPanelExpanded={isMemoryPanelExpanded}
                isTaskPanelExpanded={isTaskPanelExpanded}
                isPlaybooksPanelExpanded={isPlaybooksPanelExpanded}
                isCheckpointsPanelExpanded={isCheckpointsPanelExpanded}
                memoriesCount={memoriesCount}
                tasksCount={tasksCount}
                tasksCompletedCount={tasksCompletedCount}
                checkpointsCount={checkpointsCount}
                collaborationMode={collaborationMode}
                onToggleButton={toggleButton}
                onThinkLevelChange={handleThinkLevelChange}
                onToolsChange={handleToolsChange}
                onTogglePanel={onTogglePanel}
                onCollaborationModeChange={onCollaborationModeChange}
              />

              <InputActions
                isStreaming={isStreaming}
                hasTyped={hasTyped}
                inputValue={inputValue}
                uploadedImages={uploadedImages}
                onVoiceModeClick={() => setIsVoiceModalOpen(true)}
                onInputValueChange={setInputValue}
                onHasTypedChange={setHasTyped}
              />
            </div>
          </div>
        </div>
      </form>

      {/* Voice Mode Modal */}
      <VoiceModeModal 
        isOpen={isVoiceModalOpen} 
        onClose={() => setIsVoiceModalOpen(false)} 
      />
    </>
  )
}
