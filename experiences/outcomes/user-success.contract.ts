/**
 * User Outcome Success Contract
 * Defines measurable success criteria for user experiences
 */

export interface UserOutcomeContract {
  // Primary Success Metrics
  
  /**
   * User achieves their development goal
   * Measure: Task completion rate, time to solution
   */
  trackTaskCompletion(session: UserSession): Promise<CompletionMetrics>;
  
  /**
   * User gains knowledge and capability
   * Measure: Learning indicators, repeat question patterns
   */
  trackLearningOutcomes(interactions: UserInteraction[]): Promise<LearningMetrics>;
  
  /**
   * User experiences flow state, not friction
   * Measure: Interaction smoothness, error recovery
   */
  trackExperienceQuality(session: UserSession): Promise<QualityMetrics>;
  
  /**
   * User trusts AI recommendations
   * Measure: Adoption rate of suggestions, feedback sentiment
   */
  trackTrustBuilding(recommendations: AIRecommendation[]): Promise<TrustMetrics>;
}

export interface CompletionMetrics {
  taskCompleted: boolean;
  timeToCompletion: number;
  iterationsNeeded: number;
  userSatisfaction: number;
  goalClarity: number;
}

export interface LearningMetrics {
  newConceptsIntroduced: string[];
  knowledgeRetention: number;
  skillDevelopment: SkillGrowth[];
  confidenceIncrease: number;
}

export interface QualityMetrics {
  frictionPoints: FrictionEvent[];
  flowMaintained: boolean;
  errorRecoveryTime: number;
  userEffort: 'low' | 'medium' | 'high';
}

export interface TrustMetrics {
  recommendationAccuracy: number;
  userAdoptionRate: number;
  feedbackSentiment: 'positive' | 'neutral' | 'negative';
  repeatUsage: boolean;
}

export interface SkillGrowth {
  skill: string;
  beforeLevel: number;
  afterLevel: number;
  evidence: string[];
}
