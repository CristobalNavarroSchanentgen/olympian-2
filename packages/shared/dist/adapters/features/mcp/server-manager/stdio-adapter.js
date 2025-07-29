"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStdioAdapter = createStdioAdapter;
const protocol_handler_1 = require("../../../../utils/protocol-handler");
const connections = new Map();
const messageHandlers = new Map();
const errorHandlers = new Map();
const closeHandlers = new Map();
// Helper functions moved outside - AI-Native pattern
function handleIncomingMessage(serverId, message) {
    const handler = messageHandlers.get(serverId);
    if (handler) {
        try {
            handler(message);
        }
        catch (error) {
            handleError(serverId, new Error(`Message handler error: ${error.message}`));
        }
    }
}
function handleError(serverId, error) {
    const handler = errorHandlers.get(serverId);
    if (handler) {
        try {
            handler(error);
        }
        catch {
            // Prevent recursive errors
        }
    }
}
function handleClose(serverId) {
    const handler = closeHandlers.get(serverId);
    if (handler) {
        try {
            handler();
        }
        catch {
            // Prevent errors during cleanup
        }
    }
    // Clean up connection
    connections.delete(serverId);
}
function createStdioAdapter() {
    return {
        createConnection(serverId, process) {
            if (connections.has(serverId)) {
                throw new Error(`Connection ${serverId} already exists`);
            }
            // Fix: createProtocolHandler expects 0 arguments
            const handler = (0, protocol_handler_1.createProtocolHandler)();
            const connection = {
                serverId,
                process,
                stdin: process.stdin,
                stdout: process.stdout,
                stderr: process.stderr,
                handler,
                isActive: true
            };
            // Set up stdout data handling
            process.stdout.on('data', (data) => {
                try {
                    const text = data.toString('utf8');
                    const lines = text.split('\n').filter(line => line.trim());
                    for (const line of lines) {
                        try {
                            const message = JSON.parse(line);
                            handleIncomingMessage(serverId, message);
                        }
                        catch (e) {
                            // Ignore non-JSON lines (debug output, etc.)
                        }
                    }
                }
                catch (error) {
                    handleError(serverId, new Error(`Failed to parse stdout: ${error.message}`));
                }
            });
            // Set up stderr handling
            process.stderr.on('data', (data) => {
                const error = new Error(`Server stderr: ${data.toString('utf8')}`);
                handleError(serverId, error);
            });
            // Set up process exit handling
            process.on('exit', (code) => {
                connection.isActive = false;
                handleClose(serverId);
            });
            process.on('error', (error) => {
                connection.isActive = false;
                handleError(serverId, error);
            });
            connections.set(serverId, connection);
            return connection;
        },
        async closeConnection(serverId) {
            const connection = connections.get(serverId);
            if (!connection) {
                return; // Already closed
            }
            try {
                connection.isActive = false;
                // Send shutdown notification if process is still alive
                if (!connection.process.killed) {
                    try {
                        await this.sendNotification(serverId, 'shutdown');
                    }
                    catch {
                        // Ignore errors during shutdown
                    }
                }
                // Clean up
                connections.delete(serverId);
                messageHandlers.delete(serverId);
                errorHandlers.delete(serverId);
                closeHandlers.delete(serverId);
            }
            catch (error) {
                // Clean up anyway
                connections.delete(serverId);
            }
        },
        async sendMessage(serverId, message) {
            const connection = connections.get(serverId);
            if (!connection || !connection.isActive) {
                throw new Error(`Connection ${serverId} not available`);
            }
            try {
                return await connection.handler.sendMessage(message, {
                    stdin: connection.stdin,
                    stdout: connection.stdout
                });
            }
            catch (error) {
                throw new Error(`Failed to send message to ${serverId}: ${error.message}`);
            }
        },
        async sendNotification(serverId, method, params) {
            const connection = connections.get(serverId);
            if (!connection || !connection.isActive) {
                throw new Error(`Connection ${serverId} not available`);
            }
            const notification = {
                jsonrpc: '2.0',
                method,
                params: params || {}
            };
            try {
                const data = JSON.stringify(notification) + '\n';
                connection.stdin.write(data);
            }
            catch (error) {
                throw new Error(`Failed to send notification to ${serverId}: ${error.message}`);
            }
        },
        onMessage(serverId, handler) {
            messageHandlers.set(serverId, handler);
        },
        onError(serverId, handler) {
            errorHandlers.set(serverId, handler);
        },
        onClose(serverId, handler) {
            closeHandlers.set(serverId, handler);
        }
    };
}
//# sourceMappingURL=stdio-adapter.js.map