import { createAgentUIStreamResponse, streamText, stepCountIs } from "ai"
import { fireworks } from "@ai-sdk/fireworks"
import { chatAgent } from "@/lib/agent"

// Fireworks Kimi K2.5 model
const kimiModel = fireworks("accounts/fireworks/models/kimi-k2p5")

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { messages, prompt } = body

    // If using messages array from useChat (UIMessage format)
    if (messages && Array.isArray(messages)) {
      // Use createAgentUIStreamResponse for UIMessage[] from useChat
      // IMPORTANT: Use 'uiMessages' NOT 'messages'
      return createAgentUIStreamResponse({
        agent: chatAgent,
        uiMessages: messages,
      })
    }

    // If using a single prompt (non-chat mode)
    if (prompt) {
      const result = streamText({
        model: kimiModel,
        prompt,
        stopWhen: stepCountIs(5),
      })
      
      return result.toUIMessageStreamResponse()
    }

    return new Response("Missing messages or prompt", { status: 400 })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return new Response(
      JSON.stringify({ 
        error: "Failed to process chat request",
        details: error instanceof Error ? error.message : "Unknown error"
      }), 
      { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
}
