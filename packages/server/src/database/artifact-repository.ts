/**
 * Artifact Repository - MongoDB Operations
 * Handles all artifact database operations
 */

import { Collection, ObjectId } from 'mongodb';
import { Artifact, ArtifactType } from '@olympian/shared/models/artifacts/artifact';
import { ArtifactFilter } from '@olympian/shared/models/artifacts';
import { getDatabaseService } from './database-service';

export class ArtifactRepository {
  private getCollection(): Collection<Artifact> {
    return getDatabaseService().getCollections().artifacts;
  }

  async create(artifact: Omit<Artifact, 'id'>): Promise<Artifact> {
    const collection = this.getCollection();
    const doc = {
      ...artifact,
      _id: new ObjectId()
    };
    
    const result = await collection.insertOne(doc as any);
    
    return {
      ...artifact,
      id: result.insertedId.toString()
    };
  }

  async findById(id: string): Promise<Artifact | null> {
    const collection = this.getCollection();
    
    try {
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      if (!doc) return null;
      
      return {
        ...doc,
        id: doc._id.toString()
      };
    } catch (error) {
      return null;
    }
  }

  async update(id: string, updates: Partial<Omit<Artifact, 'id' | 'createdAt'>>): Promise<Artifact | null> {
    const collection = this.getCollection();
    
    try {
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $set: { ...updates, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      
      if (!result) return null;
      
      return {
        ...result,
        id: result._id.toString()
      };
    } catch (error) {
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    const collection = this.getCollection();
    
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) });
      return result.deletedCount > 0;
    } catch (error) {
      return false;
    }
  }

  async findByConversation(conversationId: string): Promise<Artifact[]> {
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

  async findByMessage(messageId: string): Promise<Artifact[]> {
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

  async list(filter?: ArtifactFilter): Promise<Artifact[]> {
    const collection = this.getCollection();
    const query: any = {};
    
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

  async search(query: string, filter?: ArtifactFilter): Promise<Artifact[]> {
    const collection = this.getCollection();
    const searchQuery: any = {
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

  async count(filter?: ArtifactFilter): Promise<number> {
    const collection = this.getCollection();
    const query: any = {};
    
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

  async deleteByConversation(conversationId: string): Promise<number> {
    const collection = this.getCollection();
    const result = await collection.deleteMany({ conversationId });
    return result.deletedCount || 0;
  }

  async getByType(type: ArtifactType, limit: number = 10): Promise<Artifact[]> {
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

