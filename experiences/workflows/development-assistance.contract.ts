/**
 * Cross-Feature Workflow Contract
 * Defines how features must coordinate to achieve user goals
 */

export interface DevelopmentWorkflowContract {
  /**
   * Intelligent Conversation Flow
   * Features: conversation-manager + message-processor + smart-model-router + memory-manager
   */
  orchestrateIntelligentChat(userInput: UserInput): Promise<WorkflowResult>;
  
  /**
   * Integrated Tool Assistance
   * Features: tool-executor + conversation-manager + artifact-manager
   */
  orchestrateToolIntegration(toolRequest: ToolRequest): Promise<WorkflowResult>;
  
  /**
   * Adaptive Model Selection
   * Features: smart-model-router + text-model-selector + vision-model-selector
   */
  orchestrateModelOptimization(content: ContentAnalysis): Promise<WorkflowResult>;
  
  /**
   * Persistent Knowledge Building
   * Features: memory-manager + artifact-manager + conversation-manager
   */
  orchestrateKnowledgeCapture(session: UserSession): Promise<WorkflowResult>;
}

export interface WorkflowResult {
  success: boolean;
  userValueDelivered: string;
  featuresCoordinated: string[];
  nextRecommendedActions: string[];
  qualityMetrics: QualityIndicators;
}

export interface QualityIndicators {
  responseRelevance: number;
  actionability: number;
  userEffortRequired: 'minimal' | 'moderate' | 'significant';
  goalAlignment: number;
}

// Workflow Coordination Rules
export interface CoordinationRules {
  /**
   * When user asks complex question:
   * 1. Smart-model-router analyzes content complexity
   * 2. Memory-manager provides relevant context
   * 3. Message-processor routes to appropriate model
   * 4. Tool-executor triggers if external data needed
   * 5. Artifact-manager captures reusable outputs
   */
  complexQuestionFlow: WorkflowStep[];
  
  /**
   * When user uploads images:
   * 1. Vision-model-selector activates automatically
   * 2. Content analysis triggers appropriate processing
   * 3. Results integrate with ongoing conversation
   * 4. Artifacts created for visual outputs
   */
  visualContentFlow: WorkflowStep[];
  
  /**
   * When context grows large:
   * 1. Memory-manager triggers optimization
   * 2. Conversation-manager preserves key insights
   * 3. User experience remains uninterrupted
   */
  contextOptimizationFlow: WorkflowStep[];
}

export interface WorkflowStep {
  feature: string;
  action: string;
  trigger: string;
  expectedOutcome: string;
  fallbackStrategy: string;
}
