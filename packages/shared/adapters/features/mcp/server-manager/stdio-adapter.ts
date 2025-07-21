import { 
  createProtocolHandler,
  ProtocolMessage,
  ProtocolResponse
} from '../../../utils/protocol-handler';

/**
 * STDIO adapter for MCP server communication
 * Transforms stdio protocol handling for server-manager feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */

export interface StdioAdapter {
  // Connection management
  createConnection(serverId: string, process: any): StdioConnection;
  closeConnection(serverId: string): Promise<void>;
  
  // Protocol communication
  sendMessage(serverId: string, message: ProtocolMessage): Promise<ProtocolResponse>;
  sendNotification(serverId: string, method: string, params?: any): Promise<void>;
  
  // Stream handling
  onMessage(serverId: string, handler: (message: ProtocolMessage) => void): void;
  onError(serverId: string, handler: (error: Error) => void): void;
  onClose(serverId: string, handler: () => void): void;
}

export interface StdioConnection {
  serverId: string;
  process: any;
  stdin: NodeJS.WritableStream;
  stdout: NodeJS.ReadableStream;
  stderr: NodeJS.ReadableStream;
  handler: any;
  isActive: boolean;
}

const connections = new Map<string, StdioConnection>();
const messageHandlers = new Map<string, (message: ProtocolMessage) => void>();
const errorHandlers = new Map<string, (error: Error) => void>();
const closeHandlers = new Map<string, () => void>();

export function createStdioAdapter(): StdioAdapter {
  return {
    createConnection(serverId, process) {
      if (connections.has(serverId)) {
        throw new Error(`Connection ${serverId} already exists`);
      }

      const handler = createProtocolHandler({
        transport: 'stdio',
        timeout: 30000
      });

      const connection: StdioConnection = {
        serverId,
        process,
        stdin: process.stdin,
        stdout: process.stdout,
        stderr: process.stderr,
        handler,
        isActive: true
      };

      // Set up stdout data handling
      process.stdout.on('data', (data: Buffer) => {
        try {
          const text = data.toString('utf8');
          const lines = text.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const message = JSON.parse(line);
              this.handleIncomingMessage(serverId, message);
            } catch (e) {
              // Ignore non-JSON lines (debug output, etc.)
            }
          }
        } catch (error) {
          this.handleError(serverId, new Error(`Failed to parse stdout: ${error.message}`));
        }
      });

      // Set up stderr handling
      process.stderr.on('data', (data: Buffer) => {
        const error = new Error(`Server stderr: ${data.toString('utf8')}`);
        this.handleError(serverId, error);
      });

      // Set up process exit handling
      process.on('exit', (code: number) => {
        connection.isActive = false;
        this.handleClose(serverId);
      });

      process.on('error', (error: Error) => {
        connection.isActive = false;
        this.handleError(serverId, error);
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
          } catch {
            // Ignore errors during shutdown
          }
        }

        // Clean up
        connections.delete(serverId);
        messageHandlers.delete(serverId);
        errorHandlers.delete(serverId);
        closeHandlers.delete(serverId);
      } catch (error) {
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
      } catch (error) {
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
      } catch (error) {
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
    },

    // Private helper methods
    handleIncomingMessage(serverId: string, message: any) {
      const handler = messageHandlers.get(serverId);
      if (handler) {
        try {
          handler(message);
        } catch (error) {
          this.handleError(serverId, new Error(`Message handler error: ${error.message}`));
        }
      }
    },

    handleError(serverId: string, error: Error) {
      const handler = errorHandlers.get(serverId);
      if (handler) {
        try {
          handler(error);
        } catch {
          // Prevent recursive errors
        }
      }
    },

    handleClose(serverId: string) {
      const handler = closeHandlers.get(serverId);
      if (handler) {
        try {
          handler();
        } catch {
          // Prevent errors during cleanup
        }
      }
      
      // Clean up connection
      connections.delete(serverId);
    }
  };
}
