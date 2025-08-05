/**
 * Conversation Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
import { ConversationService } from '@olympian/shared/services/conversation-service';
import { Conversation, ConversationSummary, ConversationFilter } from '@olympian/shared/models/chat/conversation';
export declare class ConversationServiceImpl implements ConversationService {
    private conversations;
    private nextId;
    createConversation(title: string, model: string, metadata?: Record<string, unknown>): Promise<Conversation>;
    getConversation(id: string): Promise<Conversation | null>;
    updateConversation(id: string, updates: Partial<Pick<Conversation, 'title' | 'model' | 'metadata'>>): Promise<Conversation>;
    deleteConversation(id: string): Promise<boolean>;
    listConversations(filter?: ConversationFilter): Promise<ConversationSummary[]>;
    searchConversations(query: string, limit?: number): Promise<ConversationSummary[]>;
    getConversationCount(filter?: ConversationFilter): Promise<number>;
    conversationExists(id: string): Promise<boolean>;
}
