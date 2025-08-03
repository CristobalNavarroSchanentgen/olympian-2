/**
 * Memory management service contract
 */

import { MemoryContext, ContextWindow, ContextStats } from '../models/chat/memory-context';

export interface MemoryService {
  /**
   * Get memory context for conversation
   */
  getMemoryContext(conversationId: string): Promise<MemoryContext | null>;

  /**
   * Update memory context
   */
  updateMemoryContext(
    conversationId: string,
    context: Partial<MemoryContext>
  ): Promise<MemoryContext>;

  /**
   * Clean memory for conversation
   */
  cleanMemory(
    conversationId: string,
    reason?: 'token_limit' | 'message_limit' | 'manual'
  ): Promise<{
    messagesRemoved: number;
    tokensFreed: number;
  }>;

  /**
   * Get memory statistics
   */
  getMemoryStats(conversationId: string): Promise<ContextStats>;

  /**
   * Check if memory needs cleanup
   */
  needsCleanup(conversationId: string): Promise<boolean>;

  /**
   * Get optimal context window
   */
  getOptimalContextWindow(
    conversationId: string,
    maxTokens: number
  ): Promise<ContextWindow>;

  /**
   * Set memory configuration
   */
  setMemoryConfig(
    conversationId: string,
    config: {
      maxMessages: number;
      maxTokens: number;
      autoCleanup: boolean;
    }
  ): Promise<boolean>;

  /**
   * Get memory configuration
   */
  getMemoryConfig(conversationId: string): Promise<{
    maxMessages: number;
    maxTokens: number;
    autoCleanup: boolean;
  } | null>;
}
