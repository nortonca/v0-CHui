"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Message, StreamingWord } from "./types" // Import StreamingWord type
import { RefreshCcw, Copy, Share2, ThumbsUp, ThumbsDown } from "lucide-react"
import ImageViewer from "./image-viewer"
import ThinkingDisplay from "./thinking-display"
import ToolCallDisplay from "./tool-call-display"
import { Streamdown } from "streamdown"
import Markdown from "react-markdown" // Import Markdown component

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
  const [viewerOpen, setViewerOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setViewerOpen(true)
  }

  return (
    <div className={cn(
      "flex flex-col mb-4 px-4 sm:px-6",
      message.type === "user" ? "items-end" : "items-start"
    )}>
      {/* Display uploaded images if any */}
      {message.images && message.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 max-w-[85%] sm:max-w-[75%]">
          {message.images.map((image) => (
            <div
              key={image.id}
              className="relative"
              role="button"
              tabIndex={0}
              onClick={() => handleImageClick(image.url)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleImageClick(image.url)
                }
              }}
            >
              <img
                src={image.url || "/placeholder.svg"}
                alt="Uploaded"
                className="max-w-[160px] max-h-[160px] object-cover rounded-2xl border border-border cursor-pointer hover:opacity-90 transition-opacity shadow-sm"
              />
            </div>
          ))}
        </div>
      )}

      {/* Show thinking display for AI messages */}
      {message.type === "system" && message.thinking && (
        <div className="mb-2 max-w-[85%] sm:max-w-[75%]">
          <ThinkingDisplay
            content={message.thinking}
            isStreaming={!message.thinkingComplete}
            isExpanded={false}
          />
        </div>
      )}

      {/* Show tool calls for AI messages */}
      {message.type === "system" && message.toolCalls && message.toolCalls.length > 0 && (
        <div className="mb-2 max-w-[85%] sm:max-w-[75%]">
          <ToolCallDisplay toolCalls={message.toolCalls} />
        </div>
      )}

      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%] px-4 py-3 rounded-2xl prose prose-sm dark:prose-invert",
          message.type === "user" 
            ? "bg-primary text-primary-foreground rounded-tr-sm shadow-sm" 
            : "bg-card border border-border text-foreground rounded-tl-sm shadow-sm",
        )}
      >
        {/* For user messages, render plain text */}
        {message.type === "user" && message.content && (
          <div className="whitespace-pre-wrap text-[15px] leading-relaxed">{message.content}</div>
        )}

        {/* For system messages, use Streamdown for markdown rendering */}
        {message.type === "system" && (
          <div className="text-[15px] leading-relaxed">
            {/* For completed messages, render full content */}
            {message.content && message.id !== streamingMessageId && (
              <Streamdown>{message.content}</Streamdown>
            )}

            {/* For streaming messages, combine content and streaming words */}
            {message.id === streamingMessageId && (
              <Streamdown>
                {message.content + streamingWords.map((word) => word.text).join("")}
              </Streamdown>
            )}
          </div>
        )}
      </div>

      {/* Message actions */}
      {message.type === "system" && message.completed && (
        <div className="flex items-center gap-1 mt-1.5 opacity-0 hover:opacity-100 transition-opacity">
          <button 
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Regenerate"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Copy"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Share"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Like"
          >
            <ThumbsUp className="h-3.5 w-3.5" />
          </button>
          <button 
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
            aria-label="Dislike"
          >
            <ThumbsDown className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Image Viewer */}
      {selectedImage && (
        <ImageViewer imageUrl={selectedImage} isOpen={viewerOpen} onClose={() => setViewerOpen(false)} />
      )}
    </div>
  )
}
