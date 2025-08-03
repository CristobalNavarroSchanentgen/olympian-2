import { LayoutService } from '@olympian/shared/services/layout-service';
import { DualPaneLayoutProps, LayoutConfig } from '@olympian/shared/features/ui/dual-pane-layout/contract';

/**
 * Layout Service Implementation
 * Handles UI layout configuration and preferences
 */
export class LayoutServiceImpl implements LayoutService {
  private layouts = new Map<string, LayoutConfig>();
  private currentLayout: DualPaneLayoutProps;

  constructor() {
    // Initialize with default layout
    this.currentLayout = {
      sidebarOpen: true,
      conversationPanelWidth: 50,
      codeEditorOpen: true,
      reasoningPanelOpen: false,
      theme: 'light'
    };
  }

  async loadLayout(): Promise<LayoutConfig | null> {
    return this.layouts.get('default') || null;
  }

  async saveLayout(config: LayoutConfig): Promise<boolean> {
    this.layouts.set('default', config);
    return true;
  }

  getCurrentLayout(): DualPaneLayoutProps {
    return { ...this.currentLayout };
  }

  async updateLayout(updates: Partial<DualPaneLayoutProps>): Promise<DualPaneLayoutProps> {
    this.currentLayout = { ...this.currentLayout, ...updates };
    return { ...this.currentLayout };
  }

  async resetLayout(): Promise<DualPaneLayoutProps> {
    this.currentLayout = {
      sidebarOpen: true,
      conversationPanelWidth: 50,
      codeEditorOpen: true,
      reasoningPanelOpen: false,
      theme: 'light'
    };
    return { ...this.currentLayout };
  }

  async togglePanel(panel: 'conversation' | 'codeEditor' | 'reasoning'): Promise<DualPaneLayoutProps> {
    switch (panel) {
      case 'conversation':
        this.currentLayout.sidebarOpen = !this.currentLayout.sidebarOpen;
        break;
      case 'codeEditor':
        this.currentLayout.codeEditorOpen = !this.currentLayout.codeEditorOpen;
        break;
      case 'reasoning':
        this.currentLayout.reasoningPanelOpen = !this.currentLayout.reasoningPanelOpen;
        break;
    }
    return { ...this.currentLayout };
  }
}
