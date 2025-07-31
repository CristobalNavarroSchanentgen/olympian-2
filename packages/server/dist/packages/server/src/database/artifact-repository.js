"use strict";
/**
 * Artifact Repository - MongoDB Operations
 * Handles all artifact database operations
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtifactRepository = void 0;
const mongodb_1 = require("mongodb");
const database_service_1 = require("./database-service");
class ArtifactRepository {
    getCollection() {
        return (0, database_service_1.getDatabaseService)().getCollections().artifacts;
    }
    async create(artifact) {
        const collection = this.getCollection();
        const doc = {
            ...artifact,
            _id: new mongodb_1.ObjectId()
        };
        const result = await collection.insertOne(doc);
        return {
            ...artifact,
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
    async findByConversation(conversationId) {
        const collection = this.getCollection();
        const cursor = collection
            .find({ conversationId })
            .sort({ createdAt: -1 });
        const docs = await cursor.toArray();
        return docs.map(doc => ({
            ...doc,
            id: doc._id.toString()
        }));
    }
    async findByMessage(messageId) {
        const collection = this.getCollection();
        const cursor = collection
            .find({ messageId })
            .sort({ createdAt: -1 });
        const docs = await cursor.toArray();
        return docs.map(doc => ({
            ...doc,
            id: doc._id.toString()
        }));
    }
    async list(filter) {
        const collection = this.getCollection();
        const query = {};
        if (filter?.conversationId) {
            query.conversationId = filter.conversationId;
        }
        if (filter?.type) {
            query.type = filter.type;
        }
        if (filter?.since) {
            query.createdAt = { $gte: filter.createdAfter };
        }
        const cursor = collection
            .find(query)
            .sort({ createdAt: -1 })
            .limit(filter?.limit || 50);
        const docs = await cursor.toArray();
        return docs.map(doc => ({
            ...doc,
            id: doc._id.toString()
        }));
    }
    async search(query, filter) {
        const collection = this.getCollection();
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { content: { $regex: query, $options: 'i' } }
            ]
        };
        if (filter?.conversationId) {
            searchQuery.conversationId = filter.conversationId;
        }
        if (filter?.type) {
            searchQuery.type = filter.type;
        }
        if (filter?.since) {
            searchQuery.createdAt = { $gte: filter.createdAfter };
        }
        const cursor = collection
            .find(searchQuery)
            .sort({ createdAt: -1 })
            .limit(filter?.limit || 20);
        const docs = await cursor.toArray();
        return docs.map(doc => ({
            ...doc,
            id: doc._id.toString()
        }));
    }
    async count(filter) {
        const collection = this.getCollection();
        const query = {};
        if (filter?.conversationId) {
            query.conversationId = filter.conversationId;
        }
        if (filter?.type) {
            query.type = filter.type;
        }
        if (filter?.since) {
            query.createdAt = { $gte: filter.createdAfter };
        }
        return await collection.countDocuments(query);
    }
    async deleteByConversation(conversationId) {
        const collection = this.getCollection();
        const result = await collection.deleteMany({ conversationId });
        return result.deletedCount || 0;
    }
    async getByType(type, limit = 10) {
        const collection = this.getCollection();
        const cursor = collection
            .find({ type })
            .sort({ createdAt: -1 })
            .limit(limit);
        const docs = await cursor.toArray();
        return docs.map(doc => ({
            ...doc,
            id: doc._id.toString()
        }));
    }
}
exports.ArtifactRepository = ArtifactRepository;
//# sourceMappingURL=artifact-repository.js.map