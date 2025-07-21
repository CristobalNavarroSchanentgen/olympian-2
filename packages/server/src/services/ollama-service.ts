import axios, { AxiosInstance } from 'axios';

interface OllamaModel {
  name: string;
  size: number;
  digest: string;
  modified_at: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  images?: string[];
}

interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
}

interface ChatResponse {
  model: string;
  created_at: string;
  message: {
    role: string;
    content: string;
    tool_calls?: any[];
  };
  done: boolean;
}

export class OllamaService {
  private client: AxiosInstance;
  private connected = false;
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.client = axios.create({
      baseURL: this.baseUrl,
      timeout: 60000
    });
    
    this.testConnection();
  }

  private async testConnection(): Promise<void> {
    try {
      await this.client.get('/api/tags');
      this.connected = true;
      console.log('🦙 Connected to Ollama');
    } catch (error) {
      this.connected = false;
      console.error('❌ Failed to connect to Ollama');
    }
  }

  isConnected(): boolean {
    return this.connected;
  }

  async getModels(): Promise<OllamaModel[]> {
    try {
      const response = await this.client.get('/api/tags');
      return response.data.models || [];
    } catch (error) {
      return [];
    }
  }

  async *streamChat(request: ChatRequest): AsyncGenerator<ChatResponse> {
    try {
      const response = await this.client.post('/api/chat', {
        ...request,
        stream: true
      }, {
        responseType: 'stream'
      });

      let buffer = '';
      
      for await (const chunk of response.data) {
        buffer += chunk.toString();
        
        const lines = buffer.split('
');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim()) {
            try {
              const data = JSON.parse(line);
              yield data as ChatResponse;
            } catch (parseError) {
              console.warn('Failed to parse chunk:', parseError);
            }
          }
        }
      }
    } catch (error) {
      throw new Error('Chat streaming failed');
    }
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await this.client.post('/api/chat', {
        ...request,
        stream: false
      });
      
      return response.data;
    } catch (error) {
      throw new Error('Chat failed');
    }
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }
}
