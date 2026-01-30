import { ToolLoopAgent, tool, stepCountIs } from "ai"
import { fireworks } from "@ai-sdk/fireworks"
import { z } from "zod"

// Kimi K2.5 on Fireworks - Moonshot AI's flagship agentic model
// Supports: vision, thinking modes, function calling, 256k context
const kimiModel = fireworks("accounts/fireworks/models/kimi-k2p5")

export const chatAgent = new ToolLoopAgent({
  model: kimiModel,
  instructions: `You are a helpful, intelligent assistant powered by Kimi K2.5.

Your personality:
- Friendly and conversational, but precise when needed
- You think through complex problems step by step
- You ask clarifying questions when the request is ambiguous
- You provide concise responses by default, but can elaborate when asked

Your capabilities:
- General conversation and Q&A
- Analysis and reasoning
- Creative writing and brainstorming
- Code explanation and generation
- Math and logical problem solving

Guidelines:
- Be direct and helpful
- Format responses with markdown when appropriate (headers, lists, code blocks)
- If you're unsure about something, say so
- Keep responses focused and avoid unnecessary verbosity`,

  tools: {
    // Simple tool to get current date/time
    getCurrentDateTime: tool({
      description: "Get the current date and time",
      inputSchema: z.object({}),
      execute: async () => {
        const now = new Date()
        return {
          date: now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          time: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
          }),
          timestamp: now.toISOString(),
        }
      },
    }),

    // Tool to perform basic calculations
    calculate: tool({
      description: "Perform a mathematical calculation",
      inputSchema: z.object({
        expression: z.string().describe("The mathematical expression to evaluate (e.g., '2 + 2', '10 * 5')"),
      }),
      execute: async ({ expression }) => {
        try {
          // Safe evaluation using Function constructor (limited to math)
          const sanitized = expression.replace(/[^0-9+\-*/().%\s]/g, "")
          if (sanitized !== expression) {
            return { error: "Invalid characters in expression", result: null }
          }
          // biome-ignore lint/security/noGlobalEval: safe math only
          const result = Function(`"use strict"; return (${sanitized})`)()
          return { expression, result, error: null }
        } catch {
          return { expression, result: null, error: "Could not evaluate expression" }
        }
      },
    }),

    // Tool to generate a random number
    randomNumber: tool({
      description: "Generate a random number between min and max (inclusive)",
      inputSchema: z.object({
        min: z.number().describe("Minimum value"),
        max: z.number().describe("Maximum value"),
      }),
      execute: async ({ min, max }) => {
        const result = Math.floor(Math.random() * (max - min + 1)) + min
        return { min, max, result }
      },
    }),
  },

  // Allow up to 5 tool calls per response
  stopWhen: stepCountIs(5),
})
