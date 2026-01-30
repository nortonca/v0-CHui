"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Message } from "./types"
import { RefreshCcw, Copy, Share2, ThumbsUp, ThumbsDown } from "lucide-react"
import type { StreamingWord } from "./types"
import ImageViewer from "./image-viewer"

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
    <div className={cn("flex flex-col", message.type === "user" ? "items-end" : "items-start")}>
      {/* Display uploaded images if any */}
      {message.images && message.images.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 max-w-[80%]">
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
                className="max-w-[150px] max-h-[150px] object-cover rounded-lg border border-border cursor-pointer hover:opacity-90 transition-opacity"
              />
            </div>
          ))}
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] px-4 py-2 rounded-2xl",
          message.type === "user" ? "bg-card border border-border rounded-br-none" : "text-foreground",
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
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <RefreshCcw className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Copy className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsUp className="h-4 w-4" />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ThumbsDown className="h-4 w-4" />
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
