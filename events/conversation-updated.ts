/**
 * Conversation Updated Event
 * Emitted when a conversation is updated
 */

export interface ConversationUpdatedEvent {
  conversationId: string;
  title?: string;
  timestamp: Date;
  changes: {
    title?: boolean;
    lastActivity?: boolean;
    messageCount?: boolean;
  };
}
