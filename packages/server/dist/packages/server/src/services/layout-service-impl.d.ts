import { LayoutService } from '@olympian/shared/services/layout-service';
import { DualPaneLayoutProps, LayoutConfig } from '@olympian/shared/features/ui/dual-pane-layout/contract';
/**
 * Layout Service Implementation
 * Handles UI layout configuration and preferences
 */
export declare class LayoutServiceImpl implements LayoutService {
    private layouts;
    private currentLayout;
    constructor();
    loadLayout(): Promise<LayoutConfig | null>;
    saveLayout(config: LayoutConfig): Promise<boolean>;
    getCurrentLayout(): DualPaneLayoutProps;
    updateLayout(updates: Partial<DualPaneLayoutProps>): Promise<DualPaneLayoutProps>;
    resetLayout(): Promise<DualPaneLayoutProps>;
    togglePanel(panel: 'conversation' | 'codeEditor' | 'reasoning'): Promise<DualPaneLayoutProps>;
}
