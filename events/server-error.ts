/**
 * Server Error Event
 * Emitted when an MCP server encounters an error
 */

export interface ServerErrorEvent {
  serverId: string;
  serverName: string;
  error: string;
  errorCode?: string;
  timestamp: Date;
  severity: "warning" | "error" | "critical";
}
