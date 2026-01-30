"use client"

import MicrophoneButton from "../buttons/microphone-button"
import VoiceToggleButton from "../buttons/voice-toggle-button"
import SendButton from "../buttons/send-button"
import type { UploadedImage } from "../types"

interface InputActionsProps {
  isStreaming: boolean
  hasTyped: boolean
  inputValue: string
  uploadedImages: UploadedImage[]
  onVoiceModeClick: () => void
  onInputValueChange: (value: string) => void
  onHasTypedChange: (hasTyped: boolean) => void
}

export default function InputActions({
  isStreaming,
  hasTyped,
  inputValue,
  uploadedImages,
  onVoiceModeClick,
  onInputValueChange,
  onHasTypedChange,
}: InputActionsProps) {
  return (
    <div className="flex items-center space-x-2 flex-shrink-0">
      <MicrophoneButton 
        isStreaming={isStreaming} 
        setInputValue={onInputValueChange} 
        setHasTyped={onHasTypedChange} 
      />
      
      {!hasTyped && uploadedImages.length === 0 ? (
        <VoiceToggleButton
          isStreaming={isStreaming}
          onClick={onVoiceModeClick}
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
