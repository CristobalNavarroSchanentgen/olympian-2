import { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, X, Image } from 'lucide-react';
import { useChatStore } from '../../stores/chat-store';
import { useWebSocket } from '../../hooks/useWebSocket';
import { chatService } from '../../services/chat-service';

export function MessageInput() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socket = useWebSocket();
  
  const {
    currentConversationId,
    inputValue,
    setInputValue,
    selectedImages,
    addImage,
    removeImage,
    setSelectedImages,
    conversations
  } = useChatStore();

  const currentConversation = conversations.find(c => c.id === currentConversationId);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [inputValue]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            addImage(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() && selectedImages.length === 0) return;
    if (!currentConversationId || !socket) return;

    const messageContent = inputValue.trim();
    const images = [...selectedImages];

    // Clear input immediately
    setInputValue('');
    setSelectedImages([]);

    // Create user message in database
    try {
      await chatService.createMessage({
        conversationId: currentConversationId,
        role: 'user',
        content: messageContent,
        images: images.length > 0 ? images : undefined,
        metadata: {}
      });

      // Send via WebSocket for AI response
      socket.emit('chat:message', {
        conversationId: currentConversationId,
        content: messageContent,
        images: images.length > 0 ? images : undefined,
        model: currentConversation?.model || 'llama3.2:latest'
      });

    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (!currentConversationId) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select a conversation to start chatting
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedImages.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt="Selected"
                className="w-20 h-20 object-cover rounded border"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attach Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Shift+Enter for new line)"
            className="w-full px-4 py-3 pr-12 rounded-lg border border-input bg-background resize-none min-h-[48px] max-h-32 focus:outline-none focus:ring-2 focus:ring-ring"
            rows={1}
          />
          
          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!inputValue.trim() && selectedImages.length === 0}
            className="absolute right-2 bottom-2 p-2 text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
        />
      </div>
    </div>
  );
}
