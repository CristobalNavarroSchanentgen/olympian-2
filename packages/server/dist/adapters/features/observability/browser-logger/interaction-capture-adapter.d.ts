export interface InteractionCaptureHandler {
    start(): void;
    stop(): void;
    onInteraction(callback: (type: string, element?: string, data?: any) => void): void;
}
export declare function createInteractionCapture(): InteractionCaptureHandler;
