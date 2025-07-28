/**
 * Protocol Handler Utility
 */

export interface McpMessage {
  id: string;
  method: string;
  params: Record<string, unknown>;
}

export interface McpResponse {
  id: string;
  result?: unknown;
  error?: {
    code: number;
    message: string;
  };
}

export function parseMessage(data: string): McpMessage | null {
  try {
    const parsed = JSON.parse(data);
    return parsed;
  } catch {
    return null;
  }
}

export function formatMessage(message: McpMessage): string {
  return JSON.stringify(message);
}

export function createRequest(method: string, params: Record<string, unknown>): McpMessage {
  return {
    id: Date.now().toString(),
    method,
    params
  };
}

export interface ProtocolMessage {
  id: string;
  method: string;
  params?: Record<string, unknown>;
  timestamp: Date;
}

export interface ProtocolResponse {
  id: string;
  result?: unknown;
  error?: string;
  timestamp: Date;
}

export interface ProtocolHandler {
  sendMessage(message: ProtocolMessage): Promise<void>;
  handleResponse(response: ProtocolResponse): void;
  onMessage(callback: (message: ProtocolMessage) => void): void;
}

export function createProtocolHandler(): ProtocolHandler {
  const messageCallbacks: Array<(message: ProtocolMessage) => void> = [];
  
  return {
    async sendMessage(message: ProtocolMessage): Promise<void> {
      // Mock implementation
      await new Promise(resolve => setTimeout(resolve, 10));
    },
    
    handleResponse(response: ProtocolResponse): void {
      // Mock implementation
    },
    
    onMessage(callback: (message: ProtocolMessage) => void): void {
      messageCallbacks.push(callback);
    }
  };
}
