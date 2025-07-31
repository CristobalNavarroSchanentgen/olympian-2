// Browser Logger Implementation
// Main implementation of the browser logging system

import { 
  BrowserLoggerContract, 
  BrowserLogEntry, 
  UserInteractionLog, 
  LogCollectionConfig 
} from './contract';
import { createConsoleCapture } from '../../../adapters/features/observability/browser-logger/console-capture-adapter';
import { createErrorCapture } from '../../../adapters/features/observability/browser-logger/error-capture-adapter';
import { createInteractionCapture } from '../../../adapters/features/observability/browser-logger/interaction-capture-adapter';

export class BrowserLogger implements BrowserLoggerContract {
  private config: LogCollectionConfig;
  private logBuffer: BrowserLogEntry[] = [];
  private interactionBuffer: UserInteractionLog[] = [];
  private currentSessionId: string | null = null;
  private flushTimer: NodeJS.Timeout | null = null;
  
  private consoleCapture = createConsoleCapture();
  private errorCapture = createErrorCapture();
  private interactionCapture = createInteractionCapture();

  constructor(initialConfig?: Partial<LogCollectionConfig>) {
    this.config = {
      enabled: true,
      levels: ['debug', 'info', 'warn', 'error'],
      includeUserInteractions: true,
      includeNetworkRequests: false,
      maxBufferSize: 1000,
      flushInterval: 30000, // 30 seconds
      endpoint: '/api/logs',
      ...initialConfig
    };

    this.setupCaptures();
    this.startAutoFlush();
  }

  private setupCaptures(): void {
    if (!this.config.enabled) return;

    // Console capture
    this.consoleCapture.onLog((level, message, data) => {
      if (this.config.levels.includes(level as any)) {
        this.createLogEntry(level as any, message, data, 'console');
      }
    });
    this.consoleCapture.start();

    // Error capture
    this.errorCapture.onError((error, context) => {
      this.createLogEntry('error', error.message, {
        stack: error.stack,
        context
      }, 'error');
    });
    this.errorCapture.start();

    // Interaction capture
    if (this.config.includeUserInteractions) {
      this.interactionCapture.onInteraction((type, element, data) => {
        this.logUserInteraction({
          type: type as any,
          element,
          data
        });
      });
      this.interactionCapture.start();
    }
  }

  private createLogEntry(
    level: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    data?: any,
    source: 'console' | 'network' | 'user-interaction' | 'error' = 'console'
  ): void {
    const entry: BrowserLogEntry = {
      id: this.generateId(),
      timestamp: new Date(),
      level,
      source,
      message,
      data,
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: this.currentSessionId || this.startSession()
    };

    this.logBuffer.push(entry);
    this.maintainBufferSize();
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private maintainBufferSize(): void {
    if (this.logBuffer.length > this.config.maxBufferSize) {
      this.logBuffer.splice(0, this.logBuffer.length - this.config.maxBufferSize);
    }
  }

  private startAutoFlush(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    
    this.flushTimer = setInterval(() => {
      if (this.logBuffer.length > 0) {
        this.flush();
      }
    }, this.config.flushInterval);
  }

  // Public methods implementing BrowserLoggerContract
  log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void {
    this.createLogEntry(level, message, data);
  }

  logUserInteraction(interaction: Omit<UserInteractionLog, 'id' | 'timestamp' | 'sessionId'>): void {
    const fullInteraction: UserInteractionLog = {
      id: this.generateId(),
      timestamp: new Date(),
      sessionId: this.currentSessionId || this.startSession(),
      ...interaction
    };

    this.interactionBuffer.push(fullInteraction);
  }

  logError(error: Error, context?: any): void {
    this.createLogEntry('error', error.message, {
      stack: error.stack,
      context
    }, 'error');
  }

  async flush(): Promise<void> {
    if (this.logBuffer.length === 0) return;

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          logs: this.logBuffer,
          interactions: this.interactionBuffer
        })
      });

      if (response.ok) {
        this.logBuffer = [];
        this.interactionBuffer = [];
      }
    } catch (error) {
      console.warn('Failed to flush logs to server:', error);
    }
  }

  clear(): void {
    this.logBuffer = [];
    this.interactionBuffer = [];
  }

  getBufferedLogs(): BrowserLogEntry[] {
    return [...this.logBuffer];
  }

  configure(config: Partial<LogCollectionConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart captures with new config
    this.consoleCapture.stop();
    this.errorCapture.stop();
    this.interactionCapture.stop();
    
    this.setupCaptures();
    this.startAutoFlush();
  }

  getConfig(): LogCollectionConfig {
    return { ...this.config };
  }

  startSession(): string {
    this.currentSessionId = this.generateId();
    return this.currentSessionId;
  }

  endSession(): void {
    this.flush();
    this.currentSessionId = null;
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  getLogs(filter?: {
    levels?: string[];
    timeRange?: { start: Date; end: Date };
    sources?: string[];
  }): BrowserLogEntry[] {
    let logs = [...this.logBuffer];

    if (filter?.levels) {
      logs = logs.filter(log => filter.levels!.includes(log.level));
    }

    if (filter?.timeRange) {
      logs = logs.filter(log => 
        log.timestamp >= filter.timeRange!.start && 
        log.timestamp <= filter.timeRange!.end
      );
    }

    if (filter?.sources) {
      logs = logs.filter(log => filter.sources!.includes(log.source));
    }

    return logs;
  }

  exportLogs(format: 'json' | 'csv'): string {
    const logs = this.logBuffer;
    
    if (format === 'json') {
      return JSON.stringify(logs, null, 2);
    }
    
    // CSV format
    const headers = ['timestamp', 'level', 'source', 'message', 'sessionId'];
    const csvLines = [headers.join(',')];
    
    logs.forEach(log => {
      const row = [
        log.timestamp.toISOString(),
        log.level,
        log.source,
        JSON.stringify(log.message),
        log.sessionId
      ];
      csvLines.push(row.join(','));
    });
    
    return csvLines.join('\n');
  }
}

export function createBrowserLogger(config?: Partial<LogCollectionConfig>): BrowserLogger {
  return new BrowserLogger(config);
}