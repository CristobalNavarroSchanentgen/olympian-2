/**
 * Conversation Models
 */

export interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  model?: string;
  metadata: Record<string, unknown>;
}

// Summary and filter types
export interface ConversationSummary {
  id: string;
  title: string;
  messageCount: number;
  lastActivity: Date;
  preview?: string;
}

export interface ConversationFilter {
  search?: string;
  model?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  hasMessages?: boolean;
}
