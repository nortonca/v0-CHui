'use client';

import { useCallback } from "react"
import type { Message, StreamingWord, ToolCall } from "../types"
import { getAIResponse } from "../utils"

/**
 * Hook for handling text streaming simulation
 * Splits AI responses into word chunks and streams them with animation
 */
export function useChatStreaming(
  onStreamStart: (messageId: string, thinking: string, toolCalls: ToolCall[]) => void,
  onThinkingComplete: (messageId: string, toolCalls: ToolCall[]) => void,
  onStreamEnd: (messageId: string, finalContent: string) => void,
  setStreamingWords: (words: StreamingWord[]) => void,
  setIsStreaming: (streaming: boolean) => void
) {
  const simulateTextStreaming = useCallback(
    async (text: string, messageId: string) => {
      const words = text.split(" ")
      let currentIndex = 0
      setStreamingWords([])
      setIsStreaming(true)

      return new Promise<void>((resolve) => {
        const streamInterval = setInterval(() => {
          if (currentIndex < words.length) {
            const nextIndex = Math.min(currentIndex + 2, words.length)
            const newWords = words.slice(currentIndex, nextIndex)

            setStreamingWords((prev) => [
              ...prev,
              {
                id: Date.now() + currentIndex,
                text: newWords.join(" ") + " ",
              },
            ])

            currentIndex = nextIndex
          } else {
            clearInterval(streamInterval)
            resolve()
          }
        }, 40)
      })
    },
    [setStreamingWords, setIsStreaming]
  )

  const generateAIResponse = useCallback(
    async (userMessage: string, shouldAddNewSection: boolean = false) => {
      const response = getAIResponse(userMessage)

      // Demo thinking content
      const thinkingContent = `Let me analyze this request carefully. The user is asking about "${userMessage}". I should consider multiple perspectives and provide a comprehensive response. First, I'll break down the key components of the question, then explore relevant context and connections. This will help me formulate a well-structured and informative answer.`

      // Demo tool calls
      const demoToolCalls: ToolCall[] = [
        {
          id: `tool-${Date.now()}-1`,
          name: "Web Search",
          status: "running",
          input: userMessage,
        },
        {
          id: `tool-${Date.now()}-2`,
          name: "Knowledge Base Query",
          status: "completed",
          input: `Query: ${userMessage.substring(0, 50)}...`,
          output: "Found relevant information in the knowledge base. Retrieved 3 documents with high relevance scores.",
        },
      ]

      // Create a new message with thinking and tool calls
      const messageId = Date.now().toString()
      onStreamStart(messageId, thinkingContent, demoToolCalls)

      // Vibration feedback
      navigator.vibrate(50)

      // Simulate thinking completion
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Update tool calls status
      const updatedToolCalls = demoToolCalls.map((tool) =>
        tool.status === "running"
          ? {
              ...tool,
              status: "completed" as const,
              output: "Search completed successfully. Found relevant results.",
            }
          : tool
      )

      onThinkingComplete(messageId, updatedToolCalls)

      // Stream the text
      await simulateTextStreaming(response, messageId)

      // Complete streaming
      onStreamEnd(messageId, response)

      // Vibration feedback
      navigator.vibrate(50)
    },
    [simulateTextStreaming, onStreamStart, onThinkingComplete, onStreamEnd]
  )

  return {
    simulateTextStreaming,
    generateAIResponse,
  }
}
