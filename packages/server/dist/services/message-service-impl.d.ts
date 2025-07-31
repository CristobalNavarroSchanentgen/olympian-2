/**
 * Message Service Implementation
 * In-memory storage for Phase 1 - will be replaced with database integration
 */
import { MessageService } from '../../../shared/services/message-service';
import { Message, MessageDraft } from '../../../shared/models/chat/message';
export declare class MessageServiceImpl implements MessageService {
    private messages;
    private conversationMessages;
    private nextId;
    createMessage(conversationId: string, draft: MessageDraft, role: 'user' | 'assistant' | 'system'): Promise<Message>;
    getMessage(id: string): Promise<Message | null>;
    updateMessage(id: string, updates: Partial<Pick<Message, 'content' | 'metadata'>>): Promise<Message>;
    getConversationMessages(conversationId: string): Promise<Message[]>;
    deleteMessage(id: string): Promise<void>;
}
