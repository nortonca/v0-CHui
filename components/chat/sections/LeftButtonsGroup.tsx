import ImageButton from "../buttons/image-button"
import SearchButton from "../buttons/search-button"
import ThinkButton from "../buttons/think-button"
import type { ActiveButtonState } from "../types"

interface LeftButtonsGroupProps {
  activeButtons: ActiveButtonState
  toggleButton: (button: keyof ActiveButtonState) => void
  isStreaming: boolean
}

/**
 * LeftButtonsGroup Component
 * Renders the left group of action buttons (Image, Search, Think)
 * Manages button state and interactions
 */
export function LeftButtonsGroup({
  activeButtons,
  toggleButton,
  isStreaming,
}: LeftButtonsGroupProps) {
  return (
    <div className="flex items-center space-x-2">
      <ImageButton
        isActive={activeButtons.image}
        toggleButton={() => toggleButton("image")}
        isStreaming={isStreaming}
      />

      <SearchButton
        isActive={activeButtons.deepSearch}
        toggleButton={() => toggleButton("deepSearch")}
        isStreaming={isStreaming}
      />

      <ThinkButton
        isActive={activeButtons.think}
        toggleButton={() => toggleButton("think")}
        isStreaming={isStreaming}
      />
    </div>
  )
}
