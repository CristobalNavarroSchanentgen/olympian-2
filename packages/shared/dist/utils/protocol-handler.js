"use strict";
/**
 * Protocol Handler Utility
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMessage = parseMessage;
exports.formatMessage = formatMessage;
exports.createRequest = createRequest;
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
//# sourceMappingURL=protocol-handler.js.map