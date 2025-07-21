"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabaseAdapter = createDatabaseAdapter;
function createDatabaseAdapter(connection) {
    return {
        async create(conversation) {
            const now = new Date();
            const doc = {
                ...conversation,
                id: generateId(),
                createdAt: now,
                updatedAt: now
            };
            const result = await connection.collection('conversations').insertOne(doc);
            return { ...doc, id: result.insertedId.toString() };
        },
        async findById(id) {
            const doc = await connection.collection('conversations').findOne({ _id: id });
            return doc ? transformFromDb(doc) : null;
        },
        async findAll(limit = 50, offset = 0) {
            const docs = await connection.collection('conversations')
                .find({})
                .sort({ updatedAt: -1 })
                .limit(limit)
                .skip(offset)
                .toArray();
            return docs.map(transformFromDb);
        },
        async update(id, updates) {
            const updateDoc = { ...updates, updatedAt: new Date() };
            const result = await connection.collection('conversations')
                .findOneAndUpdate({ _id: id }, { set: updateDoc }, { returnDocument: 'after' });
            if (!result.value)
                throw new Error('Conversation not found');
            return transformFromDb(result.value);
        },
        async delete(id) {
            const result = await connection.collection('conversations').deleteOne({ _id: id });
            if (result.deletedCount === 0)
                throw new Error('Conversation not found');
        },
        async search(query) {
            const docs = await connection.collection('conversations')
                .find({ title: { regex: query, options: 'i' } })
                .sort({ updatedAt: -1 })
                .toArray();
            return docs.map(transformFromDb);
        },
        async findByModel(modelName) {
            const docs = await connection.collection('conversations')
                .find({ model: modelName })
                .sort({ updatedAt: -1 })
                .toArray();
            return docs.map(transformFromDb);
        },
        async findRecent(limit) {
            const docs = await connection.collection('conversations')
                .find({})
                .sort({ updatedAt: -1 })
                .limit(limit)
                .toArray();
            return docs.map(transformFromDb);
        },
        async count() {
            return await connection.collection('conversations').countDocuments();
        },
        async countByModel() {
            const pipeline = [
                { group: { _id: 'model', count: { sum: 1 } } },
                { project: { model: '_id', count: 1, _id: 0 } }
            ];
            return await connection.collection('conversations').aggregate(pipeline).toArray();
        }
    };
}
function transformFromDb(doc) {
    return {
        id: doc._id.toString(),
        title: doc.title,
        model: doc.model,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
        metadata: doc.metadata || {}
    };
}
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
//# sourceMappingURL=database-adapter.js.map