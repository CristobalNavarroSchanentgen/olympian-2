/**
 * Memory Cleaned Event
 * Emitted when conversation memory is cleaned
 */

export interface MemoryCleanedEvent {
  conversationId: string;
  removedMessages: number;
  remainingMessages: number;
  tokensSaved: number;
  timestamp: Date;
  strategy: string;
}
