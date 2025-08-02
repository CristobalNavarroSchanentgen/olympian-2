/**
 * Message Processor Feature
 * Handles message creation, processing, and title generation triggers
 */
import type { MessageProcessorContract, Message, MessageCreateRequest, StreamChunk } from './contract';
export declare class MessageProcessor implements MessageProcessorContract {
    private titleGenerationService;
    private conversationService;
    private messageService;
    private eventEmitter;
    constructor(titleGenerationService: any, conversationService: any, messageService: any, eventEmitter: any);
    createMessage(request: MessageCreateRequest): Promise<Message>;
    getMessages(conversationId: string): Promise<Message[]>;
    processMessage(messageId: string): Promise<Message>;
    streamResponse(messageId: string): AsyncIterable<StreamChunk>;
    updateMessage(id: string, content: string): Promise<Message | null>;
    deleteMessage(id: string): Promise<boolean>;
    getTokenCount(content: string, model?: string): Promise<number>;
    private triggerTitleGenerationIfFirst;
}
export * from './contract';
