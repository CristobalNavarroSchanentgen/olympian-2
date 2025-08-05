/**
 * Message Service Implementation
 * Database-backed storage using MongoDB
 */
import { MessageService } from '@olympian/shared/services/message-service';
import { Message, MessageDraft } from '@olympian/shared/models/chat/message';
export declare class MessageServiceImpl implements MessageService {
    private messageRepository;
    private conversationRepository;
    constructor();
    createMessage(conversationId: string, draft: MessageDraft, role: 'user' | 'assistant' | 'system'): Promise<Message>;
    getMessage(id: string): Promise<Message | null>;
    updateMessage(id: string, updates: Partial<Pick<Message, 'content' | 'metadata'>>): Promise<Message>;
    getConversationMessages(conversationId: string): Promise<Message[]>;
    deleteMessage(id: string): Promise<boolean>;
    getMessageCount(conversationId?: string): Promise<number>;
    searchMessages(query: string, conversationId?: string): Promise<Message[]>;
    getLatestMessage(conversationId: string): Promise<Message | null>;
    deleteMessages(messageIds: string[]): Promise<number>;
}
