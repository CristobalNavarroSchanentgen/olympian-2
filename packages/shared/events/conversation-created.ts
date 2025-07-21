/**
 * Conversation created event
 */

export interface ConversationCreatedEvent {
  readonly type: 'conversation-created';
  readonly conversationId: string;
  readonly title: string;
  readonly model: string;
  readonly timestamp: Date;
  readonly metadata: {
    readonly initiatedBy: 'user' | 'system';
    readonly memorySettings: {
      readonly maxMessages: number;
      readonly maxTokens: number;
    };
  };
}

export function createConversationCreatedEvent(
  conversationId: string,
  title: string,
  model: string,
  initiatedBy: 'user' | 'system' = 'user',
  memorySettings = { maxMessages: 20, maxTokens: 4000 }
): ConversationCreatedEvent {
  return {
    type: 'conversation-created',
    conversationId,
    title,
    model,
    timestamp: new Date(),
    metadata: {
      initiatedBy,
      memorySettings
    }
  };
}
