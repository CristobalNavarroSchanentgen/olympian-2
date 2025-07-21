/**
 * Feature Implementation: Chat Message Processor
 */

import { MessageProcessorContract, MessageProcessorDependencies } from "./contract";
import { Message } from "../../../models/chat/message";

export class MessageProcessor implements MessageProcessorContract {
  private activeStreams = new Map<string, AbortController>();
  
  constructor(private deps: MessageProcessorDependencies) {}

  async processMessage(params: any): Promise<any> {
    // Create user message
    const userMessage = await this.deps.messageService.createMessage({
      conversationId: params.conversationId,
      role: "user",
      content: params.content,
      images: params.images
    });

    // Start streaming response
    const controller = new AbortController();
    this.activeStreams.set(userMessage.id, controller);

    const responseStream = this.deps.ollamaAdapter.streamChat({
      model: params.model,
      messages: [...(params.context || []), userMessage],
      systemPrompt: params.systemPrompt,
      signal: controller.signal
    });

    const responsePromise = this.processResponseStream(
      params.conversationId, 
      responseStream,
      userMessage.id
    );

    return { userMessage, responseStream, responsePromise };
  }

  async continueMessage(messageId: string): Promise<any> {
    const message = await this.deps.messageService.getMessage(messageId);
    if (!message) throw new Error("Message not found");

    const controller = new AbortController();
    this.activeStreams.set(messageId, controller);

    const responseStream = this.deps.ollamaAdapter.continueGeneration({
      messageId,
      signal: controller.signal
    });

    const responsePromise = this.processResponseStream(
      message.conversationId,
      responseStream,
      messageId
    );

    return { responseStream, responsePromise };
  }

  async cancelMessage(messageId: string): Promise<void> {
    const controller = this.activeStreams.get(messageId);
    if (controller) {
      controller.abort();
      this.activeStreams.delete(messageId);
    }
  }

  async startStreaming(params: any): Promise<any> {
    return this.deps.streamingAdapter.createStream({
      conversationId: params.conversationId,
      callback: params.onToken
    });
  }

  async stopStreaming(streamId: string): Promise<void> {
    await this.deps.streamingAdapter.closeStream(streamId);
  }

  async regenerateResponse(messageId: string): Promise<any> {
    const message = await this.deps.messageService.getMessage(messageId);
    if (!message) throw new Error("Message not found");

    // Get previous context
    const context = await this.deps.messageService.getMessageContext(messageId);
    
    return this.processMessage({
      conversationId: message.conversationId,
      content: message.content,
      model: message.metadata?.model,
      context
    });
  }

  async editMessage(messageId: string, newContent: string): Promise<Message> {
    const updated = await this.deps.messageService.updateMessage(messageId, {
      content: newContent,
      editedAt: new Date()
    });

    this.deps.websocketAdapter.emitMessageUpdated(updated);
    return updated;
  }

  async deleteMessage(messageId: string): Promise<void> {
    await this.deps.messageService.deleteMessage(messageId);
    this.deps.websocketAdapter.emitMessageDeleted(messageId);
  }

  private async processResponseStream(
    conversationId: string,
    stream: AsyncIterableIterator<string>,
    relatedMessageId: string
  ): Promise<Message> {
    let fullContent = "";
    let aiMessage: Message | null = null;

    for await (const token of stream) {
      fullContent += token;
      
      // Create AI message on first token
      if (!aiMessage) {
        aiMessage = await this.deps.messageService.createMessage({
          conversationId,
          role: "assistant",
          content: token,
          metadata: { relatedMessageId }
        });
      } else {
        // Update existing message
        aiMessage = await this.deps.messageService.updateMessage(aiMessage.id, {
          content: fullContent
        });
      }

      // Emit streaming token
      this.deps.websocketAdapter.emitToken({
        messageId: aiMessage.id,
        token,
        fullContent
      });
    }

    if (!aiMessage) {
      throw new Error("No response generated");
    }

    // Mark as complete
    const finalMessage = await this.deps.messageService.updateMessage(aiMessage.id, {
      metadata: { ...aiMessage.metadata, completed: true }
    });

    this.deps.websocketAdapter.emitMessageComplete(finalMessage);
    return finalMessage;
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
