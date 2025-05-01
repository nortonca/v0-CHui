"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic } from "lucide-react"
import { cn } from "@/lib/utils"

interface MicrophoneButtonProps {
  isStreaming: boolean
  setInputValue: (value: React.ChangeEvent<HTMLTextAreaElement>) => void
  setHasTyped: (value: boolean) => void
}

export default function MicrophoneButton({ isStreaming, setInputValue, setHasTyped }: MicrophoneButtonProps) {
  const [isRecording, setIsRecording] = useState(false)

  const toggleMicrophone = () => {
    if (isRecording) {
      // Stop recording logic would go here
      setIsRecording(false)
    } else {
      // Start recording logic would go here
      setIsRecording(true)

      // For demo purposes, simulate stopping after 3 seconds
      setTimeout(() => {
        setIsRecording(false)
        // Simulate adding transcribed text
        const simulatedText = "This is simulated voice input."

        // Create a mock event to match the expected interface
        const mockEvent = {
          target: {
            value: simulatedText,
          },
        } as React.ChangeEvent<HTMLTextAreaElement>

        setInputValue(mockEvent)
        setHasTyped(true)
      }, 3000)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "rounded-full h-8 w-8 flex-shrink-0 border-gray-200 p-0 transition-colors",
        isRecording && "bg-red-50 border-red-200",
      )}
      onClick={toggleMicrophone}
      disabled={isStreaming}
    >
      <Mic className={cn("h-4 w-4", isRecording ? "text-red-500" : "text-gray-500")} />
      <span className="sr-only">Microphone</span>
    </Button>
  )
}
