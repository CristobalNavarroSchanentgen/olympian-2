import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

import { DatabaseService } from './database/database-service';
import { MCPManager } from './mcp/mcp-manager';
import { WebSocketHandler } from './websocket/websocket-handler';
import { setupRoutes } from './api/routes';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000"
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

async function startServer() {
  try {
    // Initialize database
    const dbService = new DatabaseService();
    await dbService.connect();
    console.log('📊 Database connected');

    // Initialize MCP Manager
    const mcpManager = new MCPManager();
    await mcpManager.initialize();
    console.log('🔧 MCP Manager initialized');

    // Setup WebSocket handling
    const wsHandler = new WebSocketHandler(io, dbService, mcpManager);
    wsHandler.initialize();
    console.log('🔌 WebSocket handler initialized');

    // Setup API routes
    setupRoutes(app, dbService, mcpManager);
    console.log('🛣️  API routes configured');

    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
