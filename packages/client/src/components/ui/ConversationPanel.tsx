import { useState } from 'react';
import { MessageList } from '../chat/MessageList';
import { MessageInput } from '../chat/MessageInput';
import { ReasoningPanel } from './ReasoningPanel';
import { useChatStore } from '../../stores/chat-store';

interface ConversationPanelProps {
  className?: string;
}

export function ConversationPanel({ className = '' }: ConversationPanelProps) {
  const { currentConversationId, messages, conversations } = useChatStore();
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  
  // Mock reasoning data - in real implementation this would come from the AI response
  const mockReasoningBlocks = [
    {
      type: 'planning' as const,
      title: 'Understanding the request',
      content: 'Analyzing the user request to transform the UI to match dual-pane specifications with navy/blue theme and integrated code editor.',
      duration: 1200
    },
    {
      type: 'step' as const,
      title: 'Architecture analysis',
      content: 'Reviewing the current AI-native codebase structure and identifying components that need modification.',
      duration: 800
    },
    {
      type: 'step' as const,
      title: 'Implementation strategy',
      content: 'Planning the systematic transformation approach using editing tools to minimize token usage.',
      duration: 950
    }
  ];

  const mockReasoningMetadata = {
    duration: 2950,
    wordCount: 156,
    estimatedReadingTime: 1
  };
  
  const currentMessages = currentConversationId ? messages[currentConversationId] || [] : [];
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  if (!currentConversationId) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <h2 className="text-lg font-medium mb-2">Welcome to Olympian AI</h2>
            <p className="text-sm">Select a conversation or start a new one to begin</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Conversation Header */}
      <div className="flex-shrink-0 border-b border-border p-4 bg-muted/10">
        <h2 className="font-semibold text-lg text-foreground">
          {currentConversation?.title || 'Chat'}
        </h2>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
          <span>Model: {currentConversation?.model || 'Unknown'}</span>
          <span>•</span>
          <span>{currentMessages.length} messages</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {currentMessages.length > 0 ? (
            <MessageList messages={currentMessages} />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center">
                <p className="text-lg mb-2">Start a conversation</p>
                <p className="text-sm">Type your message below to begin</p>
              </div>
            </div>
          )}
        </div>

        {/* Reasoning Panel */}
        {currentMessages.length > 0 && (
          <ReasoningPanel
            blocks={mockReasoningBlocks}
            metadata={mockReasoningMetadata}
            expanded={reasoningExpanded}
            onToggle={() => setReasoningExpanded(!reasoningExpanded)}
          />
        )}
      </div>

      {/* Message Input */}
      <div className="flex-shrink-0 border-t border-border">
        <MessageInput />
      </div>
    </div>
  );
}
