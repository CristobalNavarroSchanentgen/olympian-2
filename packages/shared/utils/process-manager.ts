/**
 * Process management utility - pure functions for process operations
 */

import { ProcessStatus } from '../models/mcp/server-config.js';

export interface ProcessInfo {
  readonly pid: number;
  readonly command: string;
  readonly args: string[];
  readonly startTime: Date;
  readonly status: ProcessStatus;
}

export interface ProcessOptions {
  readonly cwd?: string;
  readonly env?: Record<string, string>;
  readonly timeout?: number;
  readonly maxRetries?: number;
}

export interface ProcessEvent {
  readonly type: 'start' | 'stop' | 'error' | 'restart';
  readonly pid?: number;
  readonly timestamp: Date;
  readonly data?: unknown;
}

/**
 * Generate process command from config
 */
export function buildProcessCommand(
  command: string,
  args: string[],
  options: ProcessOptions = {}
): ProcessCommand {
  return {
    command,
    args: [...args],
    options: {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...options.env },
      timeout: options.timeout || 30000,
      maxRetries: options.maxRetries || 3
    }
  };
}

export interface ProcessCommand {
  readonly command: string;
  readonly args: string[];
  readonly options: {
    readonly cwd: string;
    readonly env: Record<string, string>;
    readonly timeout: number;
    readonly maxRetries: number;
  };
}

/**
 * Calculate process uptime
 */
export function calculateUptime(startTime: Date): number {
  return Date.now() - startTime.getTime();
}

/**
 * Determine if process should restart
 */
export function shouldRestart(
  restartCount: number,
  maxRetries: number,
  lastError?: string
): boolean {
  if (restartCount >= maxRetries) {
    return false;
  }
  
  // Don't restart for certain error types
  if (lastError?.includes('ENOENT') || lastError?.includes('permission denied')) {
    return false;
  }
  
  return true;
}

/**
 * Calculate restart delay with exponential backoff
 */
export function calculateRestartDelay(restartCount: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds
  
  const delay = baseDelay * Math.pow(2, restartCount);
  return Math.min(delay, maxDelay);
}

/**
 * Parse process status from exit code
 */
export function parseExitStatus(
  exitCode: number | null,
  signal: string | null
): ProcessStatus {
  if (exitCode === null && signal === null) {
    return 'running';
  }
  
  if (signal) {
    return signal === 'SIGTERM' ? 'stopped' : 'crashed';
  }
  
  return exitCode === 0 ? 'stopped' : 'error';
}

/**
 * Validate process configuration
 */
export function validateProcessConfig(
  command: string,
  args: string[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!command || command.trim().length === 0) {
    errors.push('Command cannot be empty');
  }
  
  if (!Array.isArray(args)) {
    errors.push('Arguments must be an array');
  }
  
  if (args.some(arg => typeof arg !== 'string')) {
    errors.push('All arguments must be strings');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
