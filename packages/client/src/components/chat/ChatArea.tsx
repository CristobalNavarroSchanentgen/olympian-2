import { useEffect, useRef } from 'react';
import { useChatStore } from '../../stores/chat-store';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { WelcomeScreen } from './WelcomeScreen';

export function ChatArea() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentConversationId, messages, conversations } = useChatStore();
  
  const currentMessages = currentConversationId ? messages[currentConversationId] || [] : [];
  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentMessages]);

  if (!currentConversationId) {
    return <WelcomeScreen />;
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="conversation-controls bg-panel/50 backdrop-blur-md border-b border-border px-6 py-4">
        <h1 className="font-semibold text-xl text-primary">{currentConversation?.title || 'Chat'}</h1>
        <p className="text-base text-muted animate-slide-up animation-delay-200 text-muted flex items-center gap-2 mt-1">
          📊 {currentConversation?.model || 'Unknown'} • 💬 
          {currentMessages.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
        {currentMessages.length > 0 ? (
          <>
            <MessageList messages={currentMessages} />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full animate-fade-in">
            <div className="text-center space-y-4">
              <p className="text-2xl font-medium text-primary mb-2 animate-slide-up">Start a conversation</p>
              <p className="text-base text-muted animate-slide-up animation-delay-200">Type your message below to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border bg-panel/30 backdrop-blur-sm">
        <MessageInput />
      </div>
    </div>
  );
}
