import React from 'react';
import { Message } from '@olympian/shared';
import { Bot, User, Copy, Check } from 'lucide-react';
import { useChatStore } from '../../stores/chat-store';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { streamingMessageId, streamingContent } = useChatStore();
  const [copied, setCopied] = React.useState(false);
  
  const isUser = message.role === 'user';
  const isStreaming = streamingMessageId === message.id;
  const displayContent = isStreaming ? streamingContent : message.content;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex gap-4 mb-6 group animate-fade-in ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full shadow-lg flex items-center justify-center ${
        isUser ? 'bg-gradient-to-br from-primary to-blue-600 text-white' : 'bg-gradient-to-br from-accent to-purple-600 text-white'
      }`}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-3xl space-y-2 ${isUser ? 'text-right' : 'text-left'}`}>
        <div className={`inline-block px-5 py-3 rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 ${
          isUser 
            ? 'bg-gradient-to-r from-primary to-blue-600 text-white' 
            : 'bg-panel border border-border/50 text-primary'
        }`}>
          {/* Images */}
          {message.images && message.images.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-3 animate-scale-in">
              {message.images.map((image, idx) => (
                <img
                  key={idx}
                  src={image}
                  alt="Uploaded image"
                  className="max-w-sm max-h-64 rounded-xl border-2 border-border/50 object-cover shadow-md hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          )}

          {/* Text Content */}
          <div className="whitespace-pre-wrap break-words">
            {displayContent}
          </div>

          {/* Streaming indicator */}
          {isStreaming && (
            <div className="mt-2 flex items-center gap-2 text-xs text-white/80">
              <div className="animate-pulse w-2 h-2 bg-white rounded-full"></div>
              <span>AI is typing...</span>
            </div>
          )}
        </div>

        {/* Message metadata */}
        <div className={`mt-2 flex items-center gap-3 text-xs text-muted/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          <span>{new Date(message.createdAt).toLocaleTimeString()}</span>
          {!isUser && (
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-accent/20 rounded-lg transition-all duration-200"
              title="Copy message"
            >
              {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
