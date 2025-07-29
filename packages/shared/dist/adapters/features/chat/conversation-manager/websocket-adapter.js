"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketAdapter = createWebSocketAdapter;
// Helper Functions - Extracted from adapter implementation
function buildConversationRoomId(conversationId) {
    return `conversation:${conversationId}`;
}
function buildUserRoomId(userId) {
    return `user:${userId}`;
}
function getSocketById(io, socketId) {
    return io.sockets.sockets.get(socketId) || null;
}
function transformConversationForCreated(conversation) {
    return {
        id: conversation.id,
        title: conversation.title,
        model: conversation.model,
        createdAt: conversation.createdAt,
        metadata: conversation.metadata
    };
}
function buildListUpdateEvent(action, conversationOrId) {
    if (action === 'delete') {
        return { action, id: conversationOrId };
    }
    return { action, conversation: conversationOrId };
}
function emitConversationCreatedHelper(io, conversation) {
    const transformedData = transformConversationForCreated(conversation);
    io.emit('conversation:created', transformedData);
}
function emitConversationUpdatedHelper(io, conversation) {
    const roomId = buildConversationRoomId(conversation.id);
    const listUpdateEvent = buildListUpdateEvent('update', conversation);
    io.to(roomId).emit('conversation:updated', conversation);
    io.emit('conversation:list_updated', listUpdateEvent);
}
function emitConversationDeletedHelper(io, id) {
    const roomId = buildConversationRoomId(id);
    const listUpdateEvent = buildListUpdateEvent('delete', id);
    io.to(roomId).emit('conversation:deleted', { id });
    io.emit('conversation:list_updated', listUpdateEvent);
}
function joinConversationRoomHelper(io, conversationId, socketId) {
    const socket = getSocketById(io, socketId);
    if (socket) {
        const roomId = buildConversationRoomId(conversationId);
        socket.join(roomId);
    }
}
function leaveConversationRoomHelper(io, conversationId, socketId) {
    const socket = getSocketById(io, socketId);
    if (socket) {
        const roomId = buildConversationRoomId(conversationId);
        socket.leave(roomId);
    }
}
function broadcastToConversationHelper(io, conversationId, event, data) {
    const roomId = buildConversationRoomId(conversationId);
    io.to(roomId).emit(event, data);
}
function broadcastToUserHelper(io, userId, event, data) {
    const roomId = buildUserRoomId(userId);
    io.to(roomId).emit(event, data);
}
function createWebSocketAdapter(io) {
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
//# sourceMappingURL=websocket-adapter.js.map