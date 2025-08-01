/**
 * Message-related events
 */
export interface MessageSent {
    readonly type: 'message-sent';
    readonly messageId: string;
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface MessageReceived {
    readonly type: 'message-received';
    readonly messageId: string;
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface TokensProcessed {
    readonly type: 'tokens-processed';
    readonly messageId: string;
    readonly tokenCount: number;
    readonly timestamp: Date;
}
