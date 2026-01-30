'use client';

import MicrophoneButton from "../buttons/microphone-button"
import VoiceToggleButton from "../buttons/voice-toggle-button"
import SendButton from "../buttons/send-button"
import type { UploadedImage } from "../types"

interface RightButtonsGroupProps {
  hasTyped: boolean
  inputValue: string
  isStreaming: boolean
  uploadedImages: UploadedImage[]
  onVoiceClick: () => void
  setInputValue: (value: string) => void
  setHasTyped: (typed: boolean) => void
}

/**
 * RightButtonsGroup Component
 * Renders the right group of action buttons (Microphone, Voice Toggle/Send)
 * Manages voice mode and message submission
 */
export function RightButtonsGroup({
  hasTyped,
  inputValue,
  isStreaming,
  uploadedImages,
  onVoiceClick,
  setInputValue,
  setHasTyped,
}: RightButtonsGroupProps) {
  return (
    <div className="flex items-center space-x-2">
      <MicrophoneButton
        isStreaming={isStreaming}
        setInputValue={setInputValue}
        setHasTyped={setHasTyped}
      />

      {!hasTyped && uploadedImages.length === 0 ? (
        <VoiceToggleButton
          isStreaming={isStreaming}
          onClick={onVoiceClick}
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
  )
}
