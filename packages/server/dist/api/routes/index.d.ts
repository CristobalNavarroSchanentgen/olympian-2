import { Express } from 'express';
import { DatabaseService } from '../../database/database-service';
import { MCPManager } from '../../mcp/mcp-manager';
export declare function setupRoutes(app: Express, dbService: DatabaseService, mcpManager: MCPManager): void;
