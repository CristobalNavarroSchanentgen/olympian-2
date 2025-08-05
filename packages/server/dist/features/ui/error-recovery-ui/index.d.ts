/**
 * ERROR RECOVERY UI IMPLEMENTATION
 *
 * Enforces conversation experience requirements for graceful error handling,
 * transparent recovery mechanisms, and maintaining conversation flow continuity.
 */
import { ErrorRecoveryUIContract, ErrorContext, ErrorRecoveryAction, ErrorDisplayState, RecoveryAttempt, ErrorRecoveryValidationResult } from './contract';
export declare class ErrorRecoveryUI implements ErrorRecoveryUIContract {
    private activeErrors;
    private recoveryAttempts;
    private recoveryMetrics;
    constructor();
    /**
     * CONTRACT ENFORCEMENT: > 95% of temporary errors resolved automatically
     */
    handleTransparentError(error: ErrorContext, recoveryActions: ErrorRecoveryAction[]): Promise<RecoveryAttempt>;
    /**
     * CONTRACT ENFORCEMENT: users only see errors they need to act on
     */
    displayUserActionableError(error: ErrorContext, state: ErrorDisplayState): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: temporary network/model errors retry transparently
     */
    executeAutoRetry(errorId: string, maxRetries: number, backoffStrategy: 'linear' | 'exponential'): Promise<RecoveryAttempt>;
    /**
     * CONTRACT ENFORCEMENT: unavailable models automatically fall back to alternatives
     */
    executeFallbackRouting(originalModel: string, fallbackOptions: string[]): Promise<string>;
    /**
     * CONTRACT ENFORCEMENT: features degrade gracefully when services unavailable
     */
    executeGracefulDegradation(unavailableFeatures: string[], alternatives: string[]): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: conversation and settings preserved through errors
     */
    preserveConversationState(conversationId: string, recoveryContext: any): Promise<void>;
    displayActionableErrorMessage(error: ErrorContext, suggestedActions: ErrorRecoveryAction[]): Promise<void>;
    trackRecoveryMetrics(attempt: RecoveryAttempt): Promise<void>;
    validateErrorRecovery(): Promise<ErrorRecoveryValidationResult>;
    private selectBestRecoveryAction;
    private executeRecoveryAction;
    private escalateToUser;
    private generateUserFriendlyMessage;
    private determineDisplayType;
    private renderErrorDisplay;
    private attemptRetry;
    private checkModelAvailability;
    private showFallbackNotification;
    private disableFeature;
    private enableAlternativeFeature;
    private showDegradationNotification;
    private captureConversationState;
    private persistRecoveryContext;
    private generateActionableMessage;
    private renderErrorMessage;
    private trackRecoveryAttempt;
}
export declare function createErrorRecoveryUI(): ErrorRecoveryUI;
