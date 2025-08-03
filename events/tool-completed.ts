/**
 * Tool Completed Event
 * Emitted when a tool execution completes successfully
 */

export interface ToolCompletedEvent {
  toolName: string;
  serverId: string;
  requestId: string;
  result: any;
  timestamp: Date;
  executionTime: number;
}
