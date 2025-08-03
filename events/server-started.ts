/**
 * Server Started Event
 * Emitted when an MCP server is started
 */

export interface ServerStartedEvent {
  serverId: string;
  serverName: string;
  serverType: string;
  timestamp: Date;
  capabilities: string[];
}
