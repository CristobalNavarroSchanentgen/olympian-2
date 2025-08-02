/**
 * AI-Native Reasoning Panel Feature
 *
 * Manages reasoning content display and interaction.
 * Tracks reasoning blocks, metadata, and panel state.
 */
export class ReasoningPanelFeature {
    panelState;
    config;
    constructor(config = {}) {
        this.config = {
            maxBlocks: config.maxBlocks ?? 50,
            autoExpand: config.autoExpand ?? true,
            showDurations: config.showDurations ?? true,
            animateUpdates: config.animateUpdates ?? true,
            collapsible: config.collapsible ?? true,
        };
        this.panelState = {
            visible: false,
            content: [],
            metadata: this.createEmptyMetadata(),
            isLoading: false,
            showTimestamps: this.config.showDurations,
            showWordCount: true,
            expanded: this.config.autoExpand,
        };
    }
    /**
     * Get current panel props for rendering
     */
    getPanelProps() {
        return { ...this.panelState };
    }
    /**
     * Add a new reasoning block
     */
    addBlock(block) {
        const newBlock = {
            ...block,
            id: this.generateBlockId(),
            timestamp: new Date(),
            stepNumber: this.panelState.content.length + 1,
        };
        // Add block and enforce max limit
        this.panelState.content.push(newBlock);
        if (this.panelState.content.length > this.config.maxBlocks) {
            this.panelState.content = this.panelState.content.slice(-this.config.maxBlocks);
            this.updateStepNumbers();
        }
        this.updateMetadata();
        // Auto-expand if configured
        if (this.config.autoExpand && !this.panelState.expanded) {
            this.panelState.expanded = true;
        }
        return this.getPanelProps();
    }
    /**
     * Update an existing reasoning block
     */
    updateBlock(blockId, updates) {
        const blockIndex = this.panelState.content.findIndex(block => block.id === blockId);
        if (blockIndex !== -1) {
            this.panelState.content[blockIndex] = {
                ...this.panelState.content[blockIndex],
                ...updates,
            };
            this.updateMetadata();
        }
        return this.getPanelProps();
    }
    /**
     * Remove a reasoning block
     */
    removeBlock(blockId) {
        this.panelState.content = this.panelState.content.filter(block => block.id !== blockId);
        this.updateStepNumbers();
        this.updateMetadata();
        return this.getPanelProps();
    }
    /**
     * Clear all reasoning blocks
     */
    clearBlocks() {
        this.panelState.content = [];
        this.panelState.metadata = this.createEmptyMetadata();
        return this.getPanelProps();
    }
    /**
     * Toggle panel visibility
     */
    toggleVisibility() {
        this.panelState.visible = !this.panelState.visible;
        return this.getPanelProps();
    }
    /**
     * Toggle panel expanded state
     */
    toggleExpanded() {
        if (this.config.collapsible) {
            this.panelState.expanded = !this.panelState.expanded;
        }
        return this.getPanelProps();
    }
    /**
     * Set loading state
     */
    setLoading(isLoading) {
        this.panelState.isLoading = isLoading;
        return this.getPanelProps();
    }
    /**
     * Show the panel with content
     */
    show() {
        this.panelState.visible = true;
        return this.getPanelProps();
    }
    /**
     * Hide the panel
     */
    hide() {
        this.panelState.visible = false;
        return this.getPanelProps();
    }
    /**
     * Get reasoning content as text for export
     */
    exportAsText() {
        if (this.panelState.content.length === 0) {
            return 'No reasoning content available.';
        }
        const header = `Reasoning Export - ${new Date().toISOString()}\n`;
        const metadata = `Blocks: ${this.panelState.metadata.blockCount}, Duration: ${this.panelState.metadata.totalDuration}ms, Words: ${this.panelState.metadata.wordCount}\n\n`;
        const content = this.panelState.content
            .map(block => `${block.stepNumber}. [${block.type.toUpperCase()}] ${block.title}\n${block.content}\n`)
            .join('\n');
        return header + metadata + content;
    }
    generateBlockId() {
        return `reasoning-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    updateStepNumbers() {
        this.panelState.content.forEach((block, index) => {
            block.stepNumber = index + 1;
        });
    }
    updateMetadata() {
        const now = new Date();
        const totalDuration = this.panelState.content.reduce((sum, block) => sum + (block.duration || 0), 0);
        const wordCount = this.panelState.content.reduce((sum, block) => sum + this.countWords(block.content), 0);
        this.panelState.metadata = {
            totalDuration,
            wordCount,
            estimatedReadingTime: Math.ceil(wordCount / 200), // 200 words per minute
            blockCount: this.panelState.content.length,
            lastUpdated: now,
        };
    }
    countWords(text) {
        return text.trim().split(/\s+/).filter(word => word.length > 0).length;
    }
    createEmptyMetadata() {
        return {
            totalDuration: 0,
            wordCount: 0,
            estimatedReadingTime: 0,
            blockCount: 0,
            lastUpdated: new Date(),
        };
    }
}
//# sourceMappingURL=index.js.map