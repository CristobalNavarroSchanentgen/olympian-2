/**
 * Database Service - MongoDB Integration
 * Provides centralized database connection and collection management  
 */

import { MongoClient, Db, Collection } from 'mongodb';
import { Conversation } from '@olympian/shared/models/chat/conversation';
import { Message } from '@olympian/shared/models/chat/message';
import { Artifact } from '@olympian/shared/models/artifacts/artifact';

export interface DatabaseCollections {
  conversations: Collection<Conversation>;
  messages: Collection<Message>;
  artifacts: Collection<Artifact>;
}

export class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private connectionString: string;
  
  constructor(connectionString?: string) {
    this.connectionString = connectionString || 
      process.env.MONGODB_URI || 
      'mongodb://localhost:27017/olympian';
  }
  
  async connect(): Promise<void> {
    try {
      this.client = new MongoClient(this.connectionString);
      await this.client.connect();
      
      // Extract database name from connection string or use default
      const dbName = this.extractDbName(this.connectionString) || 'olympian';
      this.db = this.client.db(dbName);
      
      // Create indexes for performance
      await this.createIndexes();
      
      console.log(`✅ MongoDB connected: ${dbName}`);
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
      throw error;
    }
  }
  
  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.close();
      this.client = null;
      this.db = null;
      console.log('🔌 MongoDB disconnected');
    }
  }
  
  getCollections(): DatabaseCollections {
    if (!this.db) {
      throw new Error('Database not connected. Call connect() first.');
    }
    
    return {
      conversations: this.db.collection<Conversation>('conversations'),
      messages: this.db.collection<Message>('messages'),
      artifacts: this.db.collection<Artifact>('artifacts')
    };
  }
  
  isConnected(): boolean {
    return this.client !== null && this.db !== null;
  }
  
  private extractDbName(connectionString: string): string | null {
    const match = connectionString.match(/\/([^/?]+)(\?|$)/);
    return match ? match[1] : null;
  }
  
  private async createIndexes(): Promise<void> {
    const collections = this.getCollections();
    
    // Conversations indexes
    await collections.conversations.createIndex({ createdAt: -1 });
    await collections.conversations.createIndex({ updatedAt: -1 });
    await collections.conversations.createIndex({ model: 1 });
    
    // Messages indexes
    await collections.messages.createIndex({ conversationId: 1, createdAt: 1 });
    await collections.messages.createIndex({ createdAt: -1 });
    await collections.messages.createIndex({ role: 1 });
    
    // Artifacts indexes
    await collections.artifacts.createIndex({ conversationId: 1 });
    await collections.artifacts.createIndex({ messageId: 1 });
    await collections.artifacts.createIndex({ type: 1 });
    await collections.artifacts.createIndex({ createdAt: -1 });
    
    console.log('📊 Database indexes created');
  }
}

// Singleton instance
let databaseService: DatabaseService | null = null;

export function getDatabaseService(): DatabaseService {
  if (!databaseService) {
    databaseService = new DatabaseService();
  }
  return databaseService;
}

