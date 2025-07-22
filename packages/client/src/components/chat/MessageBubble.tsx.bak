import { Message } from '@olympian/shared';
import { Bot, User, Copy } from 'lucide-react';
import { useChatStore } from '../../stores/chat-store';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { streamingMessageId, streamingContent } = useChatStore();
  
  const isUser = message.role === 'user';
  const isStreaming = streamingMessageId === message.id;
  const displayContent = isStreaming ? streamingContent : message.content;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
        isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
      }`}>
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block p-4 rounded-lg ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-muted border border-border'
        }`}>
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {message.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt="Uploaded image"
                  className="max-w-sm max-h-64 rounded border object-cover"
                />
              ))}
            </div>
          )}

          {/* Text Content */}
          <div className={`prose prose-sm max-w-none ${
            isUser ? 'prose-invert' : ''
          } ${isStreaming ? 'typewriter' : ''}`}>
            <pre className="whitespace-pre-wrap font-sans">{displayContent}</pre>
          </div>

          {/* Streaming indicator */}
          {isStreaming && (
            <div className="mt-2 flex items-center gap-2 text-xs opacity-70">
              <div className="animate-pulse w-2 h-2 bg-current rounded-full"></div>
              <span>AI is typing...</span>
            </div>
          )}
        </div>

        {/* Message metadata */}
        <div className={`mt-1 flex items-center gap-2 text-xs text-muted-foreground ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
          {!isUser && (
            <button
              onClick={copyToClipboard}
              className="p-1 hover:bg-muted rounded"
              title="Copy message"
            >
              <Copy className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
