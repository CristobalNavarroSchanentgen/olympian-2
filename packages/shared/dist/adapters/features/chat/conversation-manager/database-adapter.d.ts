import { Conversation } from '../../../models/chat';
/**
 * Database adapter for conversation operations
 * Transforms database operations for conversation-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by conversation-manager
 * No other feature may use this adapter - they must create their own
 */
export interface DatabaseAdapter {
    create(conversation: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Conversation>;
    findById(id: string): Promise<Conversation | null>;
    findAll(limit?: number, offset?: number): Promise<Conversation[]>;
    update(id: string, updates: Partial<Conversation>): Promise<Conversation>;
    delete(id: string): Promise<void>;
    search(query: string): Promise<Conversation[]>;
    findByModel(modelName: string): Promise<Conversation[]>;
    findRecent(limit: number): Promise<Conversation[]>;
    count(): Promise<number>;
    countByModel(): Promise<{
        model: string;
        count: number;
    }[]>;
}
export declare function createDatabaseAdapter(connection: any): DatabaseAdapter;
//# sourceMappingURL=database-adapter.d.ts.map