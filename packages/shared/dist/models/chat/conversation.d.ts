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
//# sourceMappingURL=conversation.d.ts.map