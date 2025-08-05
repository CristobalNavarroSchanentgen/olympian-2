export interface ErrorCaptureHandler {
    start(): void;
    stop(): void;
    onError(callback: (error: Error, context?: any) => void): void;
}
export declare function createErrorCapture(): ErrorCaptureHandler;
