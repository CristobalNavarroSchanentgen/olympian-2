/**
 * Memory-related events
 */
export interface ContextUpdated {
    readonly type: 'context-updated';
    readonly conversationId: string;
    readonly timestamp: Date;
}
export interface MemoryCleaned {
    readonly type: 'memory-cleaned';
    readonly conversationId: string;
    readonly timestamp: Date;
}
