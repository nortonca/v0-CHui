"use client"

import type React from "react"

import { useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

interface TextareaInputProps {
  textareaRef: React.RefObject<HTMLTextAreaElement>
  inputValue: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  isStreaming: boolean
  isMobile: boolean
}

export default function TextareaInput({
  textareaRef,
  inputValue,
  handleInputChange,
  handleKeyDown,
  isStreaming,
  isMobile,
}: TextareaInputProps) {
  // Focus the textarea on component mount (only on desktop)
  useEffect(() => {
    if (textareaRef.current && !isMobile) {
      textareaRef.current.focus()
    }
  }, [isMobile, textareaRef])

  return (
    <Textarea
      ref={textareaRef}
      placeholder={isStreaming ? "Waiting for response..." : "Ask Anything"}
      className="min-h-[24px] max-h-[160px] w-full rounded-3xl border-0 bg-transparent text-gray-900 placeholder:text-gray-400 placeholder:text-base focus-visible:ring-0 focus-visible:ring-offset-0 text-base pl-2 pr-4 pt-0 pb-0 resize-none overflow-y-auto leading-tight"
      value={inputValue}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onFocus={() => {
        // Ensure the textarea is scrolled into view when focused
        if (textareaRef.current) {
          textareaRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }}
    />
  )
}
