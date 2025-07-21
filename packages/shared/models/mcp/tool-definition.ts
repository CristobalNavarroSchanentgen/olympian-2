/**
 * MCP Tool Definition Models
 */

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: ToolParameter[];
  serverId: string;
  capabilities: string[];
  metadata: Record<string, unknown>;
}
