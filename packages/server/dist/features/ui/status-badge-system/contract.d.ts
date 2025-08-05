/**
 * STATUS BADGE SYSTEM CONTRACT
 *
 * Enforces conversation experience requirements for visual status indicators,
 * response type badges, and transparent metadata display.
 *
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: transparentReasoning, smartContentManagement, fluidInteractionFlow
 */
export interface BadgeType {
    type: 'reasoning' | 'artifact' | 'model' | 'error' | 'streaming' | 'context';
    priority: 'low' | 'medium' | 'high' | 'critical';
    persistent: boolean;
    dismissible: boolean;
}
export interface StatusBadge {
    id: string;
    type: BadgeType['type'];
    label: string;
    color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
    icon?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
    duration?: number;
}
export interface ModelInfoBadge extends StatusBadge {
    type: 'model';
    modelName: string;
    modelType: 'text' | 'vision' | 'multimodal';
    tokensUsed?: number;
    estimatedCost?: number;
    responseTime?: number;
}
export interface StatusBadgeSystemContract {
    /**
     * Display model information badge
     * Contract: 100% of responses show model used and token consumption
     */
    showModelBadge(messageId: string, modelInfo: ModelInfoBadge): Promise<void>;
    /**
     * Display reasoning availability badge
     * Contract: reasoning badge appears for 100% of reasoning-capable models
     */
    showReasoningBadge(messageId: string, reasoningInfo: any): Promise<void>;
    /**
     * Display artifact generation badge
     * Contract: 100% of artifact-generating responses trigger badge display
     */
    showArtifactBadge(messageId: string, artifactInfo: any): Promise<void>;
    /**
     * Display streaming status badge
     * Contract: streaming badge visible within 100ms of response start
     */
    showStreamingBadge(messageId: string, streamingInfo: StatusBadge): Promise<void>;
    /**
     * Update badge with new information
     */
    updateBadge(badgeId: string, updates: Partial<StatusBadge>): Promise<void>;
    /**
     * Remove badge when no longer relevant
     */
    dismissBadge(badgeId: string, animation?: 'fade' | 'slide' | 'instant'): Promise<void>;
    /**
     * Get all active badges for a message
     */
    getMessageBadges(messageId: string): Promise<StatusBadge[]>;
}
