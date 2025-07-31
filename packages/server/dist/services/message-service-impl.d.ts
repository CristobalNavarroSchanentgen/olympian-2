/**
 * Message Service Implementation
 * MongoDB-backed persistence for messages
 */
import { MessageService } from '@olympian/shared/services/message-service';
import { Message, MessageDraft } from '@olympian/shared/models/chat/message';
export declare class MessageServiceImpl implements MessageService {
    private messageRepo;
    private conversationRepo;
    constructor();
    createMessage(conversationId: string, draft: MessageDraft, role: 'user' | 'assistant' | 'system'): Promise<Message>;
    getMessage(id: string): Promise<Message | null>;
    updateMessage(id: string, updates: Partial<Pick<Message, 'content' | 'metadata'>>): Promise<Message>;
    deleteMessage(id: string): Promise<boolean>;
    getConversationMessages(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
    listMessages(filter?: {
        conversationId?: string;
        role?: 'user' | 'assistant' | 'system';
        since?: Date;
        limit?: number;
        offset?: number;
    }): Promise<Message[]>;
    getMessageCount(conversationId?: string): Promise<number>;
    getLatestMessages(conversationId: string, count: number): Promise<Message[]>;
    searchMessages(query: string, conversationId?: string, limit?: number): Promise<Message[]>;
    deleteConversationMessages(conversationId: string): Promise<number>;
}
