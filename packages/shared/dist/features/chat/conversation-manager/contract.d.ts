/**
 * Feature Contract: Chat Conversation Manager
 *
 * This contract defines the complete interface and capabilities of the
 * conversation manager feature. This is the SINGLE SOURCE OF TRUTH for
 * what this feature can and cannot do.
 */
import { Conversation } from '../../../models/chat/conversation';
import { ConversationService } from '../../../services/conversation-service';
import { ConversationCreated, ConversationUpdated, ConversationDeleted } from '../../../events';
import { ConversationManagerConfig } from '../../../config/features/chat/conversation-manager/schema';
export interface ConversationManagerContract {
    /**
     * Create a new conversation with optional initial configuration
     */
    createConversation(params: {
        title?: string;
        model?: string;
        systemPrompt?: string;
        metadata?: Record<string, unknown>;
    }): Promise<Conversation>;
    /**
     * Retrieve conversation by ID with full details
     */
    getConversation(conversationId: string): Promise<Conversation | null>;
    /**
     * Update conversation properties (title, metadata, settings)
     */
    updateConversation(conversationId: string, updates: Partial<Pick<Conversation, 'title' | 'metadata' | 'model'>>): Promise<Conversation>;
    /**
     * Delete conversation and all associated data
     */
    deleteConversation(conversationId: string): Promise<void>;
    /**
     * List conversations with pagination and filtering
     */
    listConversations(params: {
        limit?: number;
        offset?: number;
        sortBy?: 'createdAt' | 'updatedAt' | 'title';
        sortOrder?: 'asc' | 'desc';
        search?: string;
    }): Promise<{
        conversations: Conversation[];
        total: number;
        hasMore: boolean;
    }>;
    /**
     * Search conversations by content or metadata
     */
    searchConversations(query: string, options?: {
        limit?: number;
        includeMessages?: boolean;
    }): Promise<Conversation[]>;
    /**
     * Archive old conversations based on age
     */
    archiveOldConversations(olderThanDays: number): Promise<number>;
    /**
     * Generate title for conversation based on content
     */
    generateTitle(conversationId: string): Promise<string>;
    /**
     * Duplicate conversation with new ID
     */
    duplicateConversation(conversationId: string, newTitle?: string): Promise<Conversation>;
    /**
     * Subscribe to conversation changes for real-time updates
     */
    subscribeToConversation(conversationId: string, callback: (conversation: Conversation) => void): void;
    /**
     * Unsubscribe from conversation updates
     */
    unsubscribeFromConversation(conversationId: string): void;
    /**
     * Update feature configuration
     */
    updateConfig(config: Partial<ConversationManagerConfig>): Promise<void>;
    /**
     * Get current feature configuration
     */
    getConfig(): ConversationManagerConfig;
}
export interface ConversationDatabaseAdapter {
    create(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation>;
    findById(id: string): Promise<Conversation | null>;
    update(id: string, updates: Partial<Conversation>): Promise<Conversation>;
    delete(id: string): Promise<void>;
    list(params: {
        limit: number;
        offset: number;
        sortBy: string;
        sortOrder: string;
        search?: string;
    }): Promise<{
        conversations: Conversation[];
        total: number;
    }>;
    search(query: string, limit: number): Promise<Conversation[]>;
    archiveOld(cutoffDate: Date): Promise<number>;
}
export interface ConversationWebSocketAdapter {
    emitConversationCreated(conversation: Conversation): void;
    emitConversationUpdated(conversation: Conversation): void;
    emitConversationDeleted(conversationId: string): void;
    subscribeToConversation(conversationId: string, callback: (data: unknown) => void): void;
    unsubscribeFromConversation(conversationId: string): void;
}
export interface ConversationEventPublisher {
    publishConversationCreated(event: ConversationCreated): void;
    publishConversationUpdated(event: ConversationUpdated): void;
    publishConversationDeleted(event: ConversationDeleted): void;
}
export interface ConversationManagerDependencies {
    conversationService: ConversationService;
    databaseAdapter: ConversationDatabaseAdapter;
    websocketAdapter: ConversationWebSocketAdapter;
    eventPublisher: ConversationEventPublisher;
    config: ConversationManagerConfig;
}
//# sourceMappingURL=contract.d.ts.map