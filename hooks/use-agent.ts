"use client"

import { useState, useCallback, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import type { Message } from "@/components/chat/types"

interface UseAgentOptions {
  onMessageStart?: () => void
  onMessageComplete?: (text: string) => void
  onError?: (error: Error) => void
}

// Helper to extract text from UIMessage parts
function getUIMessageText(parts: Array<{ type: string; text?: string }> | undefined): string {
  if (!parts || !Array.isArray(parts)) return ""
  return parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text" && typeof p.text === "string")
    .map((p) => p.text)
    .join("")
}

export function useAgent(options: UseAgentOptions = {}) {
  const { onMessageStart, onMessageComplete, onError } = options
  
  // Track our own message history in the app's format
  const [appMessages, setAppMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState("")
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const streamingTextRef = useRef("")

  const { messages: aiMessages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  // Convert AI SDK status to isStreaming
  const aiIsStreaming = status === "streaming" || status === "submitted"

  // Send a message to the agent
  const send = useCallback(async (
    text: string, 
    options?: { 
      images?: Array<{ id: string; url: string; thumbnail?: string }>;
      newSection?: boolean;
    }
  ) => {
    if (!text.trim() && (!options?.images || options.images.length === 0)) return

    // Create user message in app format
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: text,
      type: "user",
      newSection: options?.newSection ?? appMessages.length > 0,
      images: options?.images,
    }

    // Create placeholder for AI response
    const aiMessageId = `ai-${Date.now()}`
    const aiMessage: Message = {
      id: aiMessageId,
      content: "",
      type: "system",
      completed: false,
    }

    // Update app messages
    setAppMessages(prev => [...prev, userMessage, aiMessage])
    setStreamingMessageId(aiMessageId)
    setStreamingContent("")
    streamingTextRef.current = ""
    setIsStreaming(true)
    onMessageStart?.()

    try {
      // Send to AI SDK
      await sendMessage({ text })
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      onError?.(error instanceof Error ? error : new Error("Failed to send message"))
      setIsStreaming(false)
      setStreamingMessageId(null)
    }
  }, [appMessages.length, sendMessage, onMessageStart, onError])

  // Sync AI SDK messages to app messages
  // Watch for changes in aiMessages to update streaming content
  const lastAiMessage = aiMessages[aiMessages.length - 1]
  const lastAiText = lastAiMessage?.role === "assistant" 
    ? getUIMessageText(lastAiMessage.parts as Array<{ type: string; text?: string }>) 
    : ""

  // Update streaming content when AI message changes
  if (lastAiText && lastAiText !== streamingTextRef.current && streamingMessageId) {
    streamingTextRef.current = lastAiText
    setStreamingContent(lastAiText)
    
    // Update the message in appMessages
    setAppMessages(prev => 
      prev.map(msg => 
        msg.id === streamingMessageId 
          ? { ...msg, content: lastAiText }
          : msg
      )
    )
  }

  // Handle completion
  if (!aiIsStreaming && isStreaming && streamingMessageId && lastAiText) {
    setIsStreaming(false)
    setAppMessages(prev => 
      prev.map(msg => 
        msg.id === streamingMessageId 
          ? { ...msg, content: lastAiText, completed: true }
          : msg
      )
    )
    setStreamingMessageId(null)
    onMessageComplete?.(lastAiText)
  }

  // Clear messages
  const clearMessages = useCallback(() => {
    setAppMessages([])
    setStreamingContent("")
    setStreamingMessageId(null)
    setIsStreaming(false)
  }, [])

  return {
    messages: appMessages,
    setMessages: setAppMessages,
    isStreaming,
    streamingContent,
    streamingMessageId,
    send,
    clearMessages,
    status,
  }
}
