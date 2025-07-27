import { Conversation } from '../../../../models/chat/index';
/**
 * WebSocket adapter for real-time conversation updates
 * Transforms real-time communication for conversation-manager feature
 *
 * AI-Native Rule: This adapter is owned exclusively by conversation-manager
 */
export interface WebSocketAdapter {
    emitConversationCreated(conversation: Conversation): void;
    emitConversationUpdated(conversation: Conversation): void;
    emitConversationDeleted(id: string): void;
    joinConversationRoom(conversationId: string, socketId: string): void;
    leaveConversationRoom(conversationId: string, socketId: string): void;
    broadcastToConversation(conversationId: string, event: string, data: any): void;
    broadcastToUser(userId: string, event: string, data: any): void;
}
export declare function createWebSocketAdapter(io: any): WebSocketAdapter;
//# sourceMappingURL=websocket-adapter.d.ts.map