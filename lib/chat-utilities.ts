/**
 * Shared utility functions for chat operations
 */

import type { Message, ToolCall } from "@/components/chat/types"

/**
 * Format message content with proper markdown handling
 */
export function formatMessageContent(content: string): string {
  return content.trim()
}

/**
 * Create a demo thinking message
 */
export function createThinkingContent(userMessage: string): string {
  return `Let me analyze this request carefully. The user is asking about "${userMessage}". I should consider multiple perspectives and provide a comprehensive response. First, I'll break down the key components of the question, then explore relevant context and connections. This will help me formulate a well-structured and informative answer.`
}

/**
 * Create demo tool calls for simulation
 */
export function createDemoToolCalls(userMessage: string): ToolCall[] {
  return [
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
}

/**
 * Update tool call status
 */
export function updateToolCallStatus(
  toolCalls: ToolCall[],
  toolId: string,
  status: "running" | "completed" | "error",
  output?: string
): ToolCall[] {
  return toolCalls.map((tool) =>
    tool.id === toolId
      ? {
          ...tool,
          status,
          output: output || tool.output,
        }
      : tool
  )
}

/**
 * Validate message content
 */
export function isValidMessage(content: string, imageCount: number = 0): boolean {
  return content.trim().length > 0 || imageCount > 0
}

/**
 * Split text into words for streaming
 */
export function splitTextForStreaming(text: string, wordsPerChunk: number = 2): string[] {
  const words = text.split(" ")
  const chunks: string[] = []

  for (let i = 0; i < words.length; i += wordsPerChunk) {
    const chunk = words.slice(i, i + wordsPerChunk).join(" ")
    chunks.push(chunk)
  }

  return chunks
}

/**
 * Generate unique message ID
 */
export function generateMessageId(type: "user" | "system"): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Extract text content from message (handles markdown)
 */
export function extractTextContent(content: string): string {
  // Remove markdown syntax for plain text extraction
  return content
    .replace(/\*\*(.*?)\*\*/g, "$1") // Bold
    .replace(/\*(.*?)\*/g, "$1") // Italic
    .replace(/`(.*?)`/g, "$1") // Inline code
    .replace(/\[(.*?)\]\((.*?)\)/g, "$1") // Links
    .replace(/^#+\s+/gm, "") // Headers
}

/**
 * Calculate reading time in seconds
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  return Math.ceil((wordCount / wordsPerMinute) * 60)
}
