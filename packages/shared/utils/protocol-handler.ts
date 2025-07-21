/**
 * MCP protocol handling utility - pure functions
 */

export interface McpMessage {
  readonly jsonrpc: '2.0';
  readonly id?: string | number;
  readonly method?: string;
  readonly params?: unknown;
  readonly result?: unknown;
  readonly error?: McpError;
}

export interface McpError {
  readonly code: number;
  readonly message: string;
  readonly data?: unknown;
}

export interface McpRequest extends McpMessage {
  readonly method: string;
  readonly params?: unknown;
}

export interface McpResponse extends McpMessage {
  readonly id: string | number;
  readonly result?: unknown;
  readonly error?: McpError;
}

/**
 * Create MCP request message
 */
export function createRequest(
  method: string,
  params?: unknown,
  id?: string | number
): McpRequest {
  return {
    jsonrpc: '2.0',
    id: id || generateId(),
    method,
    params
  };
}

/**
 * Create MCP response message
 */
export function createResponse(
  id: string | number,
  result?: unknown,
  error?: McpError
): McpResponse {
  return {
    jsonrpc: '2.0',
    id,
    result,
    error
  };
}

/**
 * Parse MCP message from JSON
 */
export function parseMessage(json: string): McpMessage | null {
  try {
    const data = JSON.parse(json);
    if (isValidMcpMessage(data)) {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Serialize MCP message to JSON
 */
export function serializeMessage(message: McpMessage): string {
  return JSON.stringify(message);
}

/**
 * Check if message is a request
 */
export function isRequest(message: McpMessage): message is McpRequest {
  return 'method' in message && typeof message.method === 'string';
}

/**
 * Check if message is a response
 */
export function isResponse(message: McpMessage): message is McpResponse {
  return 'id' in message && !('method' in message);
}

/**
 * Check if message is an error response
 */
export function isErrorResponse(message: McpMessage): boolean {
  return isResponse(message) && 'error' in message && message.error != null;
}

/**
 * Create standardized tool call request
 */
export function createToolCall(
  toolName: string,
  arguments_: Record<string, unknown>
): McpRequest {
  return createRequest('tools/call', {
    name: toolName,
    arguments: arguments_
  });
}

/**
 * Create list tools request
 */
export function createListToolsRequest(): McpRequest {
  return createRequest('tools/list');
}

/**
 * Create initialization request
 */
export function createInitRequest(
  protocolVersion: string,
  clientInfo: { name: string; version: string }
): McpRequest {
  return createRequest('initialize', {
    protocolVersion,
    clientInfo,
    capabilities: {}
  });
}

function isValidMcpMessage(data: any): data is McpMessage {
  return (
    data &&
    typeof data === 'object' &&
    data.jsonrpc === '2.0' &&
    (typeof data.id === 'string' || typeof data.id === 'number' || data.id === undefined)
  );
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}
