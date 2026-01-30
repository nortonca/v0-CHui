'use client';

import { useChat } from 'ai/react';
import { useState, useEffect } from 'react';

/**
 * Custom hook that wraps AI SDK's useChat and adapts it to our existing chat interface
 * 
 * This bridges the gap between the new agent-based streaming and the existing
 * UI message format. It handles streaming, message conversion, and state management.
 */
export function useAgentChat() {
  const {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    isLoading,
    error,
  } = useChat({
    api: '/api/chat',
    onError: (error) => {
      console.error('[v0] Chat error:', error);
    },
  });

  const [currentStreamingContent, setCurrentStreamingContent] = useState('');

  // Track the last message content to detect streaming
  useEffect(() => {
    if (aiMessages.length > 0) {
      const lastMessage = aiMessages[aiMessages.length - 1];
      if (lastMessage.role === 'assistant' && isLoading) {
        setCurrentStreamingContent(lastMessage.content);
      } else if (!isLoading) {
        setCurrentStreamingContent('');
      }
    }
  }, [aiMessages, isLoading]);

  return {
    messages: aiMessages,
    input,
    handleInputChange,
    handleSubmit: aiHandleSubmit,
    isStreaming: isLoading,
    error,
    currentStreamingContent,
  };
}
