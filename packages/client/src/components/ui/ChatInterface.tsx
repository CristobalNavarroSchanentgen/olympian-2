import { ConversationPanel } from './ConversationPanel';

interface ChatInterfaceProps {
  conversationId?: string | null;
}

export function ChatInterface({ conversationId }: ChatInterfaceProps) {
  return (
    <div className="flex-1 flex flex-col h-full">
      <ConversationPanel conversationId={conversationId} />
    </div>
  );
}
