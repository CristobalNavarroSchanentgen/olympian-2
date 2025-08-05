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
  relevance: number;  // 0-1 relevance score
  timestamp: Date;
  messageIds: string[];  // Messages this context relates to
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
  showContextReferences(
    messageId: string, 
    references: ContextReference[]
  ): Promise<void>;
  
  /**
   * Display topic tracking visualization
   * Contract: seamless topic transitions and reference handling
   */
  displayTopicThreads(threads: TopicThread[]): Promise<void>;
  
  /**
   * Indicate context continuation
   * Contract: AI references previous messages appropriately
   */
  indicateContextContinuation(
    fromMessageId: string, 
    toMessageId: string, 
    continuationType: string
  ): Promise<void>;
  
  /**
   * Show intelligent summarization indicators
   * Contract: older context intelligently summarized when needed
   */
  showSummarizationIndicators(
    summarizedRange: { start: string; end: string }, 
    summary: string
  ): Promise<void>;
  
  /**
   * Display context building visualization
   * Contract: responses build logically on conversation history
   */
  displayContextBuilding(
    messageId: string, 
    contextSources: ContextIndicator[]
  ): Promise<void>;
  
  /**
   * Update context indicators in real-time
   * Contract: understands conversation threads and topic evolution
   */
  updateContextIndicators(
    updates: Partial<ContextIndicator>[]
  ): Promise<void>;
  
  /**
   * Handle context overflow gracefully
   * Contract: transparent context management at token limits
   */
  handleContextOverflow(
    strategy: 'summarize' | 'truncate' | 'compress', 
    affectedRange: { start: string; end: string }
  ): Promise<void>;
  
  /**
   * Provide contextual intelligence feedback
   * Contract: users understand how AI uses conversation history
   */
  provideContextualFeedback(
    messageId: string, 
    intelligenceMetrics: ContextualIntelligenceMetrics
  ): Promise<void>;
  
  /**
   * Validate context indicators against contract requirements
   * Contract: ensure contextual intelligence criteria met
   */
  validateContextIndicators(): Promise<ContextValidationResult>;
}

export interface ContextualIntelligenceMetrics {
  contextRetentionScore: number;     // 0-1 how well context is maintained
  referenceAccuracy: number;        // 0-1 accuracy of references
  topicContinuityScore: number;     // 0-1 topic transition smoothness
  memoryEfficiency: number;         // 0-1 how efficiently context is used
  intelligentSummarization: boolean; // Whether summarization occurred
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
    contextRetention: boolean;         // Full context within limits
    referenceAccuracy: number;        // > 95% accuracy requirement
    topicContinuity: boolean;          // Seamless transitions
  };
  intelligence: {
    contextBuilding: boolean;          // Logical response building
    topicTracking: boolean;            // Thread understanding
    intelligentSummarization: boolean; // Smart context management
  };
  transparency: {
    contextVisibility: boolean;        // Users see context usage
    referenceClarity: boolean;         // Clear reference indicators
    memoryTransparency: boolean;       // Memory status visible
  };
  recommendations?: string[];
}

/**
 * CONTRACT VALIDATION CRITERIA
 */
export const ContextIndicatorsContractValidation = {
  contextualIntelligence: {
    contextRetentionRequired: true,    // Full context maintenance
    referenceAccuracyMin: 0.95,       // > 95% reference accuracy
    topicContinuityRequired: true      // Seamless topic handling
  },
  
  transparency: {
    contextVisibilityRequired: true,   // Users see context usage
    referenceHighlighting: true,       // Clear reference indicators
    memoryStatusRequired: true         // Token usage visibility
  },
  
  intelligence: {
    contextBuildingRequired: true,     // Logical progression
    topicTrackingRequired: true,       // Thread understanding
    smartSummarizationRequired: true   // Intelligent context management
  }
} as const;
