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

export const conversationManagerDefaults: ConversationManagerConfig = {
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

export function validateConversationManagerConfig(
  config: unknown
): config is ConversationManagerConfig {
  if (!config || typeof config !== 'object') return false;
  
  const c = config as Record<string, unknown>;
  
  return (
    typeof c.database === 'object' &&
    typeof c.websocket === 'object' &&
    typeof c.pagination === 'object' &&
    typeof c.lifecycle === 'object'
  );
}
