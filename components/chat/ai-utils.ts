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
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        
        // AI SDK v6 uses different data stream format
        // Lines are prefixed with data type codes like "0:", "2:", etc.
        try {
          // Handle different line formats
          if (line.startsWith('0:')) {
            // Text delta
            const data = line.slice(2);
            yield data;
          } else if (line.startsWith('2:')) {
            // Additional data (might contain text)
            const jsonStr = line.slice(2);
            const parsed = JSON.parse(jsonStr);
            if (typeof parsed === 'string') {
              yield parsed;
            }
          }
          // Other prefixes (1:, 8:, 9:, etc.) are for metadata, tool calls, etc.
        } catch (e) {
          // Skip malformed lines
          console.warn('[v0] Failed to parse stream line:', line.substring(0, 50));
        }
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
