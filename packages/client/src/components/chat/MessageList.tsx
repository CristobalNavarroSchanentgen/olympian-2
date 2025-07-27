import { Message } from '@olympian/shared';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="px-4 py-6 max-w-5xl mx-auto w-full">
      {messages.map((message, index) => (
        <div
          key={message.id}
          style={{ animationDelay: `${index * 50}ms` }}
          className="animate-fade-in"
        >
          <MessageBubble message={message} />
        </div>
      ))}
    </div>
  );
}
