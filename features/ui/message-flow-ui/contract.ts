/**
 * MESSAGE FLOW UI CONTRACT
 * 
 * Enforces conversation experience requirements for smooth message interactions,
 * intuitive message organization, and natural conversation flow.
 * 
 * Layer: 1 (Feature Contract)
 * Serves: conversation_experience
 * Contract Enforcement: fluidInteractionFlow, naturalCommunication
 */

export interface MessageBubble {
  id: string;
  messageId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  status: 'sending' | 'sent' | 'delivered' | 'streaming' | 'complete' | 'error';
  metadata: {
    tokensUsed?: number;
    responseTime?: number;
    modelUsed?: string;
    hasReasoning?: boolean;
    hasArtifacts?: boolean;
  };
  styling: {
    position: 'left' | 'right';
    variant: 'primary' | 'secondary' | 'error';
    size: 'compact' | 'normal' | 'expanded';
    animation: 'none' | 'fade-in' | 'slide-in' | 'bounce';
  };
}

export interface ConversationFlow {
  conversationId: string;
  messages: MessageBubble[];
  currentlyStreaming?: string;
  scrollPosition: number;
  autoScroll: boolean;
  smoothScrolling: boolean;
}

export interface InteractionState {
  inputFocused: boolean;
  sendButtonEnabled: boolean;
  sendButtonState: 'idle' | 'sending' | 'disabled';
  inputPlaceholder: string;
  keyboardShortcutsEnabled: boolean;
  voiceInputEnabled: boolean;
}

export interface MessageFlowUIContract {
  /**
   * CONVERSATION EXPERIENCE ENFORCEMENT
   * Ensures smooth, natural conversation flow with immediate feedback
   */
  
  /**
   * Display message bubble with smooth animation
   * Contract: intuitive message bubble organization and spacing
   */
  displayMessageBubble(message: MessageBubble): Promise<void>;
  
  /**
   * Update message bubble during streaming
   * Contract: responses appear with natural typing animation
   */
  updateStreamingMessage(
    messageId: string, 
    content: string, 
    isComplete: boolean
  ): Promise<void>;
  
  /**
   * Handle message send with immediate feedback
   * Contract: immediate feedback when sending messages
   */
  handleMessageSend(content: string): Promise<void>;
  
  /**
   * Update send button state responsively
   * Contract: send button responsiveness with visual feedback
   */
  updateSendButtonState(state: InteractionState['sendButtonState']): Promise<void>;
  
  /**
   * Manage conversation scroll behavior
   * Contract: smooth scrolling to new messages without jarring jumps
   */
  manageScrollBehavior(
    behavior: 'auto' | 'smooth' | 'instant', 
    target?: 'latest' | 'specific'
  ): Promise<void>;
  
  /**
   * Handle input field interactions
   * Contract: natural text input with shift+enter support
   */
  handleInputInteraction(event: any): Promise<void>;
  
  /**
   * Display timestamp information
   * Contract: clear timestamps for message tracking
   */
  displayTimestamps(messageId: string, format: 'relative' | 'absolute'): Promise<void>;
  
  /**
   * Apply message spacing and layout
   * Contract: no jarring transitions or unexpected behavior
   */
  applyMessageLayout(conversationFlow: ConversationFlow): Promise<void>;
  
  /**
   * Handle message interaction states
   * Contract: all interactions feel immediate and smooth
   */
  updateInteractionState(state: Partial<InteractionState>): Promise<void>;
  
  /**
   * Validate message flow against contract requirements
   * Contract: ensure fluid interaction criteria met
   */
  validateMessageFlow(): Promise<MessageFlowValidationResult>;
}

export interface MessageFlowPreferences {
  bubbleStyle: 'modern' | 'classic' | 'minimal';
  bubbleSpacing: 'compact' | 'normal' | 'spacious';
  animationSpeed: 'fast' | 'normal' | 'slow' | 'disabled';
  showTimestamps: 'always' | 'hover' | 'never';
  autoScroll: boolean;
  smoothScrolling: boolean;
  keyboardShortcuts: boolean;
  sendOnEnter: boolean;
  sendOnCtrlEnter: boolean;
}

export interface MessageFlowValidationResult {
  meetsContract: boolean;
  responsiveness: {
    sendButtonFeedback: boolean;        // Immediate response
    inputResponsiveness: boolean;       // Natural text input
    scrollSmoothness: boolean;          // No jarring jumps
  };
  naturalness: {
    messageOrganization: boolean;       // Intuitive layout
    timestampClarity: boolean;          // Clear time tracking
    conversationFlow: boolean;          // Natural progression
  };
  smoothness: {
    animationQuality: boolean;          // Smooth transitions
    noJarringBehavior: boolean;         // Predictable interactions
    immediateInteractions: boolean;     // Responsive feel
  };
  recommendations?: string[];
}

/**
 * CONTRACT VALIDATION CRITERIA
 */
export const MessageFlowContractValidation = {
  responsiveness: {
    sendButtonLatencyMaxMs: 50,        // Immediate button feedback
    inputLatencyMaxMs: 16,             // 60fps input response
    scrollSmoothnesRequired: true      // No jarring scroll jumps
  },
  
  naturalness: {
    intuitiveBubbleLayout: true,       // Clear message organization
    timestampVisibility: true,         // Message tracking
    conversationContinuity: true       // Natural flow progression
  },
  
  interactionQuality: {
    smoothAnimations: true,            // Quality transitions
    predictableBehavior: true,         // No surprises
    immediateResponse: true            // Responsive interactions
  }
} as const;
