/**
 * Conversation Repository - MongoDB Operations
 * Handles all conversation database operations
 */
import { ObjectId } from 'mongodb';
import { getDatabaseService } from './database-service';
export class ConversationRepository {
    getCollection() {
        return getDatabaseService().getCollections().conversations;
    }
    async create(conversation) {
        const collection = this.getCollection();
        const doc = {
            ...conversation,
            _id: new ObjectId()
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
            const doc = await collection.findOne({ _id: new ObjectId(id) });
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
            const result = await collection.findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { ...updates, updatedAt: new Date() } }, { returnDocument: 'after' });
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
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
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
            messageCount: doc.messageCount,
            lastActivity: doc.updatedAt,
            preview: doc.title.length > 50 ? doc.title.substring(0, 50) + "..." : undefined
        }));
    }
    async updateMessageCount(id, count) {
        const collection = this.getCollection();
        try {
            await collection.updateOne({ _id: new ObjectId(id) }, { $set: { messageCount: count, updatedAt: new Date() } });
        }
        catch (error) {
            // Ignore if conversation doesn't exist
        }
    }
    async exists(id) {
        const collection = this.getCollection();
        try {
            const count = await collection.countDocuments({ _id: new ObjectId(id) });
            return count > 0;
        }
        catch (error) {
            return false;
        }
    }
}
//# sourceMappingURL=conversation-repository.js.map