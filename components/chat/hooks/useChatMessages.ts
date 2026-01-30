'use client';

import { useState, useRef, useCallback } from "react"
import type { Message, StreamingWord, ToolCall } from "../types"
import { getAIResponse } from "../utils"

/**
 * Hook for managing chat messages and streaming state
 * Handles message creation, updates, and completion tracking
 */
export function useChatMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [streamingWords, setStreamingWords] = useState<StreamingWord[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [completedMessages, setCompletedMessages] = useState<Set<string>>(new Set())

  const addUserMessage = useCallback((content: string, images?: any[], newSection?: boolean) => {
    const newMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      type: "user",
      newSection,
      images: images && images.length > 0 ? images : undefined,
    }
    setMessages((prev) => [...prev, newMessage])
    return newMessage
  }, [])

  const addAIMessage = useCallback((thinking?: string, toolCalls?: ToolCall[]) => {
    const messageId = Date.now().toString()
    const newMessage: Message = {
      id: messageId,
      content: "",
      type: "system",
      thinking,
      thinkingComplete: !thinking,
      toolCalls,
    }
    setMessages((prev) => [...prev, newMessage])
    setStreamingMessageId(messageId)
    return messageId
  }, [])

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, ...updates } : msg))
    )
  }, [])

  const completeStreaming = useCallback((messageId: string, finalContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: finalContent, completed: true } : msg
      )
    )
    setCompletedMessages((prev) => new Set(prev).add(messageId))
    setStreamingWords([])
    setStreamingMessageId(null)
    setIsStreaming(false)
  }, [])

  return {
    messages,
    setMessages,
    streamingMessageId,
    setStreamingMessageId,
    streamingWords,
    setStreamingWords,
    isStreaming,
    setIsStreaming,
    completedMessages,
    setCompletedMessages,
    addUserMessage,
    addAIMessage,
    updateMessage,
    completeStreaming,
  }
}
