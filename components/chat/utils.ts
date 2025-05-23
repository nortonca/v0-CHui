// Mock AI response generator
export const getAIResponse = (userMessage: string) => {
  const responses = [
    `That's an interesting perspective. Let me elaborate on that a bit further. When we consider the implications of what you've shared, several key points come to mind. First, it's important to understand the context and how it relates to broader concepts. This allows us to develop a more comprehensive understanding of the situation. Would you like me to explore any specific aspect of this in more detail?`,

    `I appreciate you sharing that. From what I understand, there are multiple layers to consider here. The initial aspect relates to the fundamental principles we're discussing, but there's also a broader context to consider. This reminds me of similar scenarios where the underlying patterns reveal interesting connections. What aspects of this would you like to explore further?`,

    `Thank you for bringing this up. It's a fascinating topic that deserves careful consideration. When we analyze the details you've provided, we can identify several important elements that contribute to our understanding. This kind of discussion often leads to valuable insights and new perspectives. Is there a particular element you'd like me to focus on?`,

    `Your message raises some compelling points. Let's break this down systematically to better understand the various components involved. There are several key factors to consider, each contributing to the overall picture in unique ways. This kind of analysis often reveals interesting patterns and connections that might not be immediately apparent. What specific aspects would you like to delve into?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

const TOP_PADDING = 20
const BOTTOM_PADDING = 20
const ADDITIONAL_OFFSET = 60

// Calculate available content height
export const getContentHeight = (viewportHeight: number) => {
  return viewportHeight - TOP_PADDING - BOTTOM_PADDING - ADDITIONAL_OFFSET
}
