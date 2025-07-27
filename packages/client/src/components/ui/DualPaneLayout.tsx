import { useEffect } from 'react';
import { ApplicationHeader } from "./ApplicationHeader";
import { ConversationPanel } from "./ConversationPanel";
import { CodeEditor } from "./CodeEditor";
import { Sidebar } from "../chat/Sidebar";
import { useChatStore } from "../../stores/chat-store";
import { useAppStore } from "../../stores/app-store";
import { chatService } from "../../services/chat-service";

export function DualPaneLayout() {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    setConversations, 
    currentConversationId, 
    setCurrentConversation,
    addConversation
  } = useChatStore();
  
  const { 
    textModel, 
    visionModel, 
    autoDetectModel, 
    setTextModel, 
    setVisionModel, 
    setAutoDetectModel,
    connected
  } = useAppStore();

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const existingConversations = await chatService.getConversations();
        setConversations(existingConversations);
        
        // If no conversations exist or no current conversation, create a new one
        if (existingConversations.length === 0 || !currentConversationId) {
          handleNewConversation();
        }
      } catch (error) {
        console.error('Failed to load conversations:', error);
        // Create a default conversation even if API fails
        handleNewConversation();
      }
    };

    loadConversations();
  }, []);

  const handleNewConversation = async () => {
    try {
      const newConversation = await chatService.createConversation({
        title: 'New Chat',
        model: textModel,
      });
      
      addConversation(newConversation);
      setCurrentConversation(newConversation.id);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      
      // Fallback: create a local conversation
      const fallbackConversation = {
        id: Date.now().toString(),
        title: 'New Chat',
        model: textModel,
        createdAt: new Date(),        updatedAt: new Date(),
        messageCount: 0,        metadata: {}
      };
      
      addConversation(fallbackConversation);
      setCurrentConversation(fallbackConversation.id);
    }
  };

  const handleHistoryClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleConnectionsClick = () => {
    console.log('Connections clicked');
  };

  const handleMCPClick = () => {
    console.log('MCP Config clicked');
  };

  return (
    <div className="h-screen flex flex-col" style={{backgroundColor: 'var(--background-main)'}}>
      <ApplicationHeader 
        title="Olympian AI" 
        modelSelector={{
          textModel,
          visionModel,
          onTextModelChange: setTextModel,
          onVisionModelChange: setVisionModel,
          autoDetect: autoDetectModel,
          onAutoDetectToggle: () => setAutoDetectModel(!autoDetectModel)
        }}
        onHistoryClick={handleHistoryClick}
        onConnectionsClick={handleConnectionsClick}
        onMCPClick={handleMCPClick}
      />
      
      <div className="flex-1 flex pt-14 overflow-hidden">
        {sidebarOpen && (
          <div className="w-80" style={{borderRight: '1px solid var(--border)'}}>
            <Sidebar connected={connected} onNewConversation={handleNewConversation} />
          </div>
        )}
        
        <div className="flex-1 flex">
          <div className="flex-1">
            <ConversationPanel />
          </div>
          <div className="w-1/2">
            <CodeEditor content="# Sample script" />
          </div>
        </div>
      </div>
    </div>
  );
}
