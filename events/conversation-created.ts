/**
 * Conversation Created Event
 * Emitted when a new conversation is created
 */

export interface ConversationCreatedEvent {
  conversationId: string;
  title?: string;
  timestamp: Date;
  userId?: string;
  initialModel?: string;
}
