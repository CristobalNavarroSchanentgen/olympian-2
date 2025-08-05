/**
 * STATUS BADGE SYSTEM IMPLEMENTATION
 *
 * Enforces conversation experience requirements for visual status indicators,
 * response type badges, and transparent metadata display.
 */
import { StatusBadgeSystemContract, StatusBadge, ModelInfoBadge } from './contract';
export declare class StatusBadgeSystem implements StatusBadgeSystemContract {
    private activeBadges;
    private badgePreferences;
    constructor();
    /**
     * CONTRACT ENFORCEMENT: 100% of responses show model used and token consumption
     */
    showModelBadge(messageId: string, modelInfo: ModelInfoBadge): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: reasoning badge appears for 100% of reasoning-capable models
     */
    showReasoningBadge(messageId: string, reasoningInfo: any): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: 100% of artifact-generating responses trigger badge display
     */
    showArtifactBadge(messageId: string, artifactInfo: any): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: streaming badge visible within 100ms of response start
     */
    showStreamingBadge(messageId: string, streamingInfo: StatusBadge): Promise<void>;
    showErrorBadge(messageId: string, errorInfo: StatusBadge): Promise<void>;
    updateBadge(badgeId: string, updates: Partial<StatusBadge>): Promise<void>;
    dismissBadge(badgeId: string, animation?: 'fade' | 'slide' | 'instant'): Promise<void>;
    getMessageBadges(messageId: string): Promise<StatusBadge[]>;
    private addBadgeToMessage;
    private renderBadge;
    private renderBadgeUpdate;
    private renderBadgeRemoval;
}
export declare function createStatusBadgeSystem(): StatusBadgeSystem;
