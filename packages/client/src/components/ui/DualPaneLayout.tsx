import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ChatInterface } from './ChatInterface';
import { ApplicationHeader } from './ApplicationHeader';
import { Sidebar } from './Sidebar';
import { useChatStore } from '../../stores/chat-store';
import { useAppStore } from '../../stores/app-store';
import { chatService } from '../../services/index';

export function DualPaneLayout() {
  const { conversationId } = useParams();
  const { 
    setConversations, 
    currentConversationId, 
    setCurrentConversation, 
    setMessages, 
    setArtifacts 
  } = useChatStore();
  const { connected } = useAppStore();

  // Load initial data
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const conversations = await chatService.getConversations();
        setConversations(Array.isArray(conversations) ? conversations : []);
      } catch (error) {
        console.error("Failed to load conversations:", error);
        setConversations([]);
      }
    };

    loadConversations();
  }, [setConversations]);

  // Handle conversation loading
  useEffect(() => {
    if (conversationId && conversationId !== currentConversationId) {
      const loadConversation = async () => {
        try {
          setCurrentConversation(conversationId);
          
          const messages = await chatService.getMessages(conversationId);
          setMessages(conversationId, messages);
          
          const artifacts = await chatService.getArtifacts(conversationId);
          setArtifacts(conversationId, artifacts);
        } catch (error) {
          console.error('Failed to load conversation:', error);
        }
      };

      loadConversation();
    } else if (!conversationId) {
      setCurrentConversation(null);
    }
  }, [conversationId, currentConversationId, setCurrentConversation, setMessages, setArtifacts]);

  return (
    <div className="flex flex-col h-screen">
      <ApplicationHeader title="Olympian AI" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          connected={connected}
          onNewConversation={() => {}}
          isOpen={true}
          onToggle={() => {}}
        />
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            conversationId={conversationId || currentConversationId}
          />
        </div>
      </div>
    </div>
  );
}
