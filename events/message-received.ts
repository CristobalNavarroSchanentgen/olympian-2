/**
 * Message Received Event
 * Emitted when a message is received from AI
 */

export interface MessageReceivedEvent {
  messageId: string;
  conversationId: string;
  content: string;
  timestamp: Date;
  modelUsed: string;
  tokenCount?: number;
  processingTime?: number;
}
