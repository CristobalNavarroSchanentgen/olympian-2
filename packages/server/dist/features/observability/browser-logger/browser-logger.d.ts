import { BrowserLoggerContract, BrowserLogEntry, UserInteractionLog, LogCollectionConfig } from './contract';
export declare class BrowserLogger implements BrowserLoggerContract {
    private config;
    private logBuffer;
    private interactionBuffer;
    private currentSessionId;
    private flushTimer;
    private consoleCapture;
    private errorCapture;
    private interactionCapture;
    constructor(initialConfig?: Partial<LogCollectionConfig>);
    private setupCaptures;
    private createLogEntry;
    private generateId;
    private maintainBufferSize;
    private startAutoFlush;
    log(level: 'debug' | 'info' | 'warn' | 'error', message: string, data?: any): void;
    logUserInteraction(interaction: Omit<UserInteractionLog, 'id' | 'timestamp' | 'sessionId'>): void;
    logError(error: Error, context?: any): void;
    flush(): Promise<void>;
    clear(): void;
    getBufferedLogs(): BrowserLogEntry[];
    configure(config: Partial<LogCollectionConfig>): void;
    getConfig(): LogCollectionConfig;
    startSession(): string;
    endSession(): void;
    getCurrentSessionId(): string | null;
    getLogs(filter?: {
        levels?: string[];
        timeRange?: {
            start: Date;
            end: Date;
        };
        sources?: string[];
    }): BrowserLogEntry[];
    exportLogs(format: 'json' | 'csv'): string;
}
export declare function createBrowserLogger(config?: Partial<LogCollectionConfig>): BrowserLogger;
