"use strict";
/**
 * Conversation Repository - MongoDB Operations
 * Handles all conversation database operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConversationRepository = void 0;
const mongodb_1 = require("mongodb");
const database_service_1 = require("./database-service");
class ConversationRepository {
    getCollection() {
        return (0, database_service_1.getDatabaseService)().getCollections().conversations;
    }
    async create(conversation) {
        const collection = this.getCollection();
        const doc = {
            ...conversation,
            _id: new mongodb_1.ObjectId()
        };
        const result = await collection.insertOne(doc);
        return {
            ...conversation,
            id: result.insertedId.toString()
        };
    }
    async findById(id) {
        const collection = this.getCollection();
        try {
            const doc = await collection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!doc)
                return null;
            return {
                ...doc,
                id: doc._id.toString()
            };
        }
        catch (error) {
            // Invalid ObjectId format
            return null;
        }
    }
    async update(id, updates) {
        const collection = this.getCollection();
        try {
            const result = await collection.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
            if (!result)
                return null;
            return {
                ...result,
                id: result._id.toString()
            };
        }
        catch (error) {
            return null;
        }
    }
    async delete(id) {
        const collection = this.getCollection();
        try {
            const result = await collection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
            return result.deletedCount > 0;
        }
        catch (error) {
            return false;
        }
    }
    async list(filter) {
        const collection = this.getCollection();
        const query = {};
        if (filter?.model) {
            query.model = filter.model;
        }
        if (filter?.since) {
            query.updatedAt = { $gte: filter.createdAfter };
        }
        const cursor = collection
            .find(query)
            .sort({ updatedAt: -1 })
            .limit(filter?.limit || 50);
        const docs = await cursor.toArray();
        return docs.map(doc => ({
            id: doc._id.toString(),
            title: doc.title,
            model: doc.model,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,
            messageCount: doc.messageCount
        }));
    }
    async updateMessageCount(id, count) {
        const collection = this.getCollection();
        try {
            await collection.updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: { messageCount: count, updatedAt: new Date() } });
        }
        catch (error) {
            // Ignore if conversation doesn't exist
        }
    }
    async exists(id) {
        const collection = this.getCollection();
        try {
            const count = await collection.countDocuments({ _id: new mongodb_1.ObjectId(id) });
            return count > 0;
        }
        catch (error) {
            return false;
        }
    }
}
exports.ConversationRepository = ConversationRepository;
//# sourceMappingURL=conversation-repository.js.map