import { Message } from '../../../models/chat';
import { httpRequest } from '../../../utils/http-client';

/**
 * Ollama adapter for message processing
 * Transforms HTTP communication with Ollama for message-processor feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by message-processor
 */

export interface OllamaAdapter {
  // Message processing
  processMessage(model: string, messages: Message[], options?: ProcessingOptions): Promise<string>;
  streamMessage(model: string, messages: Message[], onToken: (token: string) => void): Promise<void>;
  
  // Model operations
  listModels(): Promise<ModelInfo[]>;
  getModelInfo(name: string): Promise<ModelInfo>;
  
  // Health and status
  checkHealth(): Promise<boolean>;
  getVersion(): Promise<string>;
}

export interface ProcessingOptions {
  temperature?: number;
  maxTokens?: number;
  stop?: string[];
  stream?: boolean;
}

export interface ModelInfo {
  name: string;
  size: number;
  digest: string;
  capabilities: string[];
}

export function createOllamaAdapter(baseUrl: string): OllamaAdapter {
  return {
    async processMessage(model, messages, options = {}) {
      const payload = {
        model,
        messages: messages.map(transformMessage),
        stream: false,
        options: {
          temperature: options.temperature || 0.7,
          num_predict: options.maxTokens || -1,
          stop: options.stop || []
        }
      };

      const response = await httpRequest({
        url: `${baseUrl}/api/chat`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 30000
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }

      const data = await response();
      return data.message.content;
    },

    async streamMessage(model, messages, onToken) {
      const payload = {
        model,
        messages: messages.map(transformMessage),
        stream: true
      };

      const response = await httpRequest({
        url: `${baseUrl}/api/chat`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        timeout: 60000
      });

      if (!response.ok) {
        throw new Error(`Ollama stream failed: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());

          for (const line of lines) {
            try {
              const data = JSON.parse(line);
              if (data.message?.content) {
                onToken(data.message.content);
              }
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    },

    async listModels() {
      const response = await httpRequest({
        url: `${baseUrl}/api/tags`,
        method: 'GET',
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Failed to list models: ${response.status}`);
      }

      const data = await response();
      return data.models.map(transformModelInfo);
    },

    async getModelInfo(name) {
      const response = await httpRequest({
        url: `${baseUrl}/api/show`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
        timeout: 10000
      });

      if (!response.ok) {
        throw new Error(`Failed to get model info: ${response.status}`);
      }

      const data = await response();
      return transformModelInfo(data);
    },

    async checkHealth() {
      try {
        const response = await httpRequest({
          url: `${baseUrl}/api/tags`,
          method: 'GET',
          timeout: 5000
        });
        return response.ok;
      } catch {
        return false;
      }
    },

    async getVersion() {
      const response = await httpRequest({
        url: `${baseUrl}/api/version`,
        method: 'GET',
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error(`Failed to get version: ${response.status}`);
      }

      const data = await response();
      return data.version || 'unknown';
    }
  };
}

function transformMessage(message: Message) {
  return {
    role: message.role,
    content: message.content,
    images: message.images || []
  };
}

function transformModelInfo(model: any): ModelInfo {
  return {
    name: model.name,
    size: model.size || 0,
    digest: model.digest || '',
    capabilities: extractCapabilities(model)
  };
}

function extractCapabilities(model: any): string[] {
  const caps = [];
  if (model.details?.family?.includes('vision')) caps.push('vision');
  if (model.details?.parameter_size) caps.push('text');
  return caps;
}
