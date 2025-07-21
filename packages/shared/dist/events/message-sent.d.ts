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
export declare function createMessageSentEvent(messageId: string, conversationId: string, role: 'user' | 'assistant' | 'system', content: string, tokenCount: number, imageCount?: number, model?: string): MessageSentEvent;
//# sourceMappingURL=message-sent.d.ts.map