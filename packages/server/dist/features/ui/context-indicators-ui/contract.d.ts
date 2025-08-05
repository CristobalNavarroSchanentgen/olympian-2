/**
 * CONTEXT INDICATORS UI CONTRACT
 *
 * Enforces conversation experience requirements for contextual awareness visualization,
 * conversation memory indicators, and topic tracking displays.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: contextualIntelligence
 */
export interface ContextIndicator {
    id: string;
    type: 'memory' | 'topic' | 'reference' | 'continuation' | 'summary';
    content: string;
    relevance: number;
    timestamp: Date;
    messageIds: string[];
    visual: {
        color: 'blue' | 'green' | 'yellow' | 'purple' | 'gray';
        icon: string;
        position: 'inline' | 'sidebar' | 'tooltip';
        priority: 'low' | 'medium' | 'high';
    };
}
export interface ConversationMemoryState {
    activeContextTokens: number;
    totalTokensUsed: number;
    tokenBudgetRemaining: number;
    memoryCleanupThreshold: number;
    contextSummary: string;
    recentTopics: string[];
    keyReferences: ContextReference[];
}
export interface ContextReference {
    messageId: string;
    snippet: string;
    referenceType: 'direct_quote' | 'paraphrase' | 'topic_continuation' | 'concept_reference';
    confidence: number;
    timestamp: Date;
}
export interface TopicThread {
    id: string;
    title: string;
    startMessageId: string;
    endMessageId?: string;
    messageCount: number;
    keywordRelevance: Record<string, number>;
    evolutionPath: string[];
    currentStatus: 'active' | 'dormant' | 'concluded';
}
export interface ContextIndicatorsUIContract {
    /**
     * CONVERSATION EXPERIENCE ENFORCEMENT
     * Ensures transparent context awareness and intelligent reference handling
     */
    /**
     * Display conversation memory status
     * Contract: maintains full conversation context within token limits
     */
    displayMemoryStatus(memoryState: ConversationMemoryState): Promise<void>;
    /**
     * Show context reference indicators
     * Contract: > 95% accuracy when referencing previous messages
     */
    showContextReferences(messageId: string, references: ContextReference[]): Promise<void>;
    /**
     * Display topic tracking visualization
     * Contract: seamless topic transitions and reference handling
     */
    displayTopicThreads(threads: TopicThread[]): Promise<void>;
    /**
     * Indicate context continuation
     * Contract: AI references previous messages appropriately
     */
    indicateContextContinuation(fromMessageId: string, toMessageId: string, continuationType: string): Promise<void>;
    /**
     * Show intelligent summarization indicators
     * Contract: older context intelligently summarized when needed
     */
    showSummarizationIndicators(summarizedRange: {
        start: string;
        end: string;
    }, summary: string): Promise<void>;
    /**
     * Display context building visualization
     * Contract: responses build logically on conversation history
     */
    displayContextBuilding(messageId: string, contextSources: ContextIndicator[]): Promise<void>;
    /**
     * Update context indicators in real-time
     * Contract: understands conversation threads and topic evolution
     */
    updateContextIndicators(updates: Partial<ContextIndicator>[]): Promise<void>;
    /**
     * Handle context overflow gracefully
     * Contract: transparent context management at token limits
     */
    handleContextOverflow(strategy: 'summarize' | 'truncate' | 'compress', affectedRange: {
        start: string;
        end: string;
    }): Promise<void>;
    /**
     * Provide contextual intelligence feedback
     * Contract: users understand how AI uses conversation history
     */
    provideContextualFeedback(messageId: string, intelligenceMetrics: ContextualIntelligenceMetrics): Promise<void>;
    /**
     * Validate context indicators against contract requirements
     * Contract: ensure contextual intelligence criteria met
     */
    validateContextIndicators(): Promise<ContextValidationResult>;
}
export interface ContextualIntelligenceMetrics {
    contextRetentionScore: number;
    referenceAccuracy: number;
    topicContinuityScore: number;
    memoryEfficiency: number;
    intelligentSummarization: boolean;
}
export interface ContextIndicatorPreferences {
    showMemoryStatus: boolean;
    showContextReferences: boolean;
    showTopicThreads: boolean;
    showSummarization: boolean;
    contextVisualizationLevel: 'minimal' | 'normal' | 'detailed';
    referenceHighlighting: boolean;
    topicEvolutionTracking: boolean;
    memoryUsageWarnings: boolean;
}
export interface ContextValidationResult {
    meetsContract: boolean;
    contextualAwareness: {
        contextRetention: boolean;
        referenceAccuracy: number;
        topicContinuity: boolean;
    };
    intelligence: {
        contextBuilding: boolean;
        topicTracking: boolean;
        intelligentSummarization: boolean;
    };
    transparency: {
        contextVisibility: boolean;
        referenceClarity: boolean;
        memoryTransparency: boolean;
    };
    recommendations?: string[];
}
/**
 * CONTRACT VALIDATION CRITERIA
 */
export declare const ContextIndicatorsContractValidation: {
    readonly contextualIntelligence: {
        readonly contextRetentionRequired: true;
        readonly referenceAccuracyMin: 0.95;
        readonly topicContinuityRequired: true;
    };
    readonly transparency: {
        readonly contextVisibilityRequired: true;
        readonly referenceHighlighting: true;
        readonly memoryStatusRequired: true;
    };
    readonly intelligence: {
        readonly contextBuildingRequired: true;
        readonly topicTrackingRequired: true;
        readonly smartSummarizationRequired: true;
    };
};
