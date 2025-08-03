/**
 * Conversation service contract
 * All methods return Promises for consistency
 */
import { Conversation, ConversationSummary, ConversationFilter } from '../models/chat/conversation';
export interface ConversationService {
    /**
     * Create a new conversation
     */
    createConversation(title: string, model: string, metadata?: Record<string, unknown>): Promise<Conversation>;
    /**
     * Get conversation by ID
     */
    getConversation(id: string): Promise<Conversation | null>;
    /**
     * Update conversation
     */
    updateConversation(id: string, updates: Partial<Pick<Conversation, 'title' | 'model' | 'metadata'>>): Promise<Conversation>;
    /**
     * Delete conversation
     */
    deleteConversation(id: string): Promise<boolean>;
    /**
     * List conversations with pagination
     */
    listConversations(filter?: ConversationFilter, limit?: number, offset?: number): Promise<ConversationSummary[]>;
    /**
     * Search conversations by content
     */
    searchConversations(query: string, limit?: number): Promise<ConversationSummary[]>;
    /**
     * Get conversation count
     */
    getConversationCount(filter?: ConversationFilter): Promise<number>;
    /**
     * Check if conversation exists
     */
    conversationExists(id: string): Promise<boolean>;
}
