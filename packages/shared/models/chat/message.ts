/**
 * Message Models
 */

export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt?: Date;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  metadata: Record<string, unknown>;
}

// Additional message types
export interface MessageDraft {
  content: string;
  role: MessageRole;
  images?: string[];
  metadata?: Record<string, unknown>;
}

export interface StreamingToken {
  content: string;
  delta?: string;
  complete: boolean;
  metadata?: Record<string, unknown>;
}
