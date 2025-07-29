import { Message } from '../../../../models/chat/index';
import { httpRequest } from '../../../../utils/http-client';

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

// Helper Functions (extracted from returned object methods)
async function processMessageHelper(baseUrl: string, model: string, messages: Message[], options: ProcessingOptions = {}): Promise<string> {
  const payload = {
    model,
    messages: messages.map(transformMessageHelper),
    stream: false,
    options: {
      temperature: options.temperature || 0.7,
      num_predict: options.maxTokens || -1,
      stop: options.stop || []
    }
  };

  const response = await httpRequest(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    timeout: 30000
  });

  if (response.status >= 400) {
    throw new Error(`Ollama request failed: ${response.status}`);
  }

  const data = response.data as any;
  return data.message.content;
}

async function streamMessageHelper(baseUrl: string, model: string, messages: Message[], onToken: (token: string) => void): Promise<void> {
  const payload = {
    model,
    messages: messages.map(transformMessageHelper),
    stream: true
  };

  // Use fetch for streaming instead of httpRequest
  const response = await fetch(`${baseUrl}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (response.status >= 400) {
    throw new Error(`Ollama stream failed: ${response.status}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response body");

  const decoder = new TextDecoder();
  
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim());

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
}

async function listModelsHelper(baseUrl: string): Promise<ModelInfo[]> {
  const response = await httpRequest(`${baseUrl}/api/tags`, {
    method: "GET",
    timeout: 10000
  });

  if (response.status >= 400) {
    throw new Error(`Failed to list models: ${response.status}`);
  }

  const data = response.data as any;
  return data.models.map(transformModelInfoHelper);
}

async function getModelInfoHelper(baseUrl: string, name: string): Promise<ModelInfo> {
  const response = await httpRequest(`${baseUrl}/api/show`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
    timeout: 10000
  });

  if (response.status >= 400) {
    throw new Error(`Failed to get model info: ${response.status}`);
  }

  const data = response.data as any;
  return transformModelInfoHelper(data);
}

async function checkHealthHelper(baseUrl: string): Promise<boolean> {
  try {
    const response = await httpRequest(`${baseUrl}/api/tags`, {
      method: "GET",
      timeout: 5000
    });
    return response.status < 400;
  } catch {
    return false;
  }
}

async function getVersionHelper(baseUrl: string): Promise<string> {
  const response = await httpRequest(`${baseUrl}/api/version`, {
    method: "GET",
    timeout: 5000
  });

  if (response.status >= 400) {
    throw new Error(`Failed to get version: ${response.status}`);
  }

  const data = response.data as any;
  return data.version || "unknown";
}

function transformMessageHelper(message: Message) {
  return {
    role: message.role,
    content: message.content,
    images: message.images || []
  };
}

function transformModelInfoHelper(model: any): ModelInfo {
  return {
    name: model.name,
    size: model.size || 0,
    digest: model.digest || "",
    capabilities: extractCapabilitiesHelper(model)
  };
}

function extractCapabilitiesHelper(model: any): string[] {
  const caps = [];
  if (model.details?.family?.includes("vision")) caps.push("vision");
  if (model.details?.parameter_size) caps.push("text");
  return caps;
}

export function createOllamaAdapter(baseUrl: string): OllamaAdapter {
  return {
    async processMessage(model, messages, options = {}) {
      return processMessageHelper(baseUrl, model, messages, options);
    },

    async streamMessage(model, messages, onToken) {
      return streamMessageHelper(baseUrl, model, messages, onToken);
    },

    async listModels() {
      return listModelsHelper(baseUrl);
    },

    async getModelInfo(name) {
      return getModelInfoHelper(baseUrl, name);
    },

    async checkHealth() {
      return checkHealthHelper(baseUrl);
    },

    async getVersion() {
      return getVersionHelper(baseUrl);
    }
  };
}
