/**
 * Conversation Title Generated Event
 */

export interface ConversationTitleGeneratedEvent {
  conversationId: string;
  oldTitle: string;
  newTitle: string;
  confidence: number;
  fallbackUsed: boolean;
  timestamp: Date;
  metadata?: {
    model?: string;
    processingTime?: number;
  };
}
