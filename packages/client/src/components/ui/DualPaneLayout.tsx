import { useParams } from 'react-router-dom';
import { useEventSubscription } from "../../hooks/useEventSubscription";
import { LayoutEvent } from "@olympian/shared/events/ui/layout-events";
import { useEffect, useState, useCallback } from 'react';
import { ApplicationHeader } from './ApplicationHeader';
import { ConversationPanel } from './ConversationPanel';
import { CodeEditor } from './CodeEditor';
import { Sidebar } from '../chat/Sidebar';
import { layoutService } from '../../services';
import { DualPaneLayoutProps } from '@olympian/shared/features/ui/dual-pane-layout/contract';
import { useChatStore } from '../../stores/chat-store';
import { useAppStore } from '../../stores/app-store';
import { chatService } from '../../services/chat-service';

export function DualPaneLayout() {
  // Extract conversation ID from URL
  const { conversationId } = useParams();
  
  // AI-native service state
  const [layoutState, setLayoutState] = useState<DualPaneLayoutProps>(() => 
    layoutService.getCurrentLayout()
  );

  // Event-driven state updates
  const handleLayoutEvent = useCallback((event: LayoutEvent) => {
    switch (event.type) {
      case "layout-updated":
        setLayoutState(event.payload.layout);
        break;
      case "panel-toggled":
        setLayoutState(event.payload.layout);
        break;
    }
  }, []);

  // Subscribe to layout events
  useEventSubscription<LayoutEvent>("layout-updated", handleLayoutEvent);

  // Legacy store access (still needed for chat functionality until fully migrated)
  const { 
    setConversations, 
    currentConversationId,
    setCurrentConversation,
    setMessages,
    setArtifacts,
    addConversation
  } = useChatStore();
  
  const { connected } = useAppStore();

  // Load conversation data when URL changes
  useEffect(() => {
    const loadConversationData = async () => {
      if (conversationId && conversationId !== currentConversationId) {
        try {
          console.log('🔄 Loading conversation:', conversationId);
          
          // Set current conversation first
          setCurrentConversation(conversationId);
          
          // Load conversation details
          const conversation = await chatService.getConversation(conversationId);
          console.log('✅ Loaded conversation:', conversation);
          
          // Load messages for this conversation
          const messages = await chatService.getMessages(conversationId);
          setMessages(conversationId, messages);
          console.log('✅ Loaded messages:', messages.length);
          
          // Load artifacts for this conversation  
          const artifacts = await chatService.getArtifacts(conversationId);
          setArtifacts(conversationId, artifacts);
          console.log('✅ Loaded artifacts:', artifacts.length);
          
        } catch (error) {
          console.error('❌ Failed to load conversation:', error);
        }
      } else if (!conversationId) {
        // Clear current conversation if no ID in URL
        setCurrentConversation(null);
      }
    };

    loadConversationData();
  }, [conversationId, currentConversationId, setCurrentConversation, setMessages, setArtifacts]);

  // Load layout configuration and conversations on mount
  useEffect(() => {
    const initializeLayout = async () => {
      try {
        // Load persisted layout
        const savedLayout = await layoutService.loadLayout();
        if (savedLayout) {
          setLayoutState(savedLayout);
        }

        // Load all conversations for sidebar
        const conversations = await chatService.getConversations();
        setConversations(conversations);
        console.log('✅ Loaded conversations:', conversations.length);

      } catch (error) {
        console.error('❌ Layout initialization error:', error);
      }
    };

    initializeLayout();
  }, [setConversations]);

  const { leftPanel, rightPanel, layout } = layoutState;

  return (
    <div className="flex flex-col h-screen">
      <ApplicationHeader />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className={`flex flex-1 ${layout === 'horizontal' ? 'flex-row' : 'flex-col'}`}>
          {/* Left/Top Panel */}
          <div className={`${layout === 'horizontal' ? 'w-1/2' : 'h-1/2'} flex flex-col`}>
            {leftPanel.type === 'conversation' && (
              <ConversationPanel 
                conversationId={conversationId || currentConversationId}
                {...leftPanel.props} 
              />
            )}
            {leftPanel.type === 'code' && (
              <CodeEditor {...leftPanel.props} />
            )}
          </div>

          {/* Right/Bottom Panel */}
          <div className={`${layout === 'horizontal' ? 'w-1/2' : 'h-1/2'} flex flex-col border-l border-border`}>
            {rightPanel.type === 'conversation' && (
              <ConversationPanel 
                conversationId={conversationId || currentConversationId}
                {...rightPanel.props} 
              />
            )}
            {rightPanel.type === 'code' && (
              <CodeEditor {...rightPanel.props} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
