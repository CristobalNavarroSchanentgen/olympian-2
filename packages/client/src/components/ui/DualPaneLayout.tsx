import { ApplicationHeader } from "./ApplicationHeader";
import { ConversationPanel } from "./ConversationPanel";
import { CodeEditor } from "./CodeEditor";
import { Sidebar } from "../chat/Sidebar";
import { useChatStore } from "../../stores/chat-store";

export function DualPaneLayout() {
  const { sidebarOpen } = useChatStore();

  return (
    <div className="h-screen flex flex-col" style={{backgroundColor: 'var(--background-main)'}}>
      <ApplicationHeader title="Olympian AI" />
      
      <div className="flex-1 flex pt-14 overflow-hidden">
        {sidebarOpen && (
          <div className="w-80" style={{borderRight: '1px solid var(--border)'}}>
            <Sidebar connected={true} onNewConversation={() => {}} />
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
