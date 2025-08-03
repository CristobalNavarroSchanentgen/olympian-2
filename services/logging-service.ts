// Logging Service Interface
// Synchronous service contract for cross-feature logging communication

import { BrowserLogEntry, UserInteractionLog } from '../features/observability/browser-logger/contract';

export interface LoggingService {
  // Log aggregation
  aggregateLogs(sources: ('browser' | 'server' | 'database')[]): Promise<BrowserLogEntry[]>;
  
  // Real-time log streaming
  streamLogs(callback: (log: BrowserLogEntry) => void): () => void;
  
  // Log filtering and search
  searchLogs(query: string, options?: {
    timeRange?: { start: Date; end: Date };
    levels?: string[];
    sources?: string[];
  }): Promise<BrowserLogEntry[]>;
  
  // System health monitoring
  getLogStats(): Promise<{
    totalLogs: number;
    errorCount: number;
    warningCount: number;
    lastLogTime: Date;
  }>;
}

