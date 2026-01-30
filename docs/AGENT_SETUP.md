# Base Agent Setup

This document describes the base conversational agent implementation using AI SDK v6 and Fireworks AI (Kimi 2.5).

## Overview

The base agent provides foundational conversational capabilities:
- Real-time streaming responses
- Conversation context management
- Professional, helpful tone
- Production-ready architecture
- Extensible design for future tools and features

## Architecture

### Core Components

1. **Base Agent** (`/lib/agent/base-agent.ts`)
   - Configured with Fireworks AI + Kimi 2.5 model
   - System instructions defining personality and capabilities
   - No tools yet - pure conversational agent
   - Ready for future expansion

2. **API Route** (`/app/api/chat/route.ts`)
   - Edge runtime for low latency
   - Streams responses from the agent
   - Handles errors gracefully
   - Maintains conversation context within requests

3. **AI Utilities** (`/components/chat/ai-utils.ts`)
   - Streaming helpers
   - Message format conversion
   - Error handling
   - Backwards compatibility with existing UI

4. **Chat Interface** (`/components/chat/chat-interface.tsx`)
   - Integrated with real agent API
   - Preserves existing UI/UX
   - Handles streaming display
   - Maintains conversation history

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
# or
yarn install
```

The following packages are already added to `package.json`:
- `ai@^6.0.0` - AI SDK v6
- `@ai-sdk/fireworks@^1.0.0` - Fireworks provider

### 2. Configure Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Fireworks API key from [fireworks.ai](https://fireworks.ai/)

3. Add it to `.env.local`:
   ```
   FIREWORKS_API_KEY=your_actual_api_key_here
   ```

### 3. Start Development Server

```bash
npm run dev
```

The agent is now live at `http://localhost:3000`

## Usage

### Talking to the Agent

1. Open the app in your browser
2. Type a message in the chat input
3. The agent will stream its response in real-time
4. Conversation context is maintained automatically

### What the Agent Can Do

The base agent is a conversational assistant that:
- Answers questions across general topics
- Provides clear, well-structured responses
- Uses markdown formatting for readability
- Maintains context within conversations
- Admits limitations honestly

### What It Can't Do (Yet)

The agent currently does NOT have:
- Long-term memory persistence
- External tool access (web search, code execution, etc.)
- File/image processing capabilities
- RAG or knowledge base integration

These capabilities will be added in future iterations.

## Agent Behavior

### System Instructions

The agent follows these core principles:
- Professional yet approachable tone
- Concise but thorough responses
- Technical competence
- Honesty about limitations
- Structured formatting with markdown

### Response Style

- Direct and clear communication
- Headers and lists for complex topics
- Code blocks where relevant
- Offers to elaborate when appropriate

## Technical Details

### Model Configuration

- **Provider**: Fireworks AI
- **Model**: `accounts/fireworks/models/kimi-k2p5` (Kimi 2.5)
- **Context**: 256k tokens
- **Function Calling**: Supported (not yet used)
- **Image Input**: Supported (not yet used)

### Streaming Implementation

The agent uses Server-Sent Events (SSE) for streaming:
1. Client sends message to `/api/chat`
2. API creates streaming response via agent
3. Chunks stream back to client
4. UI updates in real-time

### Error Handling

- Network errors: Graceful fallback messages
- API errors: Logged and user-friendly error shown
- Streaming interruptions: Partial responses preserved

## Future Expansion

This base agent is designed to be extended with:

### Phase 2: Tools
- Web search
- Code execution
- Document analysis
- Calculator

### Phase 3: Memory
- Long-term memory persistence
- User preferences
- Conversation summaries
- Context management

### Phase 4: Advanced Features
- RAG with knowledge bases
- Multi-agent workflows
- Custom skills and plugins
- Fine-tuned models

## Development Guidelines

### Adding New Capabilities

When extending the agent:
1. Keep the base agent simple
2. Add tools via the `tools` configuration
3. Update system instructions as needed
4. Test streaming behavior thoroughly
5. Document new capabilities

### Code Organization

```
/lib/agent/           # Agent definitions
/app/api/chat/        # API routes
/components/chat/     # UI components
/hooks/              # Custom React hooks
/docs/               # Documentation
```

### Best Practices

- Keep system instructions clear and concise
- Test with various conversation lengths
- Handle errors gracefully
- Log important events for debugging
- Maintain backwards compatibility

## Troubleshooting

### Agent not responding
- Check API key in `.env.local`
- Verify Fireworks AI service status
- Check browser console for errors
- Check server logs for API errors

### Slow responses
- Check network connection
- Verify edge runtime is enabled
- Consider using a different model

### Streaming issues
- Check browser supports EventSource
- Verify SSE endpoint is accessible
- Check for proxy/firewall issues

## Resources

- [AI SDK v6 Documentation](https://sdk.vercel.ai/)
- [Fireworks AI Documentation](https://docs.fireworks.ai/)
- [Kimi 2.5 Model Details](https://fireworks.ai/models)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes)

## Support

For issues or questions:
1. Check this documentation
2. Review AI SDK examples
3. Check Fireworks AI status
4. Review server/browser logs
