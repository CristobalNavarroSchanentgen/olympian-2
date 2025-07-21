/**
 * Context management utility - pure functions
 */

import { ContextMessage, ContextWindow, ContextStats } from '../models/chat/memory-context.js';

export interface ContextResult {
  readonly messages: ContextMessage[];
  readonly stats: ContextStats;
  readonly truncated: boolean;
}

/**
 * Build context window from messages
 */
export function buildContext(
  messages: ContextMessage[],
  window: ContextWindow
): ContextResult {
  const sorted = [...messages].sort((a, b) => {
    if (a.priority !== b.priority) {
      return getPriorityWeight(a.priority) - getPriorityWeight(b.priority);
    }
    return 0; // Maintain original order for same priority
  });
  
  const selected: ContextMessage[] = [];
  let totalTokens = 0;
  let totalMessages = 0;
  
  for (const message of sorted) {
    if (selected.length >= window.maxMessages) break;
    if (totalTokens + message.tokenCount > window.maxTokens - window.reservedTokens) break;
    
    selected.push(message);
    totalTokens += message.tokenCount;
    totalMessages++;
  }
  
  const stats: ContextStats = {
    totalMessages: messages.length,
    includedMessages: totalMessages,
    totalTokens: messages.reduce((sum, m) => sum + m.tokenCount, 0),
    usedTokens: totalTokens,
    availableTokens: window.maxTokens - totalTokens - window.reservedTokens
  };
  
  return {
    messages: selected,
    stats,
    truncated: totalMessages < messages.length
  };
}

/**
 * Calculate optimal context window
 */
export function calculateOptimalWindow(
  messageCount: number,
  averageTokensPerMessage: number,
  maxTokens: number
): ContextWindow {
  const reservedTokens = Math.min(1000, Math.floor(maxTokens * 0.1));
  const availableTokens = maxTokens - reservedTokens;
  
  const maxMessagesByTokens = Math.floor(availableTokens / averageTokensPerMessage);
  const maxMessages = Math.min(maxMessagesByTokens, 50); // Hard limit
  
  return {
    maxTokens,
    maxMessages,
    reservedTokens
  };
}

/**
 * Prioritize messages for context inclusion
 */
export function prioritizeMessages(
  messages: ContextMessage[],
  systemMessages: ContextMessage[] = []
): ContextMessage[] {
  const prioritized = [
    ...systemMessages.map(m => ({ ...m, priority: 'system' as const })),
    ...messages
  ];
  
  return prioritized.sort((a, b) => {
    const weightA = getPriorityWeight(a.priority);
    const weightB = getPriorityWeight(b.priority);
    return weightA - weightB;
  });
}

/**
 * Remove oldest messages to fit budget
 */
export function trimToTokenBudget(
  messages: ContextMessage[],
  tokenBudget: number
): ContextMessage[] {
  const systemMessages = messages.filter(m => m.priority === 'system');
  const otherMessages = messages.filter(m => m.priority !== 'system');
  
  let totalTokens = systemMessages.reduce((sum, m) => sum + m.tokenCount, 0);
  const result = [...systemMessages];
  
  // Add other messages from most recent
  for (let i = otherMessages.length - 1; i >= 0; i--) {
    const message = otherMessages[i];
    if (totalTokens + message.tokenCount <= tokenBudget) {
      result.push(message);
      totalTokens += message.tokenCount;
    }
  }
  
  return result;
}

function getPriorityWeight(priority: string): number {
  switch (priority) {
    case 'system': return 0;
    case 'high': return 1;
    case 'medium': return 2;
    case 'low': return 3;
    default: return 2;
  }
}
