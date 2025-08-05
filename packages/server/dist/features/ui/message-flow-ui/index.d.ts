/**
 * MESSAGE FLOW UI IMPLEMENTATION
 *
 * Enforces conversation experience requirements for smooth message interactions,
 * intuitive message organization, and natural conversation flow.
 */
import { MessageFlowUIContract, MessageBubble, ConversationFlow, InteractionState, MessageFlowValidationResult } from './contract';
export declare class MessageFlowUI implements MessageFlowUIContract {
    private conversationFlows;
    private interactionState;
    constructor();
    /**
     * CONTRACT ENFORCEMENT: intuitive message bubble organization and spacing
     */
    displayMessageBubble(message: MessageBubble): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: responses appear with natural typing animation
     */
    updateStreamingMessage(messageId: string, content: string, isComplete: boolean): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: immediate feedback when sending messages
     */
    handleMessageSend(content: string): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: send button responsiveness with visual feedback
     */
    updateSendButtonState(state: InteractionState['sendButtonState']): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: smooth scrolling to new messages without jarring jumps
     */
    manageScrollBehavior(behavior: 'auto' | 'smooth' | 'instant', target?: 'latest' | 'specific'): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: natural text input with shift+enter support
     */
    handleInputInteraction(event: any): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: clear timestamps for message tracking
     */
    displayTimestamps(messageId: string, format: 'relative' | 'absolute'): Promise<void>;
    /**
     * CONTRACT ENFORCEMENT: no jarring transitions or unexpected behavior
     */
    applyMessageLayout(conversationFlow: ConversationFlow): Promise<void>;
    updateInteractionState(state: Partial<InteractionState>): Promise<void>;
    validateMessageFlow(): Promise<MessageFlowValidationResult>;
    private findMessageBubble;
    private renderMessageBubble;
    private renderMessageUpdate;
    private applyTypingAnimation;
    private clearMessageInput;
    private renderSendButtonState;
    private smoothScrollToTarget;
    private autoScrollToTarget;
    private getRelativeTime;
    private renderTimestamp;
    private calculateMessageSpacing;
    private applyLayoutTransitions;
    private updateScrollPosition;
    private renderInteractionState;
}
export declare function createMessageFlowUI(): MessageFlowUI;
