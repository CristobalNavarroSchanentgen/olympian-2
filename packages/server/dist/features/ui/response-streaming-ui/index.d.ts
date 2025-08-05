/**
 * RESPONSE STREAMING UI IMPLEMENTATION
 *
 * Enforces conversation experience requirements for real-time response streaming,
 * typewriter effects, and response time metrics.
 */
import { ResponseStreamingUIContract, StreamingMetrics, TypewriterConfig, StreamingState, StreamingError, RetryOptions, ValidationResult } from './contract';
export declare class ResponseStreamingUI implements ResponseStreamingUIContract {
    private streamingService;
    private activeStreams;
    private typewriterConfig;
    constructor(streamingService: any);
    /**
     * CONTRACT ENFORCEMENT: typing indicator visible within 100ms
     */
    startStreaming(messageId: string, config: TypewriterConfig): Promise<void>;
    processStreamingToken(messageId: string, token: string, isComplete: boolean): Promise<void>;
    completeStreaming(messageId: string, metrics: StreamingMetrics): Promise<void>;
    handleStreamingError(messageId: string, error: StreamingError, retryOptions: RetryOptions): Promise<void>;
    getStreamingState(messageId: string): Promise<StreamingState>;
    updateTypewriterConfig(config: Partial<TypewriterConfig>): Promise<void>;
    validateStreamingPerformance(metrics: StreamingMetrics): Promise<ValidationResult>;
    private applyTypewriterEffect;
    private showTypingIndicator;
    private hideTypingIndicator;
}
export declare function createResponseStreamingUI(streamingService: any): ResponseStreamingUI;
