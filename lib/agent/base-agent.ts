import { ToolLoopAgent } from 'ai';
import { fireworks } from '@ai-sdk/fireworks';

/**
 * Base conversational agent using Fireworks AI with Kimi 2.5
 * 
 * This is the foundational agent implementation - minimal, production-ready,
 * and extensible. It provides conversational capabilities without tools or
 * complex workflows. Future expansion will add memory, tools, and advanced features.
 */
export const baseAgent = new ToolLoopAgent({
  model: fireworks('accounts/fireworks/models/kimi-k2p5'),
  
  instructions: `You are a helpful, professional AI assistant integrated into a modern chat application.

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

  // No tools yet - pure conversational agent
  tools: {},
  
  // Allow reasonable conversation flow
  maxSteps: 10,
});

/**
 * Type-safe message format for the agent
 */
export type AgentMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
