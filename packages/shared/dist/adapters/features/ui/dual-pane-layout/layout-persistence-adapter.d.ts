import { DualPaneLayoutProps, LayoutConfig } from '../../../features/ui/dual-pane-layout';
/**
 * Layout Persistence Adapter
 *
 * Transforms between browser localStorage and layout configuration.
 * Under 100 lines, pure transformation logic.
 */
export declare class LayoutPersistenceAdapter {
    private readonly storageKey;
    /**
     * Load layout configuration from browser storage
     */
    loadLayoutConfig(): LayoutConfig | null;
    /**
     * Save layout configuration to browser storage
     */
    saveLayoutConfig(config: LayoutConfig): boolean;
    /**
     * Convert layout props to persistable config
     */
    layoutPropsToConfig(props: DualPaneLayoutProps): LayoutConfig;
    /**
     * Clear stored layout configuration
     */
    clearLayoutConfig(): boolean;
    private validateLayoutConfig;
}
//# sourceMappingURL=layout-persistence-adapter.d.ts.map