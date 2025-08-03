/**
 * Context Updated Event
 * Emitted when conversation context is updated
 */

export interface ContextUpdatedEvent {
  conversationId: string;
  contextSize: number;
  contextTokens: number;
  timestamp: Date;
  strategy: string;
}
