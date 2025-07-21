import { MongoClient, Db, Collection } from 'mongodb';
import { 
  Conversation, 
  Message, 
  Artifact,
  ConnectionStatus,
  ModelCapability 
} from '@olympian/shared';

export class DatabaseService {
  private client: MongoClient;
  private db: Db;

  constructor() {
    const uri = process.env.MONGODB_URI || 'mongodb://root:olympian123@localhost:27017/olympian?authSource=admin&replicaSet=rs0';
    this.client = new MongoClient(uri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
    this.db = this.client.db('olympian');
    console.log('📊 Connected to MongoDB');
  }

  async disconnect(): Promise<void> {
    await this.client.close();
  }

  // Conversation operations
  async createConversation(conversation: Omit<Conversation, 'id'>): Promise<Conversation> {
    const coll = this.db.collection<Conversation>('conversations');
    const result = await coll.insertOne({
      ...conversation,
      id: new Date().getTime().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Conversation);
    
    return await coll.findOne({ _id: result.insertedId }) as Conversation;
  }

  async getConversation(id: string): Promise<Conversation | null> {
    const coll = this.db.collection<Conversation>('conversations');
    return await coll.findOne({ id });
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<void> {
    const coll = this.db.collection<Conversation>('conversations');
    await coll.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  async deleteConversation(id: string): Promise<void> {
    const coll = this.db.collection<Conversation>('conversations');
    await coll.deleteOne({ id });
    // Also delete related messages and artifacts
    await this.db.collection('messages').deleteMany({ conversationId: id });
    await this.db.collection('artifacts').deleteMany({ conversationId: id });
  }

  async listConversations(limit = 50, offset = 0): Promise<Conversation[]> {
    const coll = this.db.collection<Conversation>('conversations');
    return await coll
      .find({})
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(offset)
      .toArray();
  }

  async searchConversations(query: string): Promise<Conversation[]> {
    const coll = this.db.collection<Conversation>('conversations');
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
  async createMessage(message: Omit<Message, 'id'>): Promise<Message> {
    const coll = this.db.collection<Message>('messages');
    const result = await coll.insertOne({
      ...message,
      id: new Date().getTime().toString(),
      createdAt: new Date()
    } as Message);
    
    return await coll.findOne({ _id: result.insertedId }) as Message;
  }

  async getMessages(conversationId: string, limit = 100): Promise<Message[]> {
    const coll = this.db.collection<Message>('messages');
    return await coll
      .find({ conversationId })
      .sort({ createdAt: 1 })
      .limit(limit)
      .toArray();
  }

  async updateMessage(id: string, updates: Partial<Message>): Promise<void> {
    const coll = this.db.collection<Message>('messages');
    await coll.updateOne({ id }, { $set: updates });
  }

  async deleteMessage(id: string): Promise<void> {
    const coll = this.db.collection<Message>('messages');
    await coll.deleteOne({ id });
  }

  // Artifact operations
  async createArtifact(artifact: Omit<Artifact, 'id'>): Promise<Artifact> {
    const coll = this.db.collection<Artifact>('artifacts');
    const result = await coll.insertOne({
      ...artifact,
      id: new Date().getTime().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as Artifact);
    
    return await coll.findOne({ _id: result.insertedId }) as Artifact;
  }

  async getArtifacts(conversationId: string): Promise<Artifact[]> {
    const coll = this.db.collection<Artifact>('artifacts');
    return await coll
      .find({ conversationId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async updateArtifact(id: string, updates: Partial<Artifact>): Promise<void> {
    const coll = this.db.collection<Artifact>('artifacts');
    await coll.updateOne(
      { id },
      { $set: { ...updates, updatedAt: new Date() } }
    );
  }

  // Configuration operations
  async setConfig(key: string, value: any): Promise<void> {
    const coll = this.db.collection('config');
    await coll.replaceOne(
      { key },
      { key, value, updatedAt: new Date() },
      { upsert: true }
    );
  }

  async getConfig(key: string): Promise<any> {
    const coll = this.db.collection('config');
    const result = await coll.findOne({ key });
    return result?.value;
  }

  // Model capabilities
  async saveModelCapabilities(modelName: string, capabilities: ModelCapability, isCustom = false): Promise<void> {
    const coll = this.db.collection('modelCapabilities');
    await coll.replaceOne(
      { modelName },
      {
        modelName,
        capabilities,
        isCustom,
        updatedAt: new Date()
      },
      { upsert: true }
    );
  }

  async getModelCapabilities(modelName: string): Promise<ModelCapability | null> {
    const coll = this.db.collection('modelCapabilities');
    const result = await coll.findOne({ modelName });
    return result?.capabilities || null;
  }

  async getAllModelCapabilities(): Promise<Array<{ modelName: string; capabilities: ModelCapability; isCustom: boolean }>> {
    const coll = this.db.collection('modelCapabilities');
    return await coll.find({}).toArray();
  }
}
