import { ReasoningPanelProps, ReasoningBlock, ReasoningPanelConfig } from '../features/ui/reasoning-panel/contract';
/**
 * Reasoning Service Interface
 *
 * Service contract for reasoning panel operations.
 * Only method signatures, no implementation.
 */
export interface ReasoningService {
    /**
     * Get current reasoning panel state
     */
    getReasoningPanel(): ReasoningPanelProps;
    /**
     * Add a new reasoning block
     */
    addReasoningBlock(block: Omit<ReasoningBlock, 'id' | 'timestamp' | 'stepNumber'>): Promise<ReasoningPanelProps>;
    /**
     * Update existing reasoning block
     */
    updateReasoningBlock(blockId: string, updates: Partial<ReasoningBlock>): Promise<ReasoningPanelProps>;
    /**
     * Remove reasoning block
     */
    removeReasoningBlock(blockId: string): Promise<ReasoningPanelProps>;
    /**
     * Clear all reasoning blocks
     */
    clearReasoning(): Promise<ReasoningPanelProps>;
    /**
     * Toggle reasoning panel visibility
     */
    toggleReasoningPanel(): Promise<ReasoningPanelProps>;
    /**
     * Process raw reasoning data into blocks
     */
    processReasoningData(data: string | any): Promise<ReasoningBlock[]>;
    /**
     * Export reasoning content
     */
    exportReasoning(): Promise<string>;
    /**
     * Configure reasoning panel
     */
    configurePanel(config: Partial<ReasoningPanelConfig>): Promise<ReasoningPanelProps>;
}
//# sourceMappingURL=reasoning-service.d.ts.map