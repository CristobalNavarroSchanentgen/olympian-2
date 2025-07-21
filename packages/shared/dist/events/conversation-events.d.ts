/**
 * Conversation-related events
 */
export interface ConversationCreated {
    readonly type: 'conversation-created';
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface ConversationUpdated {
    readonly type: 'conversation-updated';
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface ConversationDeleted {
    readonly type: 'conversation-deleted';
    readonly conversationId: string;
    readonly timestamp: Date;
}
//# sourceMappingURL=conversation-events.d.ts.map