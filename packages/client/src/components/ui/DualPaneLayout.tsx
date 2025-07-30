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
    addConversation
  } = useChatStore();
  
  const { connected } = useAppStore();

  // Load layout configuration and conversations on mount
  useEffect(() => {
    const initializeLayout = async () => {
      try {
        // Load persisted layout
        const savedLayout = await layoutService.loadLayout();
        if (savedLayout) {
          const updatedLayout = await layoutService.updateLayout(savedLayout);
          
        }
      } catch (error) {
        console.error('Failed to initialize layout:', error);
      }
    };

    const loadConversations = async () => {
      try {
        const existingConversations = await chatService.getConversations();
        setConversations(existingConversations);
        
        if (existingConversations.length === 0 || !currentConversationId) {
          handleNewConversation();
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        handleNewConversation();
      }
    };

    initializeLayout();
    loadConversations();
  }, []);

  // AI-native layout handlers using service
  const handleToggleSidebar = async () => {
    try {
      const updatedLayout = await layoutService.updateLayout({ 
        sidebarOpen: !layoutState.sidebarOpen 
      });
      
    } catch (error) {
      console.error('Failed to toggle sidebar:', error);
    }
  };

  const handleToggleCodeEditor = async () => {
    try {
      const updatedLayout = await layoutService.togglePanel('codeEditor');
      
    } catch (error) {
      console.error('Failed to toggle code editor:', error);
    }
  };

  const handleToggleReasoningPanel = async () => {
    try {
      const updatedLayout = await layoutService.togglePanel('reasoning');
      
    } catch (error) {
      console.error('Failed to toggle reasoning panel:', error);
    }
  };

  const handleNewConversation = () => {
    const newConversation = addConversation('New Chat');
    console.log('Created new conversation:', newConversation.id);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar 
        isOpen={layoutState.sidebarOpen}
        onToggle={handleToggleSidebar}
        onNewConversation={handleNewConversation}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <ApplicationHeader title="Olympian AI" 
          onToggleSidebar={handleToggleSidebar}
          onToggleCodeEditor={handleToggleCodeEditor}
          onToggleReasoningPanel={handleToggleReasoningPanel}
          connected={connected}
          sidebarOpen={layoutState.sidebarOpen}
          codeEditorOpen={layoutState.codeEditorOpen}
          reasoningPanelOpen={layoutState.reasoningPanelOpen}
        />

        {/* Dual Pane Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Conversation Panel */}
          <div 
            className="flex flex-col border-r border-gray-700"
            style={{ 
              width: layoutState.codeEditorOpen 
                ? `${layoutState.conversationPanelWidth}%` 
                : '100%' 
            }}
          >
            <ConversationPanel />
          </div>

          {/* Code Editor Panel */}
          {layoutState.codeEditorOpen && (
            <div 
              className="flex flex-col"
              style={{ 
                width: `${100 - layoutState.conversationPanelWidth}%` 
              }}
            >
              <CodeEditor />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
