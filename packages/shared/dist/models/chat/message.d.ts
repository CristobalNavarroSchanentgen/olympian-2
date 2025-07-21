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
//# sourceMappingURL=message.d.ts.map