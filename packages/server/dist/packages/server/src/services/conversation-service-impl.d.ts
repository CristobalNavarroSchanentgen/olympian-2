/**
 * Conversation Service Implementation
 * Database-backed storage using MongoDB
 */
import { ConversationService } from '@olympian/shared/services/conversation-service';
import { Conversation, ConversationSummary, ConversationFilter } from '@olympian/shared/models/chat/conversation';
export declare class ConversationServiceImpl implements ConversationService {
    private repository;
    constructor();
    createConversation(title: string, model: string, metadata?: Record<string, unknown>): Promise<Conversation>;
    getConversation(id: string): Promise<Conversation | null>;
    updateConversation(id: string, updates: Partial<Pick<Conversation, 'title' | 'model' | 'metadata'>>): Promise<Conversation>;
    deleteConversation(id: string): Promise<boolean>;
    listConversations(filter?: ConversationFilter, limit?: number, offset?: number): Promise<ConversationSummary[]>;
    searchConversations(query: string, limit?: number): Promise<ConversationSummary[]>;
    getConversationCount(filter?: ConversationFilter): Promise<number>;
    conversationExists(id: string): Promise<boolean>;
}
