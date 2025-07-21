"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const mongodb_1 = require("mongodb");
class DatabaseService {
    client;
    db;
    constructor() {
        const uri = process.env.MONGODB_URI || 'mongodb://root:olympian123@localhost:27017/olympian?authSource=admin&replicaSet=rs0';
        this.client = new mongodb_1.MongoClient(uri);
    }
    async connect() {
        await this.client.connect();
        this.db = this.client.db('olympian');
        console.log('📊 Connected to MongoDB');
    }
    async disconnect() {
        await this.client.close();
    }
    // Conversation operations
    async createConversation(conversation) {
        const coll = this.db.collection('conversations');
        const result = await coll.insertOne({
            ...conversation,
            id: new Date().getTime().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await coll.findOne({ _id: result.insertedId });
    }
    async getConversation(id) {
        const coll = this.db.collection('conversations');
        return await coll.findOne({ id });
    }
    async updateConversation(id, updates) {
        const coll = this.db.collection('conversations');
        await coll.updateOne({ id }, { $set: { ...updates, updatedAt: new Date() } });
    }
    async deleteConversation(id) {
        const coll = this.db.collection('conversations');
        await coll.deleteOne({ id });
        // Also delete related messages and artifacts
        await this.db.collection('messages').deleteMany({ conversationId: id });
        await this.db.collection('artifacts').deleteMany({ conversationId: id });
    }
    async listConversations(limit = 50, offset = 0) {
        const coll = this.db.collection('conversations');
        return await coll
            .find({})
            .sort({ updatedAt: -1 })
            .limit(limit)
            .skip(offset)
            .toArray();
    }
    async searchConversations(query) {
        const coll = this.db.collection('conversations');
        return await coll
            .find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { model: { $regex: query, $options: 'i' } }
            ]
        })
            .sort({ updatedAt: -1 })
            .toArray();
    }
    // Message operations
    async createMessage(message) {
        const coll = this.db.collection('messages');
        const result = await coll.insertOne({
            ...message,
            id: new Date().getTime().toString(),
            createdAt: new Date()
        });
        return await coll.findOne({ _id: result.insertedId });
    }
    async getMessages(conversationId, limit = 100) {
        const coll = this.db.collection('messages');
        return await coll
            .find({ conversationId })
            .sort({ createdAt: 1 })
            .limit(limit)
            .toArray();
    }
    async updateMessage(id, updates) {
        const coll = this.db.collection('messages');
        await coll.updateOne({ id }, { $set: updates });
    }
    async deleteMessage(id) {
        const coll = this.db.collection('messages');
        await coll.deleteOne({ id });
    }
    // Artifact operations
    async createArtifact(artifact) {
        const coll = this.db.collection('artifacts');
        const result = await coll.insertOne({
            ...artifact,
            id: new Date().getTime().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await coll.findOne({ _id: result.insertedId });
    }
    async getArtifacts(conversationId) {
        const coll = this.db.collection('artifacts');
        return await coll
            .find({ conversationId })
            .sort({ createdAt: -1 })
            .toArray();
    }
    async updateArtifact(id, updates) {
        const coll = this.db.collection('artifacts');
        await coll.updateOne({ id }, { $set: { ...updates, updatedAt: new Date() } });
    }
    // Configuration operations
    async setConfig(key, value) {
        const coll = this.db.collection('config');
        await coll.replaceOne({ key }, { key, value, updatedAt: new Date() }, { upsert: true });
    }
    async getConfig(key) {
        const coll = this.db.collection('config');
        const result = await coll.findOne({ key });
        return result?.value;
    }
    // Model capabilities
    async saveModelCapabilities(modelName, capabilities, isCustom = false) {
        const coll = this.db.collection('modelCapabilities');
        await coll.replaceOne({ modelName }, {
            modelName,
            capabilities,
            isCustom,
            updatedAt: new Date()
        }, { upsert: true });
    }
    async getModelCapabilities(modelName) {
        const coll = this.db.collection('modelCapabilities');
        const result = await coll.findOne({ modelName });
        return result?.capabilities || null;
    }
    async getAllModelCapabilities() {
        const coll = this.db.collection('modelCapabilities');
        return await coll.find({}).toArray();
    }
}
exports.DatabaseService = DatabaseService;
//# sourceMappingURL=database-service.js.map