/**
 * MCP Tool Execution Result Models
 */

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

export type ExecutionError = {
  code: string;
  message: string;
  details?: Record<string, unknown>;
};

export interface ExecutionResult {
  id: string;
  toolName: string;
  serverId: string;
  status: ExecutionStatus;
  result?: unknown;
  error?: ExecutionError;
  duration: number;
  startedAt: Date;
  completedAt?: Date;
  metadata: Record<string, unknown>;
}
