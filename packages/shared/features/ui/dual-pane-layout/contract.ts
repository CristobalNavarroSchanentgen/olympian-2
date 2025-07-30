// Contract for dual-pane layout feature
export interface DualPaneLayoutProps {
  conversationPanel: {
    visible: boolean;
    width?: number;
    showReasoningPanel?: boolean;
  };
  codeEditor: {
    visible: boolean;
    language?: string;
    content?: string;
    readOnly?: boolean;
  };
  header: {
    title: string;
    showNavigation?: boolean;
    showModelSelector?: boolean;
  };
}

export interface ConversationPanelProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  reasoning?: {
    visible: boolean;
    content: ReasoningBlock[];
    metadata: ReasoningMetadata;
  };
  conversations: Conversation[];
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewConversation: () => void;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ReasoningBlock {
  type: 'planning' | 'step' | 'conclusion';
  title: string;
  content: string;
  duration?: number;
}

export interface ReasoningMetadata {
  duration: number;
  wordCount: number;
  estimatedReadingTime: number;
}
