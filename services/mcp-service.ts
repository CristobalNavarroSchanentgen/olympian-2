export interface McpService {
  startServer(serverId: string, config: any): Promise<void>;
  stopServer(serverId: string): Promise<void>;
  isServerRunning(serverId: string): boolean;
  getAllRunningServers(): string[];
  getServerStatus(serverId: string): any;
}

