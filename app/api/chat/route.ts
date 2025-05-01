import { type NextRequest, NextResponse } from "next/server"
import { genAI, getModel } from "@/lib/genai"
import { StreamingTextResponse } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { messages, useSearch, useThinking } = await req.json()

    // Get the appropriate model configuration
    const { model, config } = getModel(useSearch)

    // Format messages for the Google GenAI API
    const formattedMessages = messages.map((message: any) => ({
      role: message.role === "user" ? "user" : "model",
      parts: [{ text: message.content }],
    }))

    // Get the last user message
    const userMessage = messages[messages.length - 1].content

    // Create a stream from the Google GenAI API
    const response = await genAI.models.generateContentStream({
      model,
      config,
      contents: formattedMessages,
    })

    // Create a TransformStream to process the response
    const encoder = new TextEncoder()

    let isFirstChunk = true
    let thinkingText = ""

    // Create a ReadableStream from the Google GenAI response
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Process each chunk from the Google GenAI API
          for await (const chunk of response) {
            // If this is the first chunk and thinking is enabled, we might want to show the thinking
            if (isFirstChunk && useThinking && chunk.text) {
              isFirstChunk = false
              thinkingText = chunk.text

              // Send thinking text as a special message
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ thinking: thinkingText })}\n\n`))
              continue
            }

            // Regular text chunk
            if (chunk.text) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.text })}\n\n`))
            }
          }

          // End the stream
          controller.enqueue(encoder.encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("Error in stream processing:", error)
          controller.error(error)
        }
      },
    })

    // Return the streaming response
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
