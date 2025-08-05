import { ReasoningPanelProps, ReasoningBlock, ReasoningPanelConfig } from './contract';
/**
 * AI-Native Reasoning Panel Feature
 *
 * Manages reasoning content display and interaction.
 * Tracks reasoning blocks, metadata, and panel state.
 */
export declare class ReasoningPanelFeature {
    private panelState;
    private config;
    constructor(config?: ReasoningPanelConfig);
    /**
     * Get current panel props for rendering
     */
    getPanelProps(): ReasoningPanelProps;
    /**
     * Add a new reasoning block
     */
    addBlock(block: Omit<ReasoningBlock, 'id' | 'timestamp' | 'stepNumber'>): ReasoningPanelProps;
    /**
     * Update an existing reasoning block
     */
    updateBlock(blockId: string, updates: Partial<ReasoningBlock>): ReasoningPanelProps;
    /**
     * Remove a reasoning block
     */
    removeBlock(blockId: string): ReasoningPanelProps;
    /**
     * Clear all reasoning blocks
     */
    clearBlocks(): ReasoningPanelProps;
    /**
     * Toggle panel visibility
     */
    toggleVisibility(): ReasoningPanelProps;
    /**
     * Toggle panel expanded state
     */
    toggleExpanded(): ReasoningPanelProps;
    /**
     * Set loading state
     */
    setLoading(isLoading: boolean): ReasoningPanelProps;
    /**
     * Show the panel with content
     */
    show(): ReasoningPanelProps;
    /**
     * Hide the panel
     */
    hide(): ReasoningPanelProps;
    /**
     * Get reasoning content as text for export
     */
    exportAsText(): string;
    private generateBlockId;
    private updateStepNumbers;
    private updateMetadata;
    private countWords;
    private createEmptyMetadata;
}
//# sourceMappingURL=index.d.ts.map