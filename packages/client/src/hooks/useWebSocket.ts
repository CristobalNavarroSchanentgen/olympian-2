import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppStore } from '../stores/app-store';
import { useChatStore } from '../stores/chat-store';

export function useWebSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { setConnected, setSystemStatus } = useAppStore();
  const { 
    addMessage, 
    updateMessage, 
    setStreaming, 
    currentConversationId 
  } = useChatStore();

  useEffect(() => {
    socketRef.current = io('http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('🔌 Connected to server');
      setConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('🔌 Disconnected from server');
      setConnected(false);
    });

    socket.on('chat:message', (message) => {
      addMessage(message);
    });

    socket.on('chat:token', (data) => {
      const { messageId, fullContent } = data;
      setStreaming(messageId, fullContent);
      updateMessage(messageId, { content: fullContent });
    });

    socket.on('chat:complete', (data) => {
      const { messageId, fullContent } = data;
      updateMessage(messageId, { 
        content: fullContent,
        metadata: { streaming: false, completed: true }
      });
      setStreaming(null);
    });

    socket.on('chat:error', (data) => {
      console.error('Chat error:', data.error);
      setStreaming(null);
    });

    socket.on('status:update', (status) => {
      setSystemStatus({
        database: status.database?.connected || false,
        mcp: status.mcp?.servers?.some((s: any) => s.status === 'running') || false,
        ollama: status.ollama?.connected || false,
      });
    });

    socket.emit('status:request');

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socketRef.current && currentConversationId) {
      socketRef.current.emit('join:conversation', currentConversationId);
      
      return () => {
        if (socketRef.current) {
          socketRef.current.emit('leave:conversation', currentConversationId);
        }
      };
    }
  }, [currentConversationId]);

  return socketRef.current;
}
