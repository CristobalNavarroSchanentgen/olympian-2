/**
 * MCP execution result model - pure types only
 */

export interface ExecutionResult {
  readonly id: string;
  readonly toolName: string;
  readonly success: boolean;
  readonly result?: unknown;
  readonly error?: ExecutionError;
  readonly startTime: Date;
  readonly endTime: Date;
  readonly duration: number;
}

export interface ExecutionError {
  readonly code: string;
  readonly message: string;
  readonly details?: Record<string, unknown>;
}

export interface ExecutionContext {
  readonly invocationId: string;
  readonly serverName: string;
  readonly timeout: number;
  readonly retryCount: number;
}

export interface ExecutionStats {
  readonly totalInvocations: number;
  readonly successCount: number;
  readonly errorCount: number;
  readonly averageDuration: number;
  readonly toolUsage: Record<string, number>;
}

export interface ExecutionHistory {
  readonly results: ExecutionResult[];
  readonly stats: ExecutionStats;
  readonly timeRange: {
    readonly start: Date;
    readonly end: Date;
  };
}
