/**
 * Context Manager Utility
 * Pure functions for managing conversation context
 */

import type { Message } from '../models/chat/message';
import type { MemoryContext } from '../models/chat/memory-context';

export interface ContextWindow {
  maxTokens: number;
  reservedSystemTokens: number;
  reservedResponseTokens: number;
  availableForHistory: number;
}

export interface OptimizationStrategy {
  prioritizeRecent: boolean;
  keepSystemMessages: boolean;
  summarizeOld: boolean;
  maxMessages: number;
}

export function calculateContextWindow(
  maxTokens: number = 4096,
  systemTokens: number = 100,
  responseTokens: number = 500
): ContextWindow {
  return {
    maxTokens,
    reservedSystemTokens: systemTokens,
    reservedResponseTokens: responseTokens,
    availableForHistory: maxTokens - systemTokens - responseTokens
  };
}

export function optimizeMessageHistory(
  messages: Message[],
  availableTokens: number,
  strategy: OptimizationStrategy
): Message[] {
  if (messages.length === 0) return [];

  // Keep system messages if strategy says so
  const systemMessages = strategy.keepSystemMessages 
    ? messages.filter(m => m.role === 'system')
    : [];

  const nonSystemMessages = messages.filter(m => m.role !== 'system');

  // Sort by most recent first if prioritizing recent
  const sortedMessages = strategy.prioritizeRecent
    ? nonSystemMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : nonSystemMessages;

  // Take messages until we hit token limit or max messages
  const selectedMessages: Message[] = [];
  let usedTokens = 0;

  for (const message of sortedMessages) {
    const messageTokens = estimateMessageTokens(message);
    
    if (usedTokens + messageTokens > availableTokens) break;
    if (selectedMessages.length >= strategy.maxMessages) break;
    
    selectedMessages.push(message);
    usedTokens += messageTokens;
  }

  // Restore original order
  const finalMessages = strategy.prioritizeRecent
    ? selectedMessages.reverse()
    : selectedMessages;

  return [...systemMessages, ...finalMessages];
}

export function createMemoryContext(
  conversationId: string,
  tokenBudget: number,
  usedTokens: number = 0
): MemoryContext {
  return {
    conversationId,
    tokenBudget,
    usedTokens,
    availableTokens: tokenBudget - usedTokens,
    priority: 1,
    lastUpdated: new Date(),
    metadata: {}
  };
}

function estimateMessageTokens(message: Message): number {
  const contentTokens = Math.ceil((message.content || '').length / 4);
  const imageTokens = (message.images?.length || 0) * 765;
  return contentTokens + imageTokens + 10; // +10 for formatting
}
