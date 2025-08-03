/**
 * Server Stopped Event
 * Emitted when an MCP server is stopped
 */

export interface ServerStoppedEvent {
  serverId: string;
  serverName: string;
  timestamp: Date;
  reason: string;
  uptime: number;
}
