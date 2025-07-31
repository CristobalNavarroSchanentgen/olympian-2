/**
 * Database Service - MongoDB Integration
 * Provides centralized database connection and collection management
 */
import { Collection } from 'mongodb';
import { Conversation } from '@olympian/shared/models/chat/conversation';
import { Message } from '@olympian/shared/models/chat/message';
import { Artifact } from '@olympian/shared/models/artifacts/artifact';
export interface DatabaseCollections {
    conversations: Collection<Conversation>;
    messages: Collection<Message>;
    artifacts: Collection<Artifact>;
}
export declare class DatabaseService {
    private client;
    private db;
    private connectionString;
    constructor(connectionString?: string);
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    getCollections(): DatabaseCollections;
    isConnected(): boolean;
    private extractDbName;
    private createIndexes;
}
export declare function getDatabaseService(): DatabaseService;
