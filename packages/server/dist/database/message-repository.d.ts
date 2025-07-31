/**
 * Message Repository - MongoDB Operations
 * Handles all message database operations
 */
import { Message } from '@olympian/shared/models/chat/message';
export interface MessageFilter {
    conversationId?: string;
    role?: 'user' | 'assistant' | 'system';
    since?: Date;
    limit?: number;
    offset?: number;
}
export declare class MessageRepository {
    private getCollection;
    create(message: Omit<Message, 'id'>): Promise<Message>;
    findById(id: string): Promise<Message | null>;
    update(id: string, updates: Partial<Omit<Message, 'id' | 'createdAt'>>): Promise<Message | null>;
    delete(id: string): Promise<boolean>;
    findByConversation(conversationId: string, filter?: Omit<MessageFilter, 'conversationId'>): Promise<Message[]>;
    list(filter?: MessageFilter): Promise<Message[]>;
    countByConversation(conversationId: string): Promise<number>;
    deleteByConversation(conversationId: string): Promise<number>;
    getLatestInConversation(conversationId: string, count?: number): Promise<Message[]>;
}
