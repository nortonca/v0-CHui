/**
 * AI response utilities using Groq
 * 
 * Provides real streaming AI responses from the chat API.
 */

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

/**
 * Stream AI response from the chat API
 * Yields chunks of text as they arrive
 */
export async function* streamAIResponse(
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  if (!response.body) {
    throw new Error('No response body');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;

    // AI SDK toTextStreamResponse() returns plain text chunks
    const chunk = decoder.decode(value, { stream: true });
    if (chunk) {
      yield chunk;
    }
  }
}

/**
 * Get complete AI response (non-streaming)
 */
export async function getAIResponse(userMessage: string): Promise<string> {
  const messages: ChatMessage[] = [
    { role: 'user', content: userMessage },
  ];

  let fullResponse = '';
  
  for await (const chunk of streamAIResponse(messages)) {
    fullResponse += chunk;
  }
  
  return fullResponse;
}
