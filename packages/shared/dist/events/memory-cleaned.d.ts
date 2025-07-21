/**
 * Memory cleaned event
 */
export interface MemoryCleanedEvent {
    readonly type: 'memory-cleaned';
    readonly conversationId: string;
    readonly timestamp: Date;
    readonly metadata: {
        readonly messagesRemoved: number;
        readonly tokensFreed: number;
        readonly newMessageCount: number;
        readonly newTokenCount: number;
        readonly cleanupReason: 'token_limit' | 'message_limit' | 'manual' | 'automatic';
    };
}
export declare function createMemoryCleanedEvent(conversationId: string, messagesRemoved: number, tokensFreed: number, newMessageCount: number, newTokenCount: number, cleanupReason: 'token_limit' | 'message_limit' | 'manual' | 'automatic'): MemoryCleanedEvent;
//# sourceMappingURL=memory-cleaned.d.ts.map