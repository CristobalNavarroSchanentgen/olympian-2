/**
 * Conversation Repository - MongoDB Operations
 * Handles all conversation database operations
 */

import { Collection, ObjectId } from 'mongodb';
import { Conversation, ConversationSummary, ConversationFilter } from '@olympian/shared/models/chat/conversation';
import { getDatabaseService } from './database-service';

export class ConversationRepository {
  private getCollection(): Collection<Conversation> {
    return getDatabaseService().getCollections().conversations;
  }

  async create(conversation: Omit<Conversation, 'id'>): Promise<Conversation> {
    const collection = this.getCollection();
    const doc = {
      ...conversation,
      _id: new ObjectId()
    };
    
    const result = await collection.insertOne(doc as any);
    
    return {
      ...conversation,
      id: result.insertedId.toString()
    };
  }

  async findById(id: string): Promise<Conversation | null> {
    const collection = this.getCollection();
    
    try {
      const doc = await collection.findOne({ _id: new ObjectId(id) });
      if (!doc) return null;
      
      return {
        ...doc,
        id: doc._id.toString()
      };
    } catch (error) {
      // Invalid ObjectId format
      return null;
    }
  }

  async update(id: string, updates: Partial<Omit<Conversation, 'id' | 'createdAt'>>): Promise<Conversation | null> {
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

  async list(filter?: ConversationFilter): Promise<ConversationSummary[]> {
    const collection = this.getCollection();
    const query: any = {};
    
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

  async updateMessageCount(id: string, count: number): Promise<void> {
    const collection = this.getCollection();
    
    try {
      await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { messageCount: count, updatedAt: new Date() } }
      );
    } catch (error) {
      // Ignore if conversation doesn't exist
    }
  }

  async exists(id: string): Promise<boolean> {
    const collection = this.getCollection();
    
    try {
      const count = await collection.countDocuments({ _id: new ObjectId(id) });
      return count > 0;
    } catch (error) {
      return false;
    }
  }
}

