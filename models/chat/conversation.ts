/**
 * Core conversation model - pure types only
 * No methods, no behavior, just data structure
 */

export interface Conversation {
  readonly id: string;
  readonly title: string;
  readonly model: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly metadata: ConversationMetadata;
}

export interface ConversationMetadata {
  readonly tokenCount: number;
  readonly messageCount: number;
  readonly memorySettings: MemorySettings;
  readonly systemPrompt?: string;
}

export interface MemorySettings {
  readonly maxMessages: number;
  readonly maxTokens: number;
  readonly autoCleanup: boolean;
}

export interface ConversationSummary {
  readonly id: string;
  readonly title: string;
  readonly lastMessageAt: Date;
  readonly messageCount: number;
  readonly model: string;
}

export interface ConversationFilter {
  readonly model?: string;
  readonly dateRange?: DateRange;
  readonly searchTerm?: string;
}

export interface DateRange {
  readonly start: Date;
  readonly end: Date;
}
