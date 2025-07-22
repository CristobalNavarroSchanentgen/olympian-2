import React from 'react';

interface SidebarProps {
  connected: boolean;
  onNewConversation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ connected, onNewConversation }) => {
  return (
    <div className="w-64 style="background-color: var(--background-panel); border-right: 1px solid var(--border);" p-4">
      <div className="mb-4">
        <span className="text-sm">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <button onClick={onNewConversation} className="w-full mt-2 model-selector text-primary rounded-md flex items-center justify-center space-x-2">
          New Chat
        </button>
      </div>
    </div>
  );
};
