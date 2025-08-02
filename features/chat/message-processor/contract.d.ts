/**
 * Message Processor Contract
 * Handles message creation, processing, and streaming
 */
export interface Message {
    id: string;
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    images?: string[];
    createdAt: Date;
    updatedAt?: Date;
    metadata?: any;
    tokenCount?: number;
}
export interface MessageCreateRequest {
    conversationId: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    images?: string[];
    metadata?: any;
}
export interface StreamChunk {
    id: string;
    content: string;
    done: boolean;
    model?: string;
    tokenCount?: number;
}
export interface MessageProcessorContract {
    /**
     * Get messages for a conversation
     */
    getMessages(conversationId: string): Promise<Message[]>;
    /**
     * Create a new message
     */
    createMessage(request: MessageCreateRequest): Promise<Message>;
    /**
     * Process a message and generate response
     */
    processMessage(messageId: string): Promise<Message>;
    /**
     * Stream a response for a message
     */
    streamResponse(messageId: string): AsyncIterable<StreamChunk>;
    /**
     * Update message content
     */
    updateMessage(id: string, content: string): Promise<Message | null>;
    /**
     * Delete a message
     */
    deleteMessage(id: string): Promise<boolean>;
    /**
     * Get token count for content
     */
    getTokenCount(content: string, model?: string): Promise<number>;
}
