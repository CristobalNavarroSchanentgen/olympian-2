import { useRef, useEffect } from 'react';
import { Send, Paperclip, X } from 'lucide-react';
import { useChatStore } from '../../stores/chat-store';
import { useAppStore } from '../../stores/app-store';
import { useWebSocket } from '../../hooks/useWebSocket';
import { chatService } from '../../services/chat-service';

interface MessageInputProps {
  disabled?: boolean;
}

export function MessageInput({ disabled = false }: MessageInputProps) {
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
    addMessage
  } = useChatStore();

  const { textModel } = useAppStore();

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
    if (!currentConversationId || !socket || disabled || !textModel) return;

    const messageContent = inputValue.trim();
    const images = [...selectedImages];

    // Clear input immediately
    setInputValue('');
    setSelectedImages([]);

    try {
      // Create user message in database
      const userMessage = await chatService.createMessage({
        conversationId: currentConversationId,
        role: 'user',
        content: messageContent,
        images: images.length > 0 ? images : undefined,
        metadata: {}
      });

      // Add user message to local store
      addMessage(userMessage);

      // Send via WebSocket for AI response
      socket.emit('chat:message', {
        conversationId: currentConversationId,
        content: messageContent,
        images: images.length > 0 ? images : undefined,
        model: textModel
      });

    } catch (error) {
      console.error('Failed to send message:', error);
      // Restore input on error
      setInputValue(messageContent);
      setSelectedImages(images);
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
      <div className="p-4 text-center text-secondary">
        Select a conversation to start chatting
      </div>
    );
  }

  const isInputDisabled = disabled || !textModel;
  const placeholderText = !textModel 
    ? "Select a model above to start chatting..."
    : "Type your message... (Shift+Enter for new line)";

  return (
    <div className="input-area p-4 bg-gradient-to-t from-panel/50 to-transparent">
      {/* Selected Images Preview */}
      {selectedImages.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-3 animate-slide-up">
          {(selectedImages || []).map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt="Selected"
                className="w-24 h-24 object-cover rounded-lg border-2 border-border shadow-lg hover:scale-105 transition-transform"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute -top-3 -right-3 w-6 h-6 shadow-md bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                disabled={isInputDisabled}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Model requirement notice */}
      {!textModel && (
        <div className="mb-4 p-3 bg-muted/50 border border-border rounded-lg text-center">
          <p className="text-sm text-muted-foreground">
            ? Please select an AI model from the header to start chatting
          </p>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end gap-2">
        {/* Attach Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isInputDisabled}
          className="p-3 text-muted hover:text-primary hover:bg-accent/20 rounded-xl transition-all duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Paperclip className="h-6 w-6" />
        </button>

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholderText}
            disabled={isInputDisabled}
            className="w-full px-5 py-4 pr-14 rounded-xl bg-panel/80 backdrop-blur-sm border-2 border-border/50 placeholder:text-muted/70 text-primary resize-none min-h-[48px] max-h-32 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            rows={1}
          />
          
          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={(!inputValue.trim() && selectedImages.length === 0) || isInputDisabled}
            className="absolute right-3 bottom-3 p-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary hover:scale-110 transition-all duration-200 disabled:text-muted disabled:cursor-not-allowed disabled:hover:scale-100 disabled:bg-transparent"
            title={!textModel ? 'Select a model first' : 'Send message'}
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          disabled={isInputDisabled}
          className="hidden"
        />
      </div>
    </div>
  );
}