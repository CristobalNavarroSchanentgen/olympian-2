/**
 * Message Sent Event
 * Emitted when a message is sent by the user
 */

export interface MessageSentEvent {
  messageId: string;
  conversationId: string;
  content: string;
  timestamp: Date;
  userId?: string;
  attachments?: string[];
}
