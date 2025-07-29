import { Conversation } from '../../../../models/chat/index';

/**
 * WebSocket adapter for real-time conversation updates
 * Transforms real-time communication for conversation-manager feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by conversation-manager
 */

export interface WebSocketAdapter {
  // Conversation events
  emitConversationCreated(conversation: Conversation): void;
  emitConversationUpdated(conversation: Conversation): void;
  emitConversationDeleted(id: string): void;
  
  // Room management
  joinConversationRoom(conversationId: string, socketId: string): void;
  leaveConversationRoom(conversationId: string, socketId: string): void;
  
  // Broadcasting
  broadcastToConversation(conversationId: string, event: string, data: any): void;
  broadcastToUser(userId: string, event: string, data: any): void;
}

// Helper Functions - Extracted from adapter implementation
function buildConversationRoomId(conversationId: string): string {
  return `conversation:${conversationId}`;
}

function buildUserRoomId(userId: string): string {
  return `user:${userId}`;
}

function getSocketById(io: any, socketId: string): any | null {
  return io.sockets.sockets.get(socketId) || null;
}

function transformConversationForCreated(conversation: Conversation) {
  return {
    id: conversation.id,
    title: conversation.title,
    model: conversation.model,
    createdAt: conversation.createdAt,
    metadata: conversation.metadata
  };
}

function buildListUpdateEvent(action: 'update' | 'delete', conversationOrId: Conversation | string) {
  if (action === 'delete') {
    return { action, id: conversationOrId as string };
  }
  return { action, conversation: conversationOrId as Conversation };
}

function emitConversationCreatedHelper(io: any, conversation: Conversation): void {
  const transformedData = transformConversationForCreated(conversation);
  io.emit('conversation:created', transformedData);
}

function emitConversationUpdatedHelper(io: any, conversation: Conversation): void {
  const roomId = buildConversationRoomId(conversation.id);
  const listUpdateEvent = buildListUpdateEvent('update', conversation);
  
  io.to(roomId).emit('conversation:updated', conversation);
  io.emit('conversation:list_updated', listUpdateEvent);
}

function emitConversationDeletedHelper(io: any, id: string): void {
  const roomId = buildConversationRoomId(id);
  const listUpdateEvent = buildListUpdateEvent('delete', id);
  
  io.to(roomId).emit('conversation:deleted', { id });
  io.emit('conversation:list_updated', listUpdateEvent);
}

function joinConversationRoomHelper(io: any, conversationId: string, socketId: string): void {
  const socket = getSocketById(io, socketId);
  if (socket) {
    const roomId = buildConversationRoomId(conversationId);
    socket.join(roomId);
  }
}

function leaveConversationRoomHelper(io: any, conversationId: string, socketId: string): void {
  const socket = getSocketById(io, socketId);
  if (socket) {
    const roomId = buildConversationRoomId(conversationId);
    socket.leave(roomId);
  }
}

function broadcastToConversationHelper(io: any, conversationId: string, event: string, data: any): void {
  const roomId = buildConversationRoomId(conversationId);
  io.to(roomId).emit(event, data);
}

function broadcastToUserHelper(io: any, userId: string, event: string, data: any): void {
  const roomId = buildUserRoomId(userId);
  io.to(roomId).emit(event, data);
}

export function createWebSocketAdapter(io: any): WebSocketAdapter {
  return {
    emitConversationCreated(conversation) {
      emitConversationCreatedHelper(io, conversation);
    },

    emitConversationUpdated(conversation) {
      emitConversationUpdatedHelper(io, conversation);
    },

    emitConversationDeleted(id) {
      emitConversationDeletedHelper(io, id);
    },

    joinConversationRoom(conversationId, socketId) {
      joinConversationRoomHelper(io, conversationId, socketId);
    },

    leaveConversationRoom(conversationId, socketId) {
      leaveConversationRoomHelper(io, conversationId, socketId);
    },

    broadcastToConversation(conversationId, event, data) {
      broadcastToConversationHelper(io, conversationId, event, data);
    },

    broadcastToUser(userId, event, data) {
      broadcastToUserHelper(io, userId, event, data);
    }
  };
}