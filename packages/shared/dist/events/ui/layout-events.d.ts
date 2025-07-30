import { DualPaneLayoutProps } from '../../features/ui/dual-pane-layout/contract';
/**
 * Layout Events
 *
 * Event definitions for layout-related changes.
 * Message structures only, no logic.
 */
export interface LayoutUpdatedEvent {
    type: 'layout-updated';
    payload: {
        layout: DualPaneLayoutProps;
        timestamp: Date;
        source: 'user' | 'system' | 'persistence';
    };
}
export interface PanelToggledEvent {
    type: 'panel-toggled';
    payload: {
        panel: 'conversation' | 'codeEditor' | 'reasoning';
        visible: boolean;
        layout: DualPaneLayoutProps;
        timestamp: Date;
    };
}
export interface LayoutResetEvent {
    type: 'layout-reset';
    payload: {
        previousLayout: DualPaneLayoutProps;
        newLayout: DualPaneLayoutProps;
        timestamp: Date;
    };
}
export interface LayoutPersistedEvent {
    type: 'layout-persisted';
    payload: {
        success: boolean;
        layout: DualPaneLayoutProps;
        timestamp: Date;
    };
}
export type LayoutEvent = LayoutUpdatedEvent | PanelToggledEvent | LayoutResetEvent | LayoutPersistedEvent;
//# sourceMappingURL=layout-events.d.ts.map