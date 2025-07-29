import { ServerConfig } from '../../../../models/mcp';
import { 
  spawnProcess, 
  killProcess, 
  getProcessInfo,
  ProcessInfo
} from '../../../../utils/process-manager';

/**
 * Process adapter for MCP server management
 * Transforms process management utilities for server-manager feature
 * 
 * AI-Native Rule: This adapter is owned exclusively by server-manager
 */

export interface ProcessAdapter {
  startServer(config: ServerConfig): Promise<ProcessInfo>;
  stopServer(serverId: string): Promise<void>;
  restartServer(serverId: string, config: ServerConfig): Promise<ProcessInfo>;
  getServerStatus(serverId: string): Promise<ProcessStatus>;
  listActiveServers(): Promise<ProcessInfo[]>;
  healthCheck(serverId: string): Promise<HealthResult>;
  killUnresponsiveServer(serverId: string): Promise<void>;
}

export interface ProcessStatus {
  serverId: string;
  pid?: number;
  status: 'running' | 'stopped' | 'crashed' | 'error';
  uptime: number;
  memoryUsage: number;
  cpuUsage: number;
  lastResponse?: Date;
}

export interface HealthResult {
  healthy: boolean;
  responseTime?: number;
  error?: string;
  lastCheck: Date;
}

const activeProcesses = new Map<string, ProcessInfo>();

function buildCommandArgs(config: ServerConfig): string[] {
  const args = [...(config.args || [])];
  if (config.command === 'npx') {
    args.unshift('-y');
  }
  return args;
}

export function createProcessAdapter(): ProcessAdapter {
  const adapter: ProcessAdapter = {
    async startServer(config) {
      try {
        const args = buildCommandArgs(config);
        const processInfo = await spawnProcess(config.command, args, {
          cwd: config.workingDirectory,
          env: { ...process.env, ...config.environment },
          timeout: config.timeout
        });
        activeProcesses.set(config.name, processInfo);
        return processInfo;
      } catch (error) {
        throw new Error(`Failed to start server ${config.name}: ${(error as Error).message}`);
      }
    },

    async stopServer(serverId) {
      const processInfo = activeProcesses.get(serverId);
      if (!processInfo) {
        throw new Error(`Server ${serverId} not found in active processes`);
      }
      
      try {
        await killProcess(processInfo.pid, 'SIGTERM');
        await new Promise(resolve => setTimeout(resolve, 2000));
        try {
          await killProcess(processInfo.pid, 'SIGKILL');
        } catch {
          // Process already dead
        }
        activeProcesses.delete(serverId);
      } catch (error) {
        throw new Error(`Failed to stop server ${serverId}: ${(error as Error).message}`);
      }
    },

    async restartServer(serverId, config) {
      if (activeProcesses.has(serverId)) {
        await adapter.stopServer(serverId);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      return await adapter.startServer(config);
    },

    async getServerStatus(serverId) {
      const processInfo = activeProcesses.get(serverId);
      
      if (!processInfo) {
        return {
          serverId,
          status: 'stopped' as const,
          uptime: 0,
          memoryUsage: 0,
          cpuUsage: 0
        };
      }
      
      try {
        const currentInfo = await getProcessInfo(processInfo.pid);
        if (currentInfo !== null) {
          const uptime = Date.now() - processInfo.startTime.getTime();
          return {
            serverId,
            pid: processInfo.pid,
            status: currentInfo.status,
            uptime,
            memoryUsage: currentInfo.memoryUsage || 0,
            cpuUsage: currentInfo.cpuUsage || 0,
            lastResponse: processInfo.lastResponse
          };
        } else {
          activeProcesses.delete(serverId);
          return {
            serverId,
            status: 'crashed' as const,
            uptime: 0,
            memoryUsage: 0,
            cpuUsage: 0
          };
        }
      } catch (error) {
        activeProcesses.delete(serverId);
        return {
          serverId,
          status: 'crashed' as const,
          uptime: 0,
          memoryUsage: 0,
          cpuUsage: 0
        };
      }
    },

    async listActiveServers() {
      const activeServers = [];
      for (const [serverId, processInfo] of Array.from(activeProcesses.entries())) {
        try {
          const currentInfo = await getProcessInfo(processInfo.pid);
          if (currentInfo !== null && currentInfo.status === 'running') {
            activeServers.push(processInfo);
          } else {
            activeProcesses.delete(serverId);
          }
        } catch {
          activeProcesses.delete(serverId);
        }
      }
      return activeServers;
    },

    async healthCheck(serverId) {
      const processInfo = activeProcesses.get(serverId);
      
      if (!processInfo) {
        return {
          healthy: false,
          error: 'Process not found',
          lastCheck: new Date()
        };
      }
      
      try {
        const startTime = Date.now();
        const currentInfo = await getProcessInfo(processInfo.pid);
        const responseTime = Date.now() - startTime;
        
        if (currentInfo !== null && currentInfo.status === 'running') {
          processInfo.lastResponse = new Date();
          return {
            healthy: true,
            responseTime,
            lastCheck: new Date()
          };
        } else {
          return {
            healthy: false,
            error: `Process status: ${currentInfo?.status || 'not found'}`,
            lastCheck: new Date()
          };
        }
      } catch (error) {
        return {
          healthy: false,
          error: (error as Error).message,
          lastCheck: new Date()
        };
      }
    },

    async killUnresponsiveServer(serverId) {
      const processInfo = activeProcesses.get(serverId);
      if (!processInfo) {
        return;
      }
      
      try {
        await killProcess(processInfo.pid, 'SIGKILL');
        activeProcesses.delete(serverId);
      } catch (error) {
        activeProcesses.delete(serverId);
      }
    }
  };

  return adapter;
}
