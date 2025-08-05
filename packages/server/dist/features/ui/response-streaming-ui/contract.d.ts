/**
 * RESPONSE STREAMING UI CONTRACT
 *
 * Enforces conversation experience requirements for real-time response streaming,
 * typewriter effects, and response time metrics as defined in the conversation experience contract.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: naturalCommunication, fluidInteractionFlow
 */
export interface StreamingMetrics {
    responseStartTime: number;
    firstTokenTime: number;
    streamingReliability: number;
    tokensPerSecond: number;
    totalDuration: number;
}
export interface TypewriterConfig {
    enabled: boolean;
    speed: number;
    minDelay: number;
    maxDelay: number;
    pauseOnPunctuation: number;
}
export interface StreamingState {
    isStreaming: boolean;
    currentToken: string;
    accumulatedContent: string;
    estimatedCompletionTime?: number;
    progress?: number;
}
export interface ResponseStreamingUIContract {
    /**
     * CONVERSATION EXPERIENCE ENFORCEMENT
     * Ensures response time with immediate feedback
     */
    /**
     * Start streaming response with immediate visual feedback
     * Contract: typing indicator visible within 100ms
     */
    startStreaming(messageId: string, config: TypewriterConfig): Promise<void>;
    /**
     * Process streaming token with typewriter effect
     * Contract: smooth character-by-character display
     */
    processStreamingToken(messageId: string, token: string, isComplete: boolean): Promise<void>;
    /**
     * Complete streaming with metrics validation
     * Contract: validate against conversation experience success metrics
     */
    completeStreaming(messageId: string, metrics: StreamingMetrics): Promise<void>;
    /**
     * Handle streaming errors gracefully
     * Contract: maintain conversation flow without jarring interruptions
     */
    handleStreamingError(messageId: string, error: StreamingError, retryOptions: RetryOptions): Promise<void>;
    /**
     * Get real-time streaming state
     * Contract: provide transparency into response generation
     */
    getStreamingState(messageId: string): Promise<StreamingState>;
    /**
     * Update typewriter configuration
     * Contract: allow user customization of streaming experience
     */
    updateTypewriterConfig(config: Partial<TypewriterConfig>): Promise<void>;
    /**
     * Validate streaming performance against contract metrics
     * Contract: ensure conversation experience success criteria met
     */
    validateStreamingPerformance(metrics: StreamingMetrics): Promise<ValidationResult>;
}
export interface StreamingError {
    type: "network" | "model" | "timeout" | "quota" | "unknown";
    message: string;
    recoverable: boolean;
    suggestedAction?: string;
}
export interface RetryOptions {
    maxRetries: number;
    backoffStrategy: "linear" | "exponential";
    fallbackModel?: string;
    gracefulDegradation: boolean;
}
export interface ValidationResult {
    meetsContract: boolean;
    metrics: {
        responseTimeCompliance: boolean;
        streamingReliability: boolean;
        typingIndicatorSpeed: boolean;
    };
    recommendations?: string[];
}
/**
 * CONTRACT VALIDATION CRITERIA
 * Based on conversation experience success metrics
 */
export declare const StreamingUIContractValidation: {
    readonly responseTime: {
        readonly typingIndicatorMax: 100;
        readonly firstTokenMax: 2000;
        readonly streamingReliabilityMin: 0.99;
    };
    readonly typewriterEffect: {
        readonly smoothnessRequired: true;
        readonly pauseOnPunctuation: true;
        readonly progressIndicator: true;
    };
    readonly errorRecovery: {
        readonly gracefulDegradation: true;
        readonly automaticRetry: true;
        readonly fallbackModel: true;
    };
};
