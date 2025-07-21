import { Conversation, Message, Artifact, ModelCapability } from '@olympian/shared';
export declare class DatabaseService {
    private client;
    private db;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    createConversation(conversation: Omit<Conversation, 'id'>): Promise<Conversation>;
    getConversation(id: string): Promise<Conversation | null>;
    updateConversation(id: string, updates: Partial<Conversation>): Promise<void>;
    deleteConversation(id: string): Promise<void>;
    listConversations(limit?: number, offset?: number): Promise<Conversation[]>;
    searchConversations(query: string): Promise<Conversation[]>;
    createMessage(message: Omit<Message, 'id'>): Promise<Message>;
    getMessages(conversationId: string, limit?: number): Promise<Message[]>;
    updateMessage(id: string, updates: Partial<Message>): Promise<void>;
    deleteMessage(id: string): Promise<void>;
    createArtifact(artifact: Omit<Artifact, 'id'>): Promise<Artifact>;
    getArtifacts(conversationId: string): Promise<Artifact[]>;
    updateArtifact(id: string, updates: Partial<Artifact>): Promise<void>;
    setConfig(key: string, value: any): Promise<void>;
    getConfig(key: string): Promise<any>;
    saveModelCapabilities(modelName: string, capabilities: ModelCapability, isCustom?: boolean): Promise<void>;
    getModelCapabilities(modelName: string): Promise<ModelCapability | null>;
    getAllModelCapabilities(): Promise<Array<{
        modelName: string;
        capabilities: ModelCapability;
        isCustom: boolean;
    }>>;
}
