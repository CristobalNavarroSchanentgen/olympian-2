import { LayoutService } from '@olympian/shared/services/layout-service';
import { DualPaneLayoutProps, LayoutConfig } from '@olympian/shared/features/ui/dual-pane-layout/contract';
import { layoutPersistenceAdapter } from '@olympian/shared/adapters/features/ui/dual-pane-layout/layout-persistence-adapter';
import { eventBus } from '@olympian/shared/utils/event-bus';
import { 
  LayoutUpdatedEvent, 
  PanelToggledEvent, 
  LayoutResetEvent, 
  LayoutPersistedEvent 
} from '@olympian/shared/events/ui/layout-events';

/**
 * LayoutService Implementation with Event Publishing
 * 
 * Implements the LayoutService interface for frontend layout management.
 * Uses adapters for persistence and publishes events for all operations.
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
      
      // Publish persistence event
      const event: LayoutPersistedEvent = {
        type: 'layout-persisted',
        payload: {
          success: true,
          layout: this.currentLayout,
          timestamp: new Date()
        }
      };
      await eventBus.publish(event);
      
      return true;
    } catch (error) {
      console.error('Failed to save layout:', error);
      
      // Publish failure event
      const event: LayoutPersistedEvent = {
        type: 'layout-persisted',
        payload: {
          success: false,
          layout: this.currentLayout,
          timestamp: new Date()
        }
      };
      await eventBus.publish(event);
      
      return false;
    }
  }

  getCurrentLayout(): DualPaneLayoutProps {
    return { ...this.currentLayout };
  }

  async updateLayout(updates: Partial<DualPaneLayoutProps>): Promise<DualPaneLayoutProps> {
    const previousLayout = { ...this.currentLayout };
    this.currentLayout = { ...this.currentLayout, ...updates };
    
    // Persist the changes
    await this.saveLayout({
      sidebarOpen: this.currentLayout.sidebarOpen,
      conversationPanelWidth: this.currentLayout.conversationPanelWidth,
      codeEditorOpen: this.currentLayout.codeEditorOpen,
      reasoningPanelOpen: this.currentLayout.reasoningPanelOpen,
      theme: this.currentLayout.theme
    });

    // Publish layout updated event
    const event: LayoutUpdatedEvent = {
      type: 'layout-updated',
      payload: {
        layout: this.currentLayout,
        timestamp: new Date(),
        source: 'user'
      }
    };
    await eventBus.publish(event);

    return this.getCurrentLayout();
  }

  async resetLayout(): Promise<DualPaneLayoutProps> {
    const previousLayout = { ...this.currentLayout };
    const defaultLayout: DualPaneLayoutProps = {
      sidebarOpen: false,
      conversationPanelWidth: 50,
      codeEditorOpen: false,
      reasoningPanelOpen: false,
      theme: 'dark'
    };

    this.currentLayout = defaultLayout;
    await this.saveLayout(defaultLayout);
    
    // Publish reset event
    const event: LayoutResetEvent = {
      type: 'layout-reset',
      payload: {
        previousLayout,
        newLayout: this.currentLayout,
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return this.getCurrentLayout();
  }

  async togglePanel(panel: 'conversation' | 'codeEditor' | 'reasoning'): Promise<DualPaneLayoutProps> {
    const updates: Partial<DualPaneLayoutProps> = {};
    let visible = false;

    switch (panel) {
      case 'codeEditor':
        updates.codeEditorOpen = !this.currentLayout.codeEditorOpen;
        visible = updates.codeEditorOpen!;
        break;
      case 'reasoning':
        updates.reasoningPanelOpen = !this.currentLayout.reasoningPanelOpen;
        visible = updates.reasoningPanelOpen!;
        break;
      // conversation panel is always open, only width changes
    }

    const updatedLayout = await this.updateLayout(updates);
    
    // Publish panel toggled event
    const event: PanelToggledEvent = {
      type: 'panel-toggled',
      payload: {
        panel,
        visible,
        layout: updatedLayout,
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);

    return updatedLayout;
  }
}

// Export singleton instance
export const layoutService = new LayoutServiceImpl();
