/**
 * Database Service - MongoDB Integration
 * Provides centralized database connection and collection management
 */
import { MongoClient } from 'mongodb';
export class DatabaseService {
    client = null;
    db = null;
    connectionString;
    constructor(connectionString) {
        this.connectionString = connectionString ||
            process.env.MONGODB_URI ||
            'mongodb://localhost:27017/olympian';
    }
    async connect() {
        try {
            this.client = new MongoClient(this.connectionString);
            await this.client.connect();
            // Extract database name from connection string or use default
            const dbName = this.extractDbName(this.connectionString) || 'olympian';
            this.db = this.client.db(dbName);
            // Create indexes for performance
            await this.createIndexes();
            console.log(`✅ MongoDB connected: ${dbName}`);
        }
        catch (error) {
            console.error('❌ MongoDB connection failed:', error);
            throw error;
        }
    }
    async disconnect() {
        if (this.client) {
            await this.client.close();
            this.client = null;
            this.db = null;
            console.log('🔌 MongoDB disconnected');
        }
    }
    getCollections() {
        if (!this.db) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return {
            conversations: this.db.collection('conversations'),
            messages: this.db.collection('messages'),
            artifacts: this.db.collection('artifacts')
        };
    }
    isConnected() {
        return this.client !== null && this.db !== null;
    }
    extractDbName(connectionString) {
        const match = connectionString.match(/\/([^/?]+)(\?|$)/);
        return match ? match[1] : null;
    }
    async createIndexes() {
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
let databaseService = null;
export function getDatabaseService() {
    if (!databaseService) {
        databaseService = new DatabaseService();
    }
    return databaseService;
}
//# sourceMappingURL=database-service.js.map