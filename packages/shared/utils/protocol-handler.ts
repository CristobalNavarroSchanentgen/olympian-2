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
