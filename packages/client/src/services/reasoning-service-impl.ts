import { ReasoningService } from '@olympian/shared/services/reasoning-service';
import { ReasoningBlock, ReasoningPanelProps, ExportFormat } from '@olympian/shared/features/ui/reasoning-panel/contract';
// import { reasoningDataAdapter } from '@olympian/shared/adapters/features/ui/reasoning-panel/reasoning-data-adapter';
import { eventBus } from '@olympian/shared/utils/event-bus';
import { 
  ReasoningBlockAddedEvent,
  ReasoningBlockUpdatedEvent, 
  ReasoningBlockRemovedEvent,
  ReasoningPanelToggledEvent,
  ReasoningClearedEvent,
  ReasoningExportedEvent 
} from '@olympian/shared/events/ui/reasoning-events';

/**
 * ReasoningService Implementation with Event Publishing
 * 
 * Manages reasoning blocks and panel state with event publishing.
 * Uses adapters for data transformation and publishes events for all operations.
 */
class ReasoningServiceImpl implements ReasoningService {
  private panelState: ReasoningPanelProps = {
    visible: false,
    expanded: false,
    blocks: [],
    exportFormat: 'text'
  };

  getCurrentState(): ReasoningPanelProps {
    return { ...this.panelState };
  }

  async addReasoningBlock(content: string, type: 'thinking' | 'conclusion' = 'thinking'): Promise<ReasoningBlock> {
    const block = reasoningDataAdapter.createBlock(content, type);
    this.panelState.blocks.push(block);
    
    // Publish block added event
    const event: ReasoningBlockAddedEvent = {
      type: 'reasoning-block-added',
      payload: {
        block,
        panelState: this.getCurrentState(),
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return block;
  }

  async updateReasoningBlock(blockId: string, updates: Partial<ReasoningBlock>): Promise<ReasoningBlock | null> {
    const blockIndex = this.panelState.blocks.findIndex(b => b.id === blockId);
    if (blockIndex === -1) return null;
    
    this.panelState.blocks[blockIndex] = { ...this.panelState.blocks[blockIndex], ...updates };
    const updatedBlock = this.panelState.blocks[blockIndex];
    
    // Publish block updated event
    const event: ReasoningBlockUpdatedEvent = {
      type: 'reasoning-block-updated',
      payload: {
        blockId,
        updates,
        panelState: this.getCurrentState(),
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return updatedBlock;
  }

  async removeReasoningBlock(blockId: string): Promise<boolean> {
    const initialLength = this.panelState.blocks.length;
    this.panelState.blocks = this.panelState.blocks.filter(b => b.id !== blockId);
    const wasRemoved = this.panelState.blocks.length < initialLength;
    
    if (wasRemoved) {
      // Publish block removed event
      const event: ReasoningBlockRemovedEvent = {
        type: 'reasoning-block-removed',
        payload: {
          blockId,
          panelState: this.getCurrentState(),
          timestamp: new Date()
        }
      };
      await eventBus.publish(event);
    }
    
    return wasRemoved;
  }

  async clearReasoning(): Promise<void> {
    const previousBlockCount = this.panelState.blocks.length;
    this.panelState.blocks = [];
    
    // Publish cleared event
    const event: ReasoningClearedEvent = {
      type: 'reasoning-cleared',
      payload: {
        previousBlockCount,
        panelState: this.getCurrentState(),
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
  }

  async togglePanel(): Promise<ReasoningPanelProps> {
    this.panelState.visible = !this.panelState.visible;
    
    // Publish panel toggled event
    const event: ReasoningPanelToggledEvent = {
      type: 'reasoning-panel-toggled',
      payload: {
        visible: this.panelState.visible,
        expanded: this.panelState.expanded,
        panelState: this.getCurrentState(),
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return this.getCurrentState();
  }

  async expandPanel(): Promise<ReasoningPanelProps> {
    this.panelState.expanded = true;
    
    // Publish panel toggled event (expanded = true)
    const event: ReasoningPanelToggledEvent = {
      type: 'reasoning-panel-toggled',
      payload: {
        visible: this.panelState.visible,
        expanded: this.panelState.expanded,
        panelState: this.getCurrentState(),
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return this.getCurrentState();
  }

  async collapsePanel(): Promise<ReasoningPanelProps> {
    this.panelState.expanded = false;
    
    // Publish panel toggled event (expanded = false)
    const event: ReasoningPanelToggledEvent = {
      type: 'reasoning-panel-toggled',
      payload: {
        visible: this.panelState.visible,
        expanded: this.panelState.expanded,
        panelState: this.getCurrentState(),
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return this.getCurrentState();
  }

  async exportReasoning(format: ExportFormat): Promise<string> {
    const content = reasoningDataAdapter.export(this.panelState.blocks, format);
    
    // Publish export event
    const event: ReasoningExportedEvent = {
      type: 'reasoning-exported',
      payload: {
        format,
        content,
        blockCount: this.panelState.blocks.length,
        timestamp: new Date()
      }
    };
    await eventBus.publish(event);
    
    return content;
  }

  async setExportFormat(format: ExportFormat): Promise<void> {
    this.panelState.exportFormat = format;
  }
}

// Export singleton instance
export const reasoningService = new ReasoningServiceImpl();
