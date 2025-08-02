/**
 * Conversation Manager Feature
 * Manages conversation lifecycle and title updates
 */
import type { ConversationManagerContract, Conversation, ConversationCreateRequest, ConversationUpdateRequest } from './contract';
export declare class ConversationManager implements ConversationManagerContract {
    private conversationService;
    private eventEmitter;
    constructor(conversationService: any, eventEmitter: any);
    getConversations(): Promise<Conversation[]>;
    getConversation(id: string): Promise<Conversation | null>;
    createConversation(request: ConversationCreateRequest): Promise<Conversation>;
    updateConversation(id: string, updates: ConversationUpdateRequest): Promise<Conversation | null>;
    deleteConversation(id: string): Promise<boolean>;
    archiveConversation(id: string): Promise<boolean>;
    searchConversations(query: string): Promise<Conversation[]>;
    /**
     * Update conversation title (used by title generation)
     */
    updateTitle(conversationId: string, title: string): Promise<Conversation | null>;
}
export * from './contract';
