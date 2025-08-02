import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Trash2, Radio } from 'lucide-react';
import { useChatStore } from '../../stores/chat-store';
import { chatService } from '../../services/index';

interface SidebarProps {
  connected: boolean;
  onNewConversation: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ connected, onNewConversation, isOpen, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const { conversations, currentConversationId, setConversations, selectedModel } = useChatStore();
  
  const handleNewConversation = async () => {
    try {
      const conversation = await chatService.createConversation({
        title: 'New Chat',
        model: selectedModel || 'llama3.2:1b'
      });
      
      const updatedConversations = await chatService.getConversations();
      setConversations(updatedConversations);
      
      navigate(`/chat/${conversation.id}`);
      onNewConversation();
    } catch (error) {
      console.error('Failed to create conversation:', error);
      onNewConversation();
    }
  };

  const handleDeleteConversation = async (conversationId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    try {
      await chatService.deleteConversation(conversationId);
      const filtered = (conversations || []).filter(c => c.id !== conversationId);
      setConversations(filtered);
      
      if (currentConversationId === conversationId) {
        navigate('/chat');
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-panel/50 backdrop-blur-sm w-80 border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold gradient-text">Olympian AI</h2>
          <div className={`flex items-center gap-2 text-xs ${connected ? 'text-green-500' : 'text-red-500'}`}>
            <Radio className="w-2 h-2 fill-current" />
            {connected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        
        <button
          onClick={handleNewConversation}
          className="w-full py-3 px-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {(conversations || []).map(conversation => (
            <div
              key={conversation.id}
              onClick={() => navigate(`/chat/${conversation.id}`)}
              className={`group relative p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-accent/10 ${
                currentConversationId === conversation.id
                  ? 'bg-accent/20 border border-primary/20'
                  : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4 text-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-primary truncate">
                    {conversation.title}
                  </h3>
                  <p className="text-xs text-muted mt-1">
                    {new Date(conversation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteConversation(conversation.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded transition-all duration-200"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <p className="text-xs text-muted text-center">Powered by Ollama</p>
      </div>
    </div>
  );
}
