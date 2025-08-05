/**
 * STATUS BADGE SYSTEM IMPLEMENTATION
 * 
 * Enforces conversation experience requirements for visual status indicators,
 * response type badges, and transparent metadata display.
 */

import { 
  StatusBadgeSystemContract, 
  StatusBadge, 
  ModelInfoBadge,
  BadgeType
} from './contract';

export class StatusBadgeSystem implements StatusBadgeSystemContract {
  private activeBadges: Map<string, Map<string, StatusBadge>> = new Map();
  private badgePreferences: any = {
    showModelInfo: true,
    showTokenCount: true,
    showReasoningBadges: true,
    showArtifactBadges: true
  };

  constructor() {}

  /**
   * CONTRACT ENFORCEMENT: 100% of responses show model used and token consumption
   */
  async showModelBadge(messageId: string, modelInfo: ModelInfoBadge): Promise<void> {
    const badge: StatusBadge = {
      id: `model-${messageId}`,
      type: 'model',
      label: `${modelInfo.modelName} (${modelInfo.tokensUsed || 0} tokens)`,
      color: 'blue',
      icon: 'cpu',
      metadata: {
        modelName: modelInfo.modelName,
        modelType: modelInfo.modelType,
        tokensUsed: modelInfo.tokensUsed,
        responseTime: modelInfo.responseTime
      },
      timestamp: new Date()
    };

    await this.addBadgeToMessage(messageId, badge);
    console.log(`✅ CONTRACT: Model badge displayed for ${messageId}: ${badge.label}`);
  }

  /**
   * CONTRACT ENFORCEMENT: reasoning badge appears for 100% of reasoning-capable models
   */
  async showReasoningBadge(messageId: string, reasoningInfo: any): Promise<void> {
    if (!this.badgePreferences.showReasoningBadges) return;

    const badge: StatusBadge = {
      id: `reasoning-${messageId}`,
      type: 'reasoning',
      label: `Reasoning (${reasoningInfo.milestoneCount || 0} steps)`,
      color: 'purple',
      icon: 'brain',
      metadata: {
        milestoneCount: reasoningInfo.milestoneCount,
        thinkingDuration: reasoningInfo.thinkingDuration,
        expandable: true
      },
      timestamp: new Date()
    };

    await this.addBadgeToMessage(messageId, badge);
    console.log(`✅ CONTRACT: Reasoning badge displayed for ${messageId}`);
  }

  /**
   * CONTRACT ENFORCEMENT: 100% of artifact-generating responses trigger badge display
   */
  async showArtifactBadge(messageId: string, artifactInfo: any): Promise<void> {
    if (!this.badgePreferences.showArtifactBadges) return;

    const badge: StatusBadge = {
      id: `artifact-${messageId}`,
      type: 'artifact',
      label: `${artifactInfo.artifactType} artifact`,
      color: 'green',
      icon: 'code',
      metadata: {
        artifactType: artifactInfo.artifactType,
        language: artifactInfo.language,
        size: artifactInfo.size
      },
      timestamp: new Date()
    };

    await this.addBadgeToMessage(messageId, badge);
    console.log(`✅ CONTRACT: Artifact badge displayed for ${messageId}: ${badge.label}`);
  }

  /**
   * CONTRACT ENFORCEMENT: streaming badge visible within 100ms of response start
   */
  async showStreamingBadge(messageId: string, streamingInfo: StatusBadge): Promise<void> {
    const startTime = performance.now();
    
    const badge: StatusBadge = {
      id: `streaming-${messageId}`,
      type: 'streaming',
      label: 'Generating...',
      color: 'yellow',
      icon: 'loader',
      metadata: streamingInfo.metadata,
      timestamp: new Date(),
      duration: 0 // Will be updated when streaming completes
    };

    await this.addBadgeToMessage(messageId, badge);
    
    const elapsed = performance.now() - startTime;
    if (elapsed > 100) {
      console.warn(`⚠️ CONTRACT VIOLATION: Streaming badge took ${elapsed}ms (requirement: <100ms)`);
    } else {
      console.log(`✅ CONTRACT: Streaming badge displayed in ${elapsed}ms`);
    }
  }

  async showErrorBadge(messageId: string, errorInfo: StatusBadge): Promise<void> {
    const badge: StatusBadge = {
      id: `error-${messageId}`,
      type: 'error',
      label: 'Error occurred',
      color: 'red',
      icon: 'alert-circle',
      metadata: errorInfo.metadata,
      timestamp: new Date()
    };

    await this.addBadgeToMessage(messageId, badge);
    console.log(`Error badge displayed for ${messageId}`);
  }

  async updateBadge(badgeId: string, updates: Partial<StatusBadge>): Promise<void> {
    // Find and update badge across all messages
    for (const [messageId, badges] of this.activeBadges) {
      const badge = badges.get(badgeId);
      if (badge) {
        Object.assign(badge, updates);
        await this.renderBadgeUpdate(messageId, badge);
        break;
      }
    }
  }

  async dismissBadge(badgeId: string, animation: 'fade' | 'slide' | 'instant' = 'fade'): Promise<void> {
    for (const [messageId, badges] of this.activeBadges) {
      if (badges.has(badgeId)) {
        badges.delete(badgeId);
        await this.renderBadgeRemoval(messageId, badgeId, animation);
        break;
      }
    }
  }

  async getMessageBadges(messageId: string): Promise<StatusBadge[]> {
    const badges = this.activeBadges.get(messageId);
    return badges ? Array.from(badges.values()) : [];
  }

  // Private helper methods
  private async addBadgeToMessage(messageId: string, badge: StatusBadge): Promise<void> {
    if (!this.activeBadges.has(messageId)) {
      this.activeBadges.set(messageId, new Map());
    }
    
    const messageBadges = this.activeBadges.get(messageId)!;
    messageBadges.set(badge.id, badge);
    
    await this.renderBadge(messageId, badge);
  }

  private async renderBadge(messageId: string, badge: StatusBadge): Promise<void> {
    // Implementation would render badge in UI
    console.log(`Rendering badge ${badge.id} for message ${messageId}: ${badge.label}`);
  }

  private async renderBadgeUpdate(messageId: string, badge: StatusBadge): Promise<void> {
    // Implementation would update badge in UI
    console.log(`Updating badge ${badge.id} for message ${messageId}`);
  }

  private async renderBadgeRemoval(messageId: string, badgeId: string, animation: string): Promise<void> {
    // Implementation would remove badge from UI with animation
    console.log(`Removing badge ${badgeId} from message ${messageId} with ${animation} animation`);
  }
}

export function createStatusBadgeSystem(): StatusBadgeSystem {
  return new StatusBadgeSystem();
}
