/**
 * Message sent event
 */

export interface MessageSentEvent {
  readonly type: 'message-sent';
  readonly messageId: string;
  readonly conversationId: string;
  readonly role: 'user' | 'assistant' | 'system';
  readonly content: string;
  readonly timestamp: Date;
  readonly metadata: {
    readonly tokenCount: number;
    readonly hasImages: boolean;
    readonly imageCount: number;
    readonly model?: string;
  };
}

export function createMessageSentEvent(
  messageId: string,
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  tokenCount: number,
  imageCount = 0,
  model?: string
): MessageSentEvent {
  return {
    type: 'message-sent',
    messageId,
    conversationId,
    role,
    content,
    timestamp: new Date(),
    metadata: {
      tokenCount,
      hasImages: imageCount > 0,
      imageCount,
      model
    }
  };
}
