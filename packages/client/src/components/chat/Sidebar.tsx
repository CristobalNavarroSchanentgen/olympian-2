import React from 'react';

interface SidebarProps {
  conversations: any[];
  connected: boolean;
  onNewConversation: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ conversations, connected, onNewConversation }) => {
  return (
    <div className="w-64 bg-gray-50 border-r p-4">
      <div className="mb-4">
        <span className="text-sm">
          {connected ? 'Connected' : 'Disconnected'}
        </span>
        <button onClick={onNewConversation} className="w-full mt-2 bg-blue-500 text-white px-3 py-2 rounded">
          New Chat
        </button>
      </div>
    </div>
  );
};
