/**
 * Message Repository - MongoDB Operations
 * Handles all message database operations
 */

import { Collection, ObjectId } from 'mongodb';
import { Message, MessageDraft } from '@olympian/shared/models/chat/message';
import { getDatabaseService } from './database-service';

export interface MessageFilter {
  conversationId?: string;
  role?: 'user' | 'assistant' | 'system';
  since?: Date;
  limit?: number;
  offset?: number;
}

export class MessageRepository {
  private getCollection(): Collection<Message> {
    return getDatabaseService().getCollections().messages;
  }

  async create(message: Omit<Message, 'id'>): Promise<Message> {
    const collection = this.getCollection();
    const doc = {
      ...message,
      _id: new ObjectId()
    };
    
    const result = await collection.insertOne(doc as any);
    
    return {
      ...message,
      id: result.insertedId.toString()
    };
  }

  async findById(id: string): Promise<Message | null> {
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

  async update(id: string, updates: Partial<Omit<Message, 'id' | 'createdAt'>>): Promise<Message | null> {
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

  async findByConversation(conversationId: string, filter?: Omit<MessageFilter, 'conversationId'>): Promise<Message[]> {
    const collection = this.getCollection();
    const query: any = { conversationId };
    
    if (filter?.role) {
      query.role = filter.role;
    }
    
    if (filter?.since) {
      query.createdAt = { $gte: filter.since };
    }
    
    const cursor = collection
      .find(query)
      .sort({ createdAt: 1 }) // Messages in chronological order
      .skip(filter?.offset || 0)
      .limit(filter?.limit || 100);
      
    const docs = await cursor.toArray();
    
    return docs.map(doc => ({
      ...doc,
      id: doc._id.toString()
    }));
  }

  async list(filter?: MessageFilter): Promise<Message[]> {
    const collection = this.getCollection();
    const query: any = {};
    
    if (filter?.conversationId) {
      query.conversationId = filter.conversationId;
    }
    
    if (filter?.role) {
      query.role = filter.role;
    }
    
    if (filter?.since) {
      query.createdAt = { $gte: filter.since };
    }
    
    const cursor = collection
      .find(query)
      .sort({ createdAt: -1 }) // Most recent first for general listing
      .skip(filter?.offset || 0)
      .limit(filter?.limit || 50);
      
    const docs = await cursor.toArray();
    
    return docs.map(doc => ({
      ...doc,
      id: doc._id.toString()
    }));
  }

  async countByConversation(conversationId: string): Promise<number> {
    const collection = this.getCollection();
    return await collection.countDocuments({ conversationId });
  }

  async deleteByConversation(conversationId: string): Promise<number> {
    const collection = this.getCollection();
    const result = await collection.deleteMany({ conversationId });
    return result.deletedCount || 0;
  }

  async getLatestInConversation(conversationId: string, count: number = 10): Promise<Message[]> {
    const collection = this.getCollection();
    
    const cursor = collection
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(count);
      
    const docs = await cursor.toArray();
    
    // Return in chronological order (oldest first)
    return docs
      .reverse()
      .map(doc => ({
        ...doc,
        id: doc._id.toString()
      }));
  }
}

