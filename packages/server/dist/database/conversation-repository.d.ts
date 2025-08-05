/**
 * Conversation Repository - MongoDB Operations
 * Handles all conversation database operations
 */
import { Conversation, ConversationSummary, ConversationFilter } from '@olympian/shared/models/chat/conversation';
export declare class ConversationRepository {
    private getCollection;
    create(conversation: Omit<Conversation, 'id'>): Promise<Conversation>;
    findById(id: string): Promise<Conversation | null>;
    update(id: string, updates: Partial<Omit<Conversation, 'id' | 'createdAt'>>): Promise<Conversation | null>;
    delete(id: string): Promise<boolean>;
    list(filter?: ConversationFilter): Promise<ConversationSummary[]>;
    updateMessageCount(id: string, count: number): Promise<void>;
    exists(id: string): Promise<boolean>;
}
