/**
 * Conversation Deleted Event
 * Emitted when a conversation is deleted
 */

export interface ConversationDeletedEvent {
  conversationId: string;
  timestamp: Date;
  userId?: string;
  messageCount: number;
}
