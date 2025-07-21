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
      <div className="border-b border-border p-4">
        <h1 className="font-semibold text-lg">{currentConversation?.title || 'Chat'}</h1>
        <p className="text-sm text-muted-foreground">
          Model: {currentConversation?.model || 'Unknown'} • 
          {currentMessages.length} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {currentMessages.length > 0 ? (
          <>
            <MessageList messages={currentMessages} />
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">Start a conversation</p>
              <p className="text-sm">Type your message below to begin</p>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border">
        <MessageInput />
      </div>
    </div>
  );
}
