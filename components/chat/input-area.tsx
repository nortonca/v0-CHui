"use client"

import type React from "react"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import type { ActiveButton, UploadedImage } from "./types"
import ImageUpload from "./image-upload"
import TextareaInput from "./textarea-input"
import ImageButton from "./buttons/image-button"
import SearchButton from "./buttons/search-button"
import ThinkButton from "./buttons/think-button"
import MicrophoneButton from "./buttons/microphone-button"
import SendButton from "./buttons/send-button"

interface InputAreaProps {
  inputValue: string
  setInputValue: (value: string) => void
  handleSubmit: (e: React.FormEvent) => void
  isStreaming: boolean
  isMobile: boolean
  activeButton: ActiveButton
  setActiveButton: (button: ActiveButton) => void
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
  activeButton,
  setActiveButton,
  textareaRef,
  uploadedImages,
  setUploadedImages,
}: InputAreaProps) {
  const [hasTyped, setHasTyped] = useState(false)
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

  const toggleButton = (button: ActiveButton) => {
    if (!isStreaming) {
      // Save the current selection state before toggling
      saveSelectionState()

      setActiveButton((prev) => (prev === button ? "none" : button))

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

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {/* Image upload area */}
        <ImageUpload
          images={uploadedImages}
          onRemoveImage={handleRemoveImage}
          onAddImages={handleAddImages}
          isVisible={activeButton === "image"}
        />

        <div
          ref={inputContainerRef}
          className={cn(
            "relative w-full rounded-3xl border border-gray-200 bg-white p-3 cursor-text",
            isStreaming && "opacity-80",
          )}
          onClick={handleInputContainerClick}
        >
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
                <ImageButton activeButton={activeButton} toggleButton={toggleButton} isStreaming={isStreaming} />

                <SearchButton activeButton={activeButton} toggleButton={toggleButton} isStreaming={isStreaming} />

                <ThinkButton
                  activeButton={activeButton}
                  toggleButton={toggleButton}
                  isStreaming={isStreaming}
                  setActiveButton={setActiveButton}
                  focusTextarea={focusTextarea}
                />
              </div>

              <div className="flex items-center space-x-2">
                <MicrophoneButton isStreaming={isStreaming} setInputValue={setInputValue} setHasTyped={setHasTyped} />

                <SendButton
                  hasTyped={hasTyped}
                  inputValue={inputValue}
                  isStreaming={isStreaming}
                  uploadedImages={uploadedImages}
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
