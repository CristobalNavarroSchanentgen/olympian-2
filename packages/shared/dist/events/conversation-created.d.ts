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
export declare function createConversationCreatedEvent(conversationId: string, title: string, model: string, initiatedBy?: 'user' | 'system', memorySettings?: {
    maxMessages: number;
    maxTokens: number;
}): ConversationCreatedEvent;
//# sourceMappingURL=conversation-created.d.ts.map