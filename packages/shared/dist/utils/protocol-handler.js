/**
 * Protocol Handler Utility
 */
export function parseMessage(data) {
    try {
        const parsed = JSON.parse(data);
        return parsed;
    }
    catch {
        return null;
    }
}
export function formatMessage(message) {
    return JSON.stringify(message);
}
export function createRequest(method, params) {
    return {
        id: Date.now().toString(),
        method,
        params
    };
}
export function createProtocolHandler() {
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