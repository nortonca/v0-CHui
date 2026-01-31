import { fireworks } from '@ai-sdk/fireworks';
import { streamText } from 'ai';

export const runtime = 'edge';

/**
 * Chat API endpoint
 * 
 * Handles streaming chat completions using Fireworks AI (Kimi 2.5).
 * This endpoint:
 * - Accepts messages from the UI
 * - Streams responses back in real-time
 * - Maintains conversation context
 */
export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    console.log('[v0] Chat API: Received', messages?.length || 0, 'messages');

    // Validate messages
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Stream response using the agent (don't await streamText)
    const result = streamText({
      model: fireworks('accounts/fireworks/models/kimi-k2p5'),
      messages,
      system: `You are a helpful, professional AI assistant integrated into a modern chat application.

Core Characteristics:
- Professional yet approachable tone
- Concise but thorough responses
- Technically competent across general topics
- Honest about limitations

Boundaries:
- You are currently a conversational assistant
- You do not yet have access to tools, memory persistence, or external data
- If asked about capabilities you don't have, politely explain and offer to help in other ways
- Never hallucinate features or abilities

Communication Style:
- Be direct and clear
- Use markdown formatting for better readability
- Structure complex responses with headers and lists
- Keep initial responses focused, offer to elaborate if needed

Your goal is to be genuinely helpful while maintaining clarity about your current capabilities.`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('[v0] Chat API error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
