/**
 * Core message model - pure types only
 */

export interface Message {
  readonly id: string;
  readonly conversationId: string;
  readonly role: MessageRole;
  readonly content: string;
  readonly images?: ImageData[];
  readonly artifacts?: ArtifactReference[];
  readonly metadata: MessageMetadata;
  readonly createdAt: Date;
}

export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessageMetadata {
  readonly tokenCount: number;
  readonly processingTime?: number;
  readonly model?: string;
  readonly toolCalls?: ToolCall[];
  readonly streamingComplete: boolean;
}

export interface ImageData {
  readonly id: string;
  readonly filename: string;
  readonly mimeType: string;
  readonly base64Data: string;
  readonly size: number;
}

export interface ArtifactReference {
  readonly id: string;
  readonly type: string;
  readonly title: string;
}

export interface ToolCall {
  readonly id: string;
  readonly name: string;
  readonly arguments: Record<string, unknown>;
  readonly result?: unknown;
  readonly error?: string;
}

export interface MessageDraft {
  readonly content: string;
  readonly images?: ImageData[];
}

export interface StreamingToken {
  readonly token: string;
  readonly isComplete: boolean;
  readonly metadata?: Record<string, unknown>;
}
