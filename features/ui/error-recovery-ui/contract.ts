/**
 * ERROR RECOVERY UI CONTRACT
 * 
 * Enforces conversation experience requirements for graceful error handling,
 * transparent recovery mechanisms, and maintaining conversation flow continuity.
 * 
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: robustErrorHandling
 */

export interface ErrorContext {
  messageId: string;
  conversationId: string;
  errorType: 'network' | 'model' | 'timeout' | 'quota' | 'validation' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoverable: boolean;
  userActionRequired: boolean;
}

export interface ErrorRecoveryAction {
  id: string;
  label: string;
  description: string;
  action: 'retry' | 'fallback' | 'ignore' | 'report' | 'configure';
  estimated_success_rate: number;
  side_effects?: string[];
}

export interface ErrorDisplayState {
  visible: boolean;
  type: 'toast' | 'inline' | 'modal' | 'banner';
  message: string;
  actions: ErrorRecoveryAction[];
  autoRetryCountdown?: number;
  dismissible: boolean;
}

export interface RecoveryAttempt {
  attemptId: string;
  errorId: string;
  strategy: 'transparent_retry' | 'fallback_model' | 'graceful_degradation' | 'user_intervention';
  timestamp: Date;
  success: boolean;
  duration: number;
}

export interface ErrorRecoveryUIContract {
  /**
   * CONVERSATION EXPERIENCE ENFORCEMENT
   * Ensures transparent error recovery without disrupting user workflow
   */
  
  /**
   * Handle errors transparently with automatic recovery
   * Contract: > 95% of temporary errors resolved automatically
   */
  handleTransparentError(
    error: ErrorContext, 
    recoveryActions: ErrorRecoveryAction[]
  ): Promise<RecoveryAttempt>;
  
  /**
   * Display error information only when user action is needed
   * Contract: users only see errors they need to act on
   */
  displayUserActionableError(
    error: ErrorContext, 
    state: ErrorDisplayState
  ): Promise<void>;
  
  /**
   * Implement automatic retry with visual feedback
   * Contract: temporary network/model errors retry transparently
   */
  executeAutoRetry(
    errorId: string, 
    maxRetries: number, 
    backoffStrategy: 'linear' | 'exponential'
  ): Promise<RecoveryAttempt>;
  
  /**
   * Implement model fallback routing
   * Contract: unavailable models automatically fall back to alternatives
   */
  executeFallbackRouting(
    originalModel: string, 
    fallbackOptions: string[]
  ): Promise<string>;
  
  /**
   * Implement graceful feature degradation
   * Contract: features degrade gracefully when services unavailable
   */
  executeGracefulDegradation(
    unavailableFeatures: string[], 
    alternatives: string[]
  ): Promise<void>;
  
  /**
   * Preserve conversation state during recovery
   * Contract: conversation and settings preserved through errors
   */
  preserveConversationState(
    conversationId: string, 
    recoveryContext: any
  ): Promise<void>;
  
  /**
   * Display clear actionable error messages
   * Contract: actionable error messages when user intervention needed
   */
  displayActionableErrorMessage(
    error: ErrorContext, 
    suggestedActions: ErrorRecoveryAction[]
  ): Promise<void>;
  
  /**
   * Track error recovery metrics
   * Contract: monitor recovery success rates
   */
  trackRecoveryMetrics(attempt: RecoveryAttempt): Promise<void>;
  
  /**
   * Validate error recovery against contract requirements
   * Contract: ensure robust error handling criteria met
   */
  validateErrorRecovery(): Promise<ErrorRecoveryValidationResult>;
}

export interface ErrorRecoveryPreferences {
  enableAutoRetry: boolean;
  maxAutoRetries: number;
  showTransparentRecovery: boolean;
  fallbackModelsEnabled: boolean;
  gracefulDegradationEnabled: boolean;
  errorReportingEnabled: boolean;
  recoveryNotificationsLevel: 'none' | 'errors_only' | 'all';
}

export interface ErrorRecoveryValidationResult {
  meetsContract: boolean;
  recovery: {
    automaticRecoveryRate: number;     // Should be > 95%
    userErrorVisibility: boolean;      // Only actionable errors shown
    conversationContinuity: boolean;   // State preserved
  };
  transparency: {
    transparentRetries: boolean;       // Hidden from user
    fallbackRouting: boolean;          // Automatic model switching
    gracefulDegradation: boolean;      // Features degrade smoothly
  };
  userExperience: {
    workflowDisruption: boolean;       // Minimal interruption
    actionableMessages: boolean;       // Clear error communication
    statePersistence: boolean;         // Settings preserved
  };
  recommendations?: string[];
}

/**
 * CONTRACT VALIDATION CRITERIA
 */
export const ErrorRecoveryContractValidation = {
  automation: {
    transparentRecoveryRate: 0.95,     // > 95% automatic recovery
    userVisibleErrorsMax: 0.05,        // < 5% require user action
    statePreservationRequired: true    // Conversation state maintained
  },
  
  transparency: {
    transparentRetriesRequired: true,  // Hidden recovery attempts
    fallbackRoutingRequired: true,     // Automatic model switching
    gracefulDegradationRequired: true  // Smooth feature degradation
  },
  
  usability: {
    minimalDisruption: true,           // Workflow continuity
    actionableMessaging: true,         // Clear error communication
    persistentSettings: true           // User preferences maintained
  }
} as const;
