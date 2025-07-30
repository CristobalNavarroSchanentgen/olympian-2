import { ReasoningService } from '@olympian/shared/services/reasoning-service';
import { ReasoningPanelProps, ReasoningBlock, ReasoningPanelConfig } from '@olympian/shared/features/ui/reasoning-panel/contract';
import { reasoningDataAdapter } from '@olympian/shared/adapters/features/ui/reasoning-panel/reasoning-data-adapter';

/**
 * ReasoningService Implementation
 * 
 * Implements the ReasoningService interface for frontend reasoning panel management.
 * Uses adapters for data transformation and maintains reasoning state.
 */
class ReasoningServiceImpl implements ReasoningService {
  private currentState: ReasoningPanelProps = {
    isOpen: false,
    blocks: [],
    totalSteps: 0,
    currentStep: 0,
    config: {
      maxBlocks: 50,
      autoCollapse: true,
      exportFormat: 'markdown'
    }
  };

  private nextStepNumber = 1;

  getReasoningPanel(): ReasoningPanelProps {
    return { ...this.currentState };
  }

  async addReasoningBlock(
    blockData: Omit<ReasoningBlock, 'id' | 'timestamp' | 'stepNumber'>
  ): Promise<ReasoningPanelProps> {
    const block: ReasoningBlock = {
      ...blockData,
      id: this.generateBlockId(),
      timestamp: new Date().toISOString(),
      stepNumber: this.nextStepNumber++
    };

    this.currentState.blocks.push(block);
    this.currentState.totalSteps = this.currentState.blocks.length;
    this.currentState.currentStep = this.currentState.totalSteps;

    // Auto-collapse if configured and limit reached
    if (this.currentState.config.autoCollapse && 
        this.currentState.blocks.length > this.currentState.config.maxBlocks) {
      this.currentState.blocks = this.currentState.blocks.slice(-this.currentState.config.maxBlocks);
    }

    return this.getReasoningPanel();
  }

  async updateReasoningBlock(blockId: string, updates: Partial<ReasoningBlock>): Promise<ReasoningPanelProps> {
    const blockIndex = this.currentState.blocks.findIndex(block => block.id === blockId);
    
    if (blockIndex !== -1) {
      this.currentState.blocks[blockIndex] = {
        ...this.currentState.blocks[blockIndex],
        ...updates
      };
    }

    return this.getReasoningPanel();
  }

  async removeReasoningBlock(blockId: string): Promise<ReasoningPanelProps> {
    this.currentState.blocks = this.currentState.blocks.filter(block => block.id !== blockId);
    this.currentState.totalSteps = this.currentState.blocks.length;
    
    return this.getReasoningPanel();
  }

  async clearReasoning(): Promise<ReasoningPanelProps> {
    this.currentState.blocks = [];
    this.currentState.totalSteps = 0;
    this.currentState.currentStep = 0;
    this.nextStepNumber = 1;

    return this.getReasoningPanel();
  }

  async toggleReasoningPanel(): Promise<ReasoningPanelProps> {
    this.currentState.isOpen = !this.currentState.isOpen;
    return this.getReasoningPanel();
  }

  async processReasoningData(data: string | any): Promise<ReasoningBlock[]> {
    try {
      return await reasoningDataAdapter.transform(data);
    } catch (error) {
      console.error('Failed to process reasoning data:', error);
      return [];
    }
  }

  async exportReasoning(): Promise<string> {
    const format = this.currentState.config.exportFormat;
    
    if (format === 'markdown') {
      return this.exportAsMarkdown();
    } else if (format === 'text') {
      return this.exportAsText();
    } else {
      return JSON.stringify(this.currentState.blocks, null, 2);
    }
  }

  async configurePanel(config: Partial<ReasoningPanelConfig>): Promise<ReasoningPanelProps> {
    this.currentState.config = {
      ...this.currentState.config,
      ...config
    };

    return this.getReasoningPanel();
  }

  private generateBlockId(): string {
    return `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private exportAsMarkdown(): string {
    let markdown = '# Reasoning Process\n\n';
    
    this.currentState.blocks.forEach((block, index) => {
      markdown += `## Step ${block.stepNumber}: ${block.type.toUpperCase()}\n\n`;
      markdown += `**${block.title}**\n\n`;
      markdown += `${block.content}\n\n`;
      
      if (block.duration) {
        markdown += `*Duration: ${block.duration}ms*\n\n`;
      }
      
      markdown += '---\n\n';
    });

    return markdown;
  }

  private exportAsText(): string {
    let text = 'REASONING PROCESS\n';
    text += '================\n\n';
    
    this.currentState.blocks.forEach((block) => {
      text += `STEP ${block.stepNumber}: ${block.type.toUpperCase()}\n`;
      text += `${block.title}\n`;
      text += `${'-'.repeat(block.title.length)}\n`;
      text += `${block.content}\n\n`;
    });

    return text;
  }
}

// Export singleton instance
export const reasoningService = new ReasoningServiceImpl();
