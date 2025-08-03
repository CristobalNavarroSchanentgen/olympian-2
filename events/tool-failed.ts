/**
 * Tool Failed Event
 * Emitted when a tool execution fails
 */

export interface ToolFailedEvent {
  toolName: string;
  serverId: string;
  requestId: string;
  error: string;
  errorCode?: string;
  timestamp: Date;
  executionTime: number;
}
