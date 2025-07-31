/**
 * Conversation Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
import { ConversationService } from '../../../shared/services/conversation-service';
import { Conversation, ConversationSummary, ConversationFilter } from '../../../shared/models/chat/conversation';
export declare class ConversationServiceImpl implements ConversationService {
    private conversations;
    private nextId;
    createConversation(title: string, model: string, metadata?: Record<string, unknown>): Promise<Conversation>;
    getConversation(id: string): Promise<Conversation | null>;
    updateConversation(id: string, updates: Partial<Pick<Conversation, 'title' | 'model' | 'metadata'>>): Promise<Conversation>;
    deleteConversation(id: string): Promise<void>;
    listConversations(filter?: ConversationFilter): Promise<ConversationSummary[]>;
}
