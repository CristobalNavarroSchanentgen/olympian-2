/**
 * Tool invoked event
 */

export interface ToolInvokedEvent {
  readonly type: 'tool-invoked';
  readonly toolName: string;
  readonly serverName: string;
  readonly invocationId: string;
  readonly arguments: Record<string, unknown>;
  readonly timestamp: Date;
  readonly metadata: {
    readonly conversationId?: string;
    readonly messageId?: string;
    readonly timeout: number;
    readonly retryCount: number;
  };
}

export function createToolInvokedEvent(
  toolName: string,
  serverName: string,
  invocationId: string,
  arguments_: Record<string, unknown>,
  timeout: number,
  retryCount = 0,
  conversationId?: string,
  messageId?: string
): ToolInvokedEvent {
  return {
    type: 'tool-invoked',
    toolName,
    serverName,
    invocationId,
    arguments: arguments_,
    timestamp: new Date(),
    metadata: {
      conversationId,
      messageId,
      timeout,
      retryCount
    }
  };
}
