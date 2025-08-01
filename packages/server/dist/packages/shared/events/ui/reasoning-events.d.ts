import { ReasoningBlock, ReasoningPanelProps } from '../../features/ui/reasoning-panel/contract';
/**
 * Reasoning Events
 *
 * Event definitions for reasoning panel changes.
 * Message structures only, no logic.
 */
export interface ReasoningBlockAddedEvent {
    type: 'reasoning-block-added';
    payload: {
        block: ReasoningBlock;
        panelState: ReasoningPanelProps;
        timestamp: Date;
    };
}
export interface ReasoningBlockUpdatedEvent {
    type: 'reasoning-block-updated';
    payload: {
        blockId: string;
        updates: Partial<ReasoningBlock>;
        panelState: ReasoningPanelProps;
        timestamp: Date;
    };
}
export interface ReasoningBlockRemovedEvent {
    type: 'reasoning-block-removed';
    payload: {
        blockId: string;
        panelState: ReasoningPanelProps;
        timestamp: Date;
    };
}
export interface ReasoningPanelToggledEvent {
    type: 'reasoning-panel-toggled';
    payload: {
        visible: boolean;
        expanded: boolean;
        panelState: ReasoningPanelProps;
        timestamp: Date;
    };
}
export interface ReasoningClearedEvent {
    type: 'reasoning-cleared';
    payload: {
        previousBlockCount: number;
        panelState: ReasoningPanelProps;
        timestamp: Date;
    };
}
export interface ReasoningExportedEvent {
    type: 'reasoning-exported';
    payload: {
        format: 'text' | 'json' | 'markdown';
        content: string;
        blockCount: number;
        timestamp: Date;
    };
}
export type ReasoningEvent = ReasoningBlockAddedEvent | ReasoningBlockUpdatedEvent | ReasoningBlockRemovedEvent | ReasoningPanelToggledEvent | ReasoningClearedEvent | ReasoningExportedEvent;
