import { GoogleGenAI } from "@google/genai"

// Initialize the Google GenAI client
export const genAI = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY || "",
})

// Get the model
export const getModel = (useSearch = false) => {
  // Use the model specified in the example
  const model = "gemini-2.5-flash-preview-04-17"

  // Configure tools based on whether search is enabled
  const tools = useSearch ? [{ googleSearch: {} }] : []

  const config = {
    tools,
    responseMimeType: "text/plain",
  }

  return { model, config }
}

// Helper function to determine if we should show thinking
export const shouldShowThinking = (thinking: boolean) => {
  return thinking
}
