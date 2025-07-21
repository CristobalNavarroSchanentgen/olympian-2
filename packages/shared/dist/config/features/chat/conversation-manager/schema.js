"use strict";
/**
 * Configuration Schema: Chat Conversation Manager
 *
 * Validates runtime configuration for conversation lifecycle management.
 * Pure validation schema - no behavior or side effects.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.conversationManagerDefaults = void 0;
exports.validateConversationManagerConfig = validateConversationManagerConfig;
exports.conversationManagerDefaults = {
    database: {
        collectionName: 'conversations',
        connectionTimeout: 5000,
        retryAttempts: 3,
    },
    websocket: {
        namespace: '/conversations',
        heartbeatInterval: 30000,
        maxConnections: 100,
    },
    pagination: {
        defaultLimit: 20,
        maxLimit: 100,
        sortField: 'updatedAt',
        sortOrder: 'desc',
    },
    lifecycle: {
        autoSaveInterval: 2000,
        titleGenerationThreshold: 50,
        archiveAfterDays: 365,
    },
};
function validateConversationManagerConfig(config) {
    if (!config || typeof config !== 'object')
        return false;
    const c = config;
    return (typeof c.database === 'object' &&
        typeof c.websocket === 'object' &&
        typeof c.pagination === 'object' &&
        typeof c.lifecycle === 'object');
}
//# sourceMappingURL=schema.js.map