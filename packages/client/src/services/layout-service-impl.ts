import { LayoutService } from '@olympian/shared/services/layout-service';
import { DualPaneLayoutProps, LayoutConfig } from '@olympian/shared/features/ui/dual-pane-layout/contract';
import { layoutPersistenceAdapter } from '@olympian/shared/adapters/features/ui/dual-pane-layout/layout-persistence-adapter';

/**
 * LayoutService Implementation
 * 
 * Implements the LayoutService interface for frontend layout management.
 * Uses adapters for persistence and maintains layout state.
 */
class LayoutServiceImpl implements LayoutService {
  private currentLayout: DualPaneLayoutProps = {
    sidebarOpen: false,
    conversationPanelWidth: 50,
    codeEditorOpen: false,
    reasoningPanelOpen: false,
    theme: 'dark'
  };

  async loadLayout(): Promise<LayoutConfig | null> {
    try {
      return await layoutPersistenceAdapter.load();
    } catch (error) {
      console.error('Failed to load layout:', error);
      return null;
    }
  }

  async saveLayout(config: LayoutConfig): Promise<boolean> {
    try {
      await layoutPersistenceAdapter.save(config);
      return true;
    } catch (error) {
      console.error('Failed to save layout:', error);
      return false;
    }
  }

  getCurrentLayout(): DualPaneLayoutProps {
    return { ...this.currentLayout };
  }

  async updateLayout(updates: Partial<DualPaneLayoutProps>): Promise<DualPaneLayoutProps> {
    this.currentLayout = { ...this.currentLayout, ...updates };
    
    // Persist the changes
    await this.saveLayout({
      sidebarOpen: this.currentLayout.sidebarOpen,
      conversationPanelWidth: this.currentLayout.conversationPanelWidth,
      codeEditorOpen: this.currentLayout.codeEditorOpen,
      reasoningPanelOpen: this.currentLayout.reasoningPanelOpen,
      theme: this.currentLayout.theme
    });

    return this.getCurrentLayout();
  }

  async resetLayout(): Promise<DualPaneLayoutProps> {
    const defaultLayout: DualPaneLayoutProps = {
      sidebarOpen: false,
      conversationPanelWidth: 50,
      codeEditorOpen: false,
      reasoningPanelOpen: false,
      theme: 'dark'
    };

    this.currentLayout = defaultLayout;
    await this.saveLayout(defaultLayout);
    
    return this.getCurrentLayout();
  }

  async togglePanel(panel: 'conversation' | 'codeEditor' | 'reasoning'): Promise<DualPaneLayoutProps> {
    const updates: Partial<DualPaneLayoutProps> = {};

    switch (panel) {
      case 'codeEditor':
        updates.codeEditorOpen = !this.currentLayout.codeEditorOpen;
        break;
      case 'reasoning':
        updates.reasoningPanelOpen = !this.currentLayout.reasoningPanelOpen;
        break;
      // conversation panel is always open, only width changes
    }

    return await this.updateLayout(updates);
  }
}

// Export singleton instance
export const layoutService = new LayoutServiceImpl();
