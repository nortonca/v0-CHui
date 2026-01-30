// Mock AI response generator with markdown formatting
export const getAIResponse = (userMessage: string) => {
  const responses = [
    `That's an interesting perspective on **${userMessage}**. Let me elaborate on that a bit further.

## Key Considerations

When we consider the implications of what you've shared, several key points come to mind:

1. **Context Understanding** - It's important to understand the context and how it relates to broader concepts
2. **Comprehensive Analysis** - This allows us to develop a more thorough understanding
3. **Deeper Exploration** - We can examine specific aspects in greater detail

> "The best way to understand something is to break it down into its fundamental components."

Here's a simple example in code:

\`\`\`javascript
function analyze(input) {
  return input.split(' ').map(word => word.toLowerCase());
}
\`\`\`

Would you like me to explore any specific aspect of this in more detail?`,

    `I appreciate you sharing that about **${userMessage}**. From what I understand, there are multiple layers to consider here.

### Primary Aspects

- The initial aspect relates to the fundamental principles we're discussing
- There's also a broader context to consider
- Similar scenarios reveal interesting \`patterns\` and \`connections\`

This reminds me of similar scenarios where the underlying patterns reveal interesting connections. The key is to understand how these elements interact:

| Element | Impact | Importance |
|---------|--------|------------|
| Context | High | Critical |
| Analysis | Medium | Important |
| Synthesis | High | Very Important |

What aspects of this would you like to explore further?`,

    `Thank you for bringing this up regarding **${userMessage}**. It's a fascinating topic that deserves careful consideration.

When we analyze the details you've provided, we can identify several important elements:

- **Primary factors** that directly influence the outcome
- **Secondary considerations** that provide additional context
- **Tertiary elements** that round out our understanding

> Important: This kind of discussion often leads to valuable insights and new perspectives.

You might find it helpful to think of it this way:

\`\`\`python
def process_insight(data):
    insights = []
    for item in data:
        if item.relevance > 0.7:
            insights.append(item)
    return insights
\`\`\`

Is there a particular element you'd like me to focus on?`,

    `Your message raises some compelling points about **${userMessage}**. Let's break this down systematically.

## Analysis Framework

There are several key factors to consider, each contributing to the overall picture:

1. **Initial Assessment**
   - Identify core components
   - Understand relationships
   - Map dependencies

2. **Deep Dive**
   - Examine each component in detail
   - Look for patterns and anomalies
   - Consider edge cases

3. **Synthesis**
   - Integrate findings
   - Draw conclusions
   - Identify next steps

---

This kind of analysis often reveals interesting patterns and connections that might not be immediately apparent. For instance, consider how \`componentA\` interacts with \`componentB\` to produce emergent behavior.

What specific aspects would you like to delve into?`,
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
