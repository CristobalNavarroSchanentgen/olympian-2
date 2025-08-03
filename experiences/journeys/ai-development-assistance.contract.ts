/**
 * AI-Assisted Development Journey Contract
 * Defines the complete user experience for AI-powered development workflows
 */

export interface DevelopmentJourneyContract {
  // Core User Goal: Get expert AI assistance for development tasks
  
  /**
   * User enters with a development problem or question
   * Success: User feels confident the AI understands their context
   */
  initiateHelpRequest(context: DevelopmentContext): Promise<ContextAcknowledgment>;
  
  /**
   * AI provides iterative assistance with tool integration
   * Success: User receives actionable, accurate guidance
   */
  receiveGuidance(request: UserRequest): Promise<GuidanceResponse>;
  
  /**
   * User applies suggestions and provides feedback
   * Success: AI learns and adapts to user's working style
   */
  applyAndIterate(feedback: UserFeedback): Promise<RefinedGuidance>;
  
  /**
   * User completes their development task
   * Success: User achieved their goal faster/better than alone
   */
  completeTask(): Promise<TaskOutcome>;
}

export interface DevelopmentContext {
  projectType: string;
  currentChallenge: string;
  technicalStack: string[];
  timeConstraints?: string;
  experienceLevel: 'beginner' | 'intermediate' | 'expert';
}

export interface ContextAcknowledgment {
  understoodGoal: string;
  suggestedApproach: string;
  requiredTools: string[];
  estimatedComplexity: 'simple' | 'moderate' | 'complex';
}

export interface UserRequest {
  type: 'question' | 'code-review' | 'implementation' | 'debugging';
  details: string;
  artifacts?: string[];
}

export interface GuidanceResponse {
  explanation: string;
  actionableSteps: string[];
  codeExamples?: string[];
  toolRecommendations: string[];
  nextSteps: string[];
}

export interface TaskOutcome {
  goalAchieved: boolean;
  timeToCompletion: number;
  userSatisfaction: number; // 1-10
  learningGained: string[];
  futureImprovements: string[];
}
