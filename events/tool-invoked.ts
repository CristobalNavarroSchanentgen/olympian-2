/**
 * Tool Invoked Event
 * Emitted when a tool is invoked
 */

export interface ToolInvokedEvent {
  toolName: string;
  serverId: string;
  parameters: Record<string, any>;
  timestamp: Date;
  requestId: string;
}
