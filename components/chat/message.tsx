import { cn } from "@/lib/utils"
import type { Message } from "./types"
import { RefreshCcw, Copy, Share2, ThumbsUp, ThumbsDown } from "lucide-react"
import type { StreamingWord } from "./types"

interface MessageProps {
  message: Message
  streamingMessageId: string | null
  streamingWords: StreamingWord[]
  completedMessages: Set<string>
}

export default function MessageComponent({
  message,
  streamingMessageId,
  streamingWords,
  completedMessages,
}: MessageProps) {
  const isCompleted = completedMessages.has(message.id)

  return (
    <div className={cn("flex flex-col", message.type === "user" ? "items-end" : "items-start")}>
      {/* Display uploaded images if any */}
      {message.images && message.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 max-w-[80%]">
          {message.images.map((image) => (
            <img
              key={image.id}
              src={image.url || "/placeholder.svg"}
              alt="Uploaded"
              className="max-w-[150px] max-h-[150px] object-cover rounded-lg border border-gray-200"
            />
          ))}
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl",
          message.type === "user" ? "bg-white border border-gray-200 rounded-br-none" : "text-gray-900",
        )}
      >
        {/* For user messages or completed system messages, render without animation */}
        {message.content && (
          <span className={message.type === "system" && !isCompleted ? "animate-fade-in" : ""}>{message.content}</span>
        )}

        {/* For streaming messages, render with animation */}
        {message.id === streamingMessageId && (
          <span className="inline">
            {streamingWords.map((word) => (
              <span key={word.id} className="animate-fade-in inline">
                {word.text}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Message actions */}
      {message.type === "system" && message.completed && (
        <div className="flex items-center gap-2 px-4 mt-1 mb-2">
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Copy className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ThumbsDown className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
