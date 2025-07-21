/**
 * Feature Implementation: Chat Conversation Manager
 */
import { ConversationManagerContract, ConversationManagerDependencies } from "./contract";
import { Conversation } from "../../../models/chat/conversation";
export declare class ConversationManager implements ConversationManagerContract {
    private deps;
    constructor(deps: ConversationManagerDependencies);
    createConversation(params: any): Promise<Conversation>;
    getConversation(conversationId: string): Promise<Conversation | null>;
    updateConversation(conversationId: string, updates: any): Promise<Conversation>;
    deleteConversation(conversationId: string): Promise<void>;
    listConversations(params: any): Promise<any>;
    searchConversations(query: string): Promise<Conversation[]>;
    archiveOldConversations(olderThanDays: number): Promise<number>;
    generateTitle(conversationId: string): Promise<string>;
    duplicateConversation(conversationId: string, newTitle?: string): Promise<Conversation>;
    subscribeToConversation(conversationId: string, callback: any): void;
    unsubscribeFromConversation(conversationId: string): void;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map