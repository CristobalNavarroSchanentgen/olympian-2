export interface DualPaneLayoutProps {
    sidebarOpen: boolean;
    conversationPanelWidth: number;
    codeEditorOpen: boolean;
    reasoningPanelOpen: boolean;
    theme: 'light' | 'dark';
}
export interface LayoutConfig {
    sidebarOpen: boolean;
    conversationPanelWidth: number;
    codeEditorOpen: boolean;
    reasoningPanelOpen: boolean;
    theme: 'light' | 'dark';
}
export interface ConversationPanelProps {
    messages: Message[];
    onSendMessage: (content: string) => void;
    isLoading?: boolean;
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
export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}
export interface ReasoningBlock {
    id: string;
    type: 'thinking' | 'conclusion';
    content: string;
    timestamp: Date;
}
export interface ReasoningMetadata {
    duration: number;
    wordCount: number;
    estimatedReadingTime: number;
}
//# sourceMappingURL=contract.d.ts.map