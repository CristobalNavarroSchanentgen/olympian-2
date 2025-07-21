import { Express } from 'express';
import { DatabaseService } from '../../database/database-service';
import { MCPManager } from '../../mcp/mcp-manager';

import { conversationRoutes } from './conversations';
import { messageRoutes } from './messages';
import { mcpRoutes } from './mcp';
import { ollamaRoutes } from './ollama';
import { artifactRoutes } from './artifacts';

export function setupRoutes(
  app: Express, 
  dbService: DatabaseService, 
  mcpManager: MCPManager
): void {
  
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        mcp: mcpManager.getServerStatus().length > 0 ? 'running' : 'stopped'
      }
    });
  });

  // Feature routes
  app.use('/api/conversations', conversationRoutes(dbService));
  app.use('/api/messages', messageRoutes(dbService));
  app.use('/api/mcp', mcpRoutes(mcpManager));
  app.use('/api/ollama', ollamaRoutes());
  app.use('/api/artifacts', artifactRoutes(dbService));
}
