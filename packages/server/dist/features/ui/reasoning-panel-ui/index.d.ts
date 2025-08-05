/**
 * REASONING PANEL UI IMPLEMENTATION
 */
import { ReasoningPanelUIContract, ReasoningSession, ReasoningMilestone, ReasoningDisplayState, ReasoningValidationResult } from './contract';
export declare class ReasoningPanelUI implements ReasoningPanelUIContract {
    private activeSessions;
    private displayStates;
    initializeReasoningPanel(messageId: string, session: ReasoningSession): Promise<void>;
    addReasoningMilestone(sessionId: string, milestone: ReasoningMilestone): Promise<void>;
    toggleReasoningVisibility(sessionId: string): Promise<void>;
    toggleReasoningExpansion(sessionId: string): Promise<void>;
    navigateToMilestone(sessionId: string, milestoneId: string): Promise<void>;
    updateDisplayPreferences(preferences: any): Promise<void>;
    completeReasoningSession(sessionId: string, summary: any): Promise<void>;
    validateReasoningDisplay(sessionId: string): Promise<ReasoningValidationResult>;
    getReasoningState(sessionId: string): Promise<ReasoningDisplayState>;
    private renderMilestone;
    private renderVisibilityToggle;
    private renderExpansionToggle;
    private renderMilestoneHighlight;
    private renderSessionCompletion;
}
export declare function createReasoningPanelUI(): ReasoningPanelUI;
