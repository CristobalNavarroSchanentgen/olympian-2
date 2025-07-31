export interface BrowserLogEntry {
    id: string;
    timestamp: Date;
    level: 'debug' | 'info' | 'warn' | 'error';
    source: 'console' | 'network' | 'user-interaction' | 'error';
    message: string;
    data?: any;
    stackTrace?: string;
    url?: string;
    userAgent?: string;
    sessionId: string;
}
export interface UserInteractionLog {
    id: string;
    timestamp: Date;
    type: 'click' | 'scroll' | 'navigation' | 'form-submit' | 'key-press';
    element?: string;
    coordinates?: {
        x: number;
        y: number;
    };
    data?: any;
    sessionId: string;
}
export interface LogCollectionConfig {
    enabled: boolean;
    levels: ('debug' | 'info' | 'warn' | 'error')[];
    includeUserInteractions: boolean;
    includeNetworkRequests: boolean;
    maxBufferSize: number;
    flushInterval: number;
    endpoint: string;
}
export interface BrowserLoggerContract {
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
export interface LogTransmissionService {
    sendLogs(logs: BrowserLogEntry[]): Promise<void>;
    sendUserInteractions(interactions: UserInteractionLog[]): Promise<void>;
}
export interface LogStorageService {
    saveLogs(logs: BrowserLogEntry[]): Promise<void>;
    retrieveLogs(sessionId: string): Promise<BrowserLogEntry[]>;
    clearOldLogs(olderThan: Date): Promise<void>;
}
