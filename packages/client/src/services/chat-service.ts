import axios from 'axios';
import { Conversation, Message, Artifact } from '@olympian/shared';

const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

export const chatService = {
  // Conversations
  async getConversations(): Promise<Conversation[]> {
    const { data } = await api.get('/conversations');
    return data;
  },

  async getConversation(id: string): Promise<Conversation> {
    const { data } = await api.get(`/conversations/${id}`);
    return data;
  },

  async createConversation(conversation: { title: string; model: string; metadata?: any }): Promise<Conversation> {
    const { data } = await api.post('/conversations', conversation);
    return data;
  },

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<void> {
    await api.put(`/conversations/${id}`, updates);
  },

  async deleteConversation(id: string): Promise<void> {
    await api.delete(`/conversations/${id}`);
  },

  // Messages
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data } = await api.get(`/messages/conversation/${conversationId}`);
    return data;
  },

  async createMessage(message: {
    conversationId: string;
    role: string;
    content: string;
    images?: string[];
    metadata?: any;
  }): Promise<Message> {
    const { data } = await api.post('/messages', message);
    return data;
  },

  // Artifacts
  async getArtifacts(conversationId: string): Promise<Artifact[]> {
    const { data } = await api.get(`/artifacts/conversation/${conversationId}`);
    return data;
  },

  // Ollama
  async getOllamaStatus(): Promise<{ connected: boolean; baseUrl: string }> {
    const { data } = await api.get('/ollama/status');
    return data;
  },

  async getModels(): Promise<any[]> {
    const { data } = await api.get('/ollama/models');
    return data;
  },

  // MCP
  async getMCPServers(): Promise<any[]> {
    const { data } = await api.get('/mcp/servers');
    return data;
  },

  async getMCPTools(): Promise<any[]> {
    const { data } = await api.get('/mcp/tools');
    return data;
  },

  async executeTool(serverName: string, toolName: string, args: any): Promise<any> {
    const { data } = await api.post('/mcp/tools/execute', {
      serverName,
      toolName,
      arguments: args,
    });
    return data;
  },
};
