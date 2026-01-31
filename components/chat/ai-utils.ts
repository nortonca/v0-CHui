/**
 * Real AI response utilities using the Fireworks agent
 * 
 * These functions replace the mock getAIResponse and provide
 * real streaming AI responses from the agent API.
 */

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

/**
 * Stream AI response from the agent
 * Yields chunks of text as they arrive
 */
export async function* streamAIResponse(
  messages: ChatMessage[]
): AsyncGenerator<string, void, unknown> {
  console.log('[v0] Streaming AI response for', messages.length, 'messages');

  try {
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

      // AI SDK v6 toTextStreamResponse() returns plain text chunks
      // No special formatting, just decode and yield
      const chunk = decoder.decode(value, { stream: true });
      if (chunk) {
        yield chunk;
      }
    }
  } catch (error) {
    console.error('[v0] AI streaming error:', error);
    throw error;
  }
}

/**
 * Get complete AI response (non-streaming)
 * Backwards compatible with existing mock function signature
 */
export async function getAIResponse(userMessage: string): Promise<string> {
  console.log('[v0] Getting AI response for:', userMessage);

  const messages: ChatMessage[] = [
    { role: 'user', content: userMessage },
  ];

  let fullResponse = '';
  
  try {
    for await (const chunk of streamAIResponse(messages)) {
      fullResponse += chunk;
    }
    return fullResponse;
  } catch (error) {
    console.error('[v0] AI response error:', error);
    return 'I apologize, but I encountered an error processing your request. Please try again.';
  }
}
