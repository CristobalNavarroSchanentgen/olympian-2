import { useState } from 'react';
import { MessageList } from '../chat/MessageList';
import { MessageInput } from '../chat/MessageInput';
import { ReasoningPanel } from './ReasoningPanel';
import { TextModelDropdown } from '../model-selector/TextModelDropdown';
import { Settings } from 'lucide-react';
import { useChatStore } from '../../stores/chat-store';
import { useAppStore } from '../../stores/app-store';

interface ConversationPanelProps {
  conversationId?: string | null;
  className?: string;
}

export function ConversationPanel({ conversationId, className = '' }: ConversationPanelProps) {
  const { currentConversationId, messages, conversations } = useChatStore();
  const { textModel, setTextModel } = useAppStore();
  const [reasoningExpanded, setReasoningExpanded] = useState(false);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  
  // Use the provided conversationId or fall back to the store's current one
  const activeConversationId = conversationId || currentConversationId;
  
  // Mock reasoning data with proper structure
  const mockReasoningBlocks = [
    {
      id: 'block-1',
      type: 'planning' as const,
      title: 'Understanding the request',
      content: 'Analyzing the user request to transform the UI to match dual-pane specifications with navy/blue theme and integrated code editor.',
      stepNumber: 1,
      timestamp: new Date(),
      duration: 1200
    },
    {
      id: 'block-2',
      type: 'step' as const,
      title: 'Architecture analysis',
      content: 'Reviewing the current AI-native codebase structure and identifying components that need modification.',
      stepNumber: 2,
      timestamp: new Date(),
      duration: 800
    },
    {
      id: 'block-3',
      type: 'step' as const,
      title: 'Implementation strategy',
      content: 'Planning the systematic transformation approach using editing tools to minimize token usage.',
      stepNumber: 3,
      timestamp: new Date(),
      duration: 950
    }
  ];

  const mockReasoningMetadata = {
    duration: 2950,
    wordCount: 156,
    estimatedReadingTime: 1
  };
  
  const currentMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  const currentConversation = conversations.find(c => c.id === activeConversationId);

  const handleModelChange = (modelName: string) => {
    setTextModel(modelName);
    setModelSelectorOpen(false);
  };

  if (!activeConversationId) {
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
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="font-semibold text-lg text-foreground">
              {currentConversation?.title || 'Chat'}
            </h2>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
              <span>{currentMessages.length} messages</span>
            </div>
          </div>
          
          {/* Model Selector Section */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setModelSelectorOpen(!modelSelectorOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-sm bg-background border border-border rounded-md hover:bg-accent/50 transition-colors"
                title="Select AI Model"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">
                  {textModel ? textModel.split(':')[0] : 'No Model'}
                </span>
                {!textModel && (
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-1" title="Model required" />
                )}
              </button>
              
              {/* Model Selector Dropdown */}
              {modelSelectorOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-background border border-border rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-medium text-foreground mb-1">Select AI Model</h3>
                    <p className="text-xs text-muted-foreground">Choose a model for this conversation</p>
                  </div>
                  <div className="p-4">
                    <TextModelDropdown 
                      onModelChange={handleModelChange}
                      className="w-full"
                    />
                  </div>
                  <div className="p-3 border-t border-border text-xs text-muted-foreground">
                    Selected: {textModel || 'None selected'}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Model requirement warning */}
        {!textModel && (
          <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/20 rounded-md">
            <div className="flex items-center space-x-2 text-sm text-orange-600">
              <div className="w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <span>Please select a model before sending messages</span>
            </div>
          </div>
        )}
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
                <p className="text-sm">
                  {textModel ? 'Type your message below to begin' : 'Select a model above to get started'}
                </p>
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
        <MessageInput disabled={!textModel} />
      </div>
    </div>
  );
}