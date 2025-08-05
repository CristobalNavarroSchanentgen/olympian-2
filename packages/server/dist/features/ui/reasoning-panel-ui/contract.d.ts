/**
 * REASONING PANEL UI CONTRACT
 *
 * Enforces conversation experience requirements for transparent AI reasoning display,
 * milestone tracking, and reasoning exploration controls.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: transparentReasoning
 */
export interface ReasoningMilestone {
    id: string;
    type: 'planning' | 'analysis' | 'synthesis' | 'verification' | 'conclusion';
    title: string;
    content: string;
    timestamp: Date;
    duration?: number;
    confidence?: number;
    relatedContext?: string[];
}
export interface ReasoningSession {
    messageId: string;
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    milestones: ReasoningMilestone[];
    totalDuration: number;
    wordCount: number;
    estimatedReadingTime: number;
    complexity: 'low' | 'medium' | 'high' | 'expert';
}
export interface ReasoningDisplayState {
    visible: boolean;
    expanded: boolean;
    milestoneView: 'linear' | 'tree' | 'timeline';
    highlightedMilestone?: string;
    animationSpeed: 'slow' | 'normal' | 'fast' | 'instant';
}
export interface ReasoningPanelUIContract {
    /**
     * CONVERSATION EXPERIENCE ENFORCEMENT
     * Ensures 100% reasoning availability with clear milestone tracking
     */
    /**
     * Initialize reasoning panel for reasoning-capable models
     * Contract: reasoning panel appears for 100% of reasoning-capable models
     */
    initializeReasoningPanel(messageId: string, session: ReasoningSession): Promise<void>;
    /**
     * Add reasoning milestone with smooth animation
     * Contract: reasoning broken into clear, understandable milestones
     */
    addReasoningMilestone(sessionId: string, milestone: ReasoningMilestone): Promise<void>;
    /**
     * Toggle reasoning panel visibility
     * Contract: instant show/hide of reasoning sections
     */
    toggleReasoningVisibility(sessionId: string): Promise<void>;
    /**
     * Expand/collapse reasoning content
     * Contract: reasoning content can be expanded/collapsed
     */
    toggleReasoningExpansion(sessionId: string): Promise<void>;
    /**
     * Navigate to specific reasoning milestone
     * Contract: clear reasoning milestones and progression
     */
    navigateToMilestone(sessionId: string, milestoneId: string): Promise<void>;
    /**
     * Update reasoning display preferences
     * Contract: easy toggle to hide reasoning when not needed
     */
    updateDisplayPreferences(preferences: ReasoningDisplayPreferences): Promise<void>;
    /**
     * Complete reasoning session
     * Contract: clear indication of reasoning completion
     */
    completeReasoningSession(sessionId: string, summary: ReasoningSummary): Promise<void>;
    /**
     * Validate reasoning display against contract requirements
     * Contract: ensure transparent reasoning criteria met
     */
    validateReasoningDisplay(sessionId: string): Promise<ReasoningValidationResult>;
    /**
     * Get reasoning session state
     * Contract: provide complete reasoning transparency
     */
    getReasoningState(sessionId: string): Promise<ReasoningDisplayState>;
}
export interface ReasoningDisplayPreferences {
    defaultVisible: boolean;
    defaultExpanded: boolean;
    showMilestoneProgress: boolean;
    showTimestamps: boolean;
    showDuration: boolean;
    showConfidence: boolean;
    milestoneViewType: 'linear' | 'tree' | 'timeline';
    autoScroll: boolean;
    animationEnabled: boolean;
}
export interface ReasoningSummary {
    totalMilestones: number;
    thinkingDuration: number;
    complexityAssessment: string;
    keyInsights: string[];
    confidenceLevel: number;
    reasoningQuality: 'excellent' | 'good' | 'adequate' | 'poor';
}
export interface ReasoningValidationResult {
    meetsContract: boolean;
    criteria: {
        reasoningAvailable: boolean;
        reasoningClarity: boolean;
        toggleResponsiveness: boolean;
        milestoneTracking: boolean;
    };
    userExperience: {
        trustBuilding: boolean;
        understandability: boolean;
        controlProvided: boolean;
    };
    recommendations?: string[];
}
/**
 * CONTRACT VALIDATION CRITERIA
 */
export declare const ReasoningPanelContractValidation: {
    readonly availability: {
        readonly reasoningModelsSupported: 1;
        readonly instantToggle: true;
        readonly milestoneClarity: true;
    };
    readonly userExperience: {
        readonly trustBuilding: true;
        readonly nonIntrusive: true;
        readonly informative: true;
        readonly navigable: true;
    };
};
