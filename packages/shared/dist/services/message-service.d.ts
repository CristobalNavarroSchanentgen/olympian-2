/**
 * Message service interface
 */
import { Message, MessageDraft } from '../models/chat/message';
export interface MessageService {
    /**
     * Create a new message
     */
    createMessage(conversationId: string, draft: MessageDraft, role: 'user' | 'assistant' | 'system'): Promise<Message>;
    /**
     * Get message by ID
     */
    getMessage(id: string): Promise<Message | null>;
    /**
     * Update message content
     */
    updateMessage(id: string, updates: Partial<Pick<Message, 'content' | 'metadata'>>): Promise<Message>;
    /**
     * Delete message
     */
    deleteMessage(id: string): Promise<boolean>;
    /**
     * Get messages for conversation
     */
    getConversationMessages(conversationId: string, limit?: number, offset?: number): Promise<Message[]>;
    /**
     * Get message count for conversation
     */
    getMessageCount(conversationId: string): Promise<number>;
    /**
     * Search messages by content
     */
    searchMessages(query: string, conversationId?: string, limit?: number): Promise<Message[]>;
    /**
     * Get latest message in conversation
     */
    getLatestMessage(conversationId: string): Promise<Message | null>;
    /**
     * Bulk delete messages
     */
    deleteMessages(messageIds: string[]): Promise<number>;
}
//# sourceMappingURL=message-service.d.ts.map