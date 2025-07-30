export interface ReasoningPanelProps {
    visible: boolean;
    content: ReasoningBlock[];
    metadata: ReasoningMetadata;
    isLoading?: boolean;
    showTimestamps?: boolean;
    showWordCount?: boolean;
    expanded?: boolean;
}
export interface ReasoningBlock {
    id: string;
    type: 'planning' | 'step' | 'conclusion' | 'reflection';
    title: string;
    content: string;
    duration?: number;
    timestamp: Date;
    stepNumber?: number;
}
export interface ReasoningMetadata {
    totalDuration: number;
    wordCount: number;
    estimatedReadingTime: number;
    blockCount: number;
    lastUpdated: Date;
}
export interface ReasoningPanelConfig {
    maxBlocks?: number;
    autoExpand?: boolean;
    showDurations?: boolean;
    animateUpdates?: boolean;
    collapsible?: boolean;
}
export interface ReasoningPanelEvents {
    onToggleExpanded: () => void;
    onBlockSelect: (blockId: string) => void;
    onClear: () => void;
    onExport: () => void;
}
//# sourceMappingURL=contract.d.ts.map