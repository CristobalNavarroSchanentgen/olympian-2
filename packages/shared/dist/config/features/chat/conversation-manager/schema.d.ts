/**
 * Configuration Schema: Chat Conversation Manager
 *
 * Validates runtime configuration for conversation lifecycle management.
 * Pure validation schema - no behavior or side effects.
 */
export interface ConversationManagerConfig {
    readonly database: {
        readonly collectionName: string;
        readonly connectionTimeout: number;
        readonly retryAttempts: number;
    };
    readonly websocket: {
        readonly namespace: string;
        readonly heartbeatInterval: number;
        readonly maxConnections: number;
    };
    readonly pagination: {
        readonly defaultLimit: number;
        readonly maxLimit: number;
        readonly sortField: string;
        readonly sortOrder: 'asc' | 'desc';
    };
    readonly lifecycle: {
        readonly autoSaveInterval: number;
        readonly titleGenerationThreshold: number;
        readonly archiveAfterDays: number;
    };
}
export declare const conversationManagerDefaults: ConversationManagerConfig;
export declare function validateConversationManagerConfig(config: unknown): config is ConversationManagerConfig;
//# sourceMappingURL=schema.d.ts.map