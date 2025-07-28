"use strict";
/**
 * Protocol Handler Utility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = parseMessage;
exports.formatMessage = formatMessage;
exports.createRequest = createRequest;
exports.createProtocolHandler = createProtocolHandler;
function parseMessage(data) {
    try {
        const parsed = JSON.parse(data);
        return parsed;
    }
    catch {
        return null;
    }
}
function formatMessage(message) {
    return JSON.stringify(message);
}
function createRequest(method, params) {
    return {
        id: Date.now().toString(),
        method,
        params
    };
}
function createProtocolHandler() {
    const messageCallbacks = [];
    return {
        async sendMessage(message) {
            // Mock implementation
            await new Promise(resolve => setTimeout(resolve, 10));
        },
        handleResponse(response) {
            // Mock implementation
        },
        onMessage(callback) {
            messageCallbacks.push(callback);
        }
    };
}
//# sourceMappingURL=protocol-handler.js.map