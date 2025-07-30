import { DualPaneLayoutProps, LayoutConfig } from '../features/ui/dual-pane-layout/contract';

/**
 * Layout Service Interface
 * 
 * Service contract for layout management operations.
 * Only method signatures, no implementation.
 */
export interface LayoutService {
  /**
   * Load layout configuration from persistence
   */
  loadLayout(): Promise<LayoutConfig | null>;

  /**
   * Save layout configuration to persistence  
   */
  saveLayout(config: LayoutConfig): Promise<boolean>;

  /**
   * Get current layout state
   */
  getCurrentLayout(): DualPaneLayoutProps;

  /**
   * Update layout state
   */
  updateLayout(updates: Partial<DualPaneLayoutProps>): Promise<DualPaneLayoutProps>;

  /**
   * Reset layout to defaults
   */
  resetLayout(): Promise<DualPaneLayoutProps>;

  /**
   * Toggle specific layout panels
   */
  togglePanel(panel: 'conversation' | 'codeEditor' | 'reasoning'): Promise<DualPaneLayoutProps>;
}
