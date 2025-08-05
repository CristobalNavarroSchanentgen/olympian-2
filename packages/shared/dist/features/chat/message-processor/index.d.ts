/**
 * Feature Implementation: Chat Message Processor
 */
import { MessageProcessorContract, MessageProcessorDependencies } from "./contract";
import { Message } from "../../../models/chat/message";
export declare class MessageProcessor implements MessageProcessorContract {
    private deps;
    private activeStreams;
    constructor(deps: MessageProcessorDependencies);
    processMessage(params: any): Promise<any>;
    continueMessage(messageId: string): Promise<any>;
    cancelMessage(messageId: string): Promise<void>;
    startStreaming(params: any): Promise<any>;
    stopStreaming(streamId: string): Promise<void>;
    regenerateResponse(messageId: string): Promise<any>;
    editMessage(messageId: string, newContent: string): Promise<Message>;
    deleteMessage(messageId: string): Promise<void>;
    private processResponseStream;
    updateConfig(config: any): Promise<void>;
    getConfig(): any;
}
//# sourceMappingURL=index.d.ts.map