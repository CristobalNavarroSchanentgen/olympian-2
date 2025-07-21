"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocketAdapter = createWebSocketAdapter;
function createWebSocketAdapter(io) {
    return {
        emitConversationCreated(conversation) {
            io.emit('conversation:created', {
                id: conversation.id,
                title: conversation.title,
                model: conversation.model,
                createdAt: conversation.createdAt,
                metadata: conversation.metadata
            });
        },
        emitConversationUpdated(conversation) {
            // Emit to conversation room and general updates
            io.to(`conversation:${conversation.id}`).emit('conversation:updated', conversation);
            io.emit('conversation:list_updated', {
                action: 'update',
                conversation
            });
        },
        emitConversationDeleted(id) {
            io.to(`conversation:${id}`).emit('conversation:deleted', { id });
            io.emit('conversation:list_updated', {
                action: 'delete',
                id
            });
        },
        joinConversationRoom(conversationId, socketId) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.join(`conversation:${conversationId}`);
            }
        },
        leaveConversationRoom(conversationId, socketId) {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) {
                socket.leave(`conversation:${conversationId}`);
            }
        },
        broadcastToConversation(conversationId, event, data) {
            io.to(`conversation:${conversationId}`).emit(event, data);
        },
        broadcastToUser(userId, event, data) {
            io.to(`user:${userId}`).emit(event, data);
        }
    };
}
//# sourceMappingURL=websocket-adapter.js.map