export interface ConsoleInterceptor {
    start(): void;
    stop(): void;
    onLog(callback: (level: string, message: string, data?: any) => void): void;
}
export declare function createConsoleCapture(): ConsoleInterceptor;
