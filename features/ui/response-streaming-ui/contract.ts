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

import { Message } from @olympian/shared/models/chat/message;

export interface StreamingMetrics {
  responseStartTime: number;        // < 100ms typing indicator requirement
  firstTokenTime: number;          // < 2s response time requirement  
  streamingReliability: number;    // > 99% streaming uptime requirement
  tokensPerSecond: number;         // Performance tracking
  totalDuration: number;           // Full response time
}

export interface TypewriterConfig {
  enabled: boolean;
  speed: number;                   // Characters per frame
  minDelay: number;               // Minimum delay between characters (ms)
  maxDelay: number;               // Maximum delay for dramatic effect (ms)
  pauseOnPunctuation: number;     // Extra delay on sentences (ms)
}

export interface StreamingState {
  isStreaming: boolean;
  currentToken: string;
  accumulatedContent: string;
  estimatedCompletionTime?: number;
  progress?: number;              // 0-1 completion estimate
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
  processStreamingToken(
    messageId: string, 
    token: string, 
    isComplete: boolean
  ): Promise<void>;
  
  /**
   * Complete streaming with metrics validation
   * Contract: validate against conversation experience success metrics
   */
  completeStreaming(
    messageId: string, 
    metrics: StreamingMetrics
  ): Promise<void>;
  
  /**
   * Handle streaming errors gracefully
   * Contract: maintain conversation flow without jarring interruptions
   */
  handleStreamingError(
    messageId: string, 
    error: StreamingError, 
    retryOptions: RetryOptions
  ): Promise<void>;
  
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
  type: network | model | timeout | quota | unknown;
  message: string;
  recoverable: boolean;
  suggestedAction?: string;
}

export interface RetryOptions {
  maxRetries: number;
  backoffStrategy: linear | exponential;
  fallbackModel?: string;
  gracefulDegradation: boolean;
}

export interface ValidationResult {
  meetsContract: boolean;
  metrics: {
    responseTimeCompliance: boolean;    // requirement
    streamingReliability: boolean;      // > 99% requirement  
    typingIndicatorSpeed: boolean;      // < 100ms requirement
  };
  recommendations?: string[];
}

/**
 * CONTRACT VALIDATION CRITERIA
 * Based on conversation experience success metrics
 */
export const StreamingUIContractValidation = {
  responseTime: {
    typingIndicatorMax: 100,      // ms - immediate feedback requirement
    firstTokenMax: 2000,          // ms - response time
    streamingReliabilityMin: 0.99 // 99% uptime requirement
  },
  
  typewriterEffect: {
    smoothnessRequired: true,      // No jarring character jumps
    pauseOnPunctuation: true,      // Natural reading rhythm
    progressIndicator: true        // User can see completion progress
  },
  
  errorRecovery: {
    gracefulDegradation: true,     // Maintain conversation flow
    automaticRetry: true,          // Transparent error recovery
    fallbackModel: true           // Model availability backup
  }
} as const;
