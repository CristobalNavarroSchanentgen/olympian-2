import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { useChatStore } from '../../stores/chat-store';
import { chatService } from '../../services/chat-service';

export function ChatLayout() {
  const { conversationId } = useParams();
  const { 
    sidebarOpen, 
    setCurrentConversation, 
    setConversations, 
    setMessages,
    conversations 
  } = useChatStore();

  useEffect(() => {
    chatService.getConversations()
      .then(setConversations)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (conversationId) {
      setCurrentConversation(conversationId);
      
      chatService.getMessages(conversationId)
        .then(messages => setMessages(conversationId, messages))
        .catch(console.error);
    } else {
      setCurrentConversation(null);
    }
  }, [conversationId]);

  return (
    <div className="flex h-screen bg-background">
      {sidebarOpen && (
        <div className="w-80 border-r border-border bg-muted/30">
          <Sidebar conversations={conversations} connected={true} onNewConversation={() => {}} />
        </div>
      )}
      
      <div className="flex-1 flex flex-col">
        <ChatArea />
      </div>
    </div>
  );
}
