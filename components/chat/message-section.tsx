import type React from "react"
import type { MessageSection } from "./types"
import MessageComponent from "./message"
import { getContentHeight } from "./utils"
import type { StreamingWord } from "./types"

interface MessageSectionProps {
  section: MessageSection
  streamingMessageId: string | null
  streamingWords: StreamingWord[]
  completedMessages: Set<string>
  viewportHeight: number
  isLastSection: boolean
  newSectionRef: React.RefObject<HTMLDivElement>
}

export default function MessageSectionComponent({
  section,
  streamingMessageId,
  streamingWords,
  completedMessages,
  viewportHeight,
  isLastSection,
  newSectionRef,
}: MessageSectionProps) {
  // Determine if a section should have fixed height (only for sections after the first)
  const shouldApplyHeight = (sectionIndex: number) => {
    return sectionIndex > 0
  }

  return (
    <div ref={isLastSection && section.isNewSection ? newSectionRef : null}>
      {section.isNewSection && (
        <div
          style={
            section.isActive && shouldApplyHeight(section.sectionIndex)
              ? { height: `${getContentHeight(viewportHeight)}px` }
              : {}
          }
          className="pt-4 flex flex-col justify-start"
        >
          {section.messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              streamingMessageId={streamingMessageId}
              streamingWords={streamingWords}
              completedMessages={completedMessages}
            />
          ))}
        </div>
      )}

      {!section.isNewSection && (
        <div>
          {section.messages.map((message) => (
            <MessageComponent
              key={message.id}
              message={message}
              streamingMessageId={streamingMessageId}
              streamingWords={streamingWords}
              completedMessages={completedMessages}
            />
          ))}
        </div>
      )}
    </div>
  )
}
