/**
 * Feature Implementation: MCP Server Manager
 */

import { ServerManagerContract, ServerManagerDependencies } from "./contract";
import { McpServerConfig } from "../../../models/mcp/server-config";

export class ServerManager implements ServerManagerContract {
  private runningServers = new Map<string, any>();
  
  constructor(private deps: ServerManagerDependencies) {}

  async startServer(serverName: string): Promise<void> {
    const config = await this.deps.mcpService.getServerConfig(serverName);
    if (!config) {
      throw new Error(`Server config not found: ${serverName}`);
    }

    if (this.runningServers.has(serverName)) {
      throw new Error(`Server already running: ${serverName}`);
    }

    const process = await this.deps.processAdapter.startProcess({
      command: config.command,
      args: config.args,
      env: config.env,
      stdio: "pipe"
    });

    this.runningServers.set(serverName, process);

    // Setup stdio communication
    await this.deps.stdioAdapter.setupCommunication(serverName, process);

    this.deps.eventPublisher.publishServerStarted({
      serverName,
      pid: process.pid,
      timestamp: new Date()
    });
  }

  async stopServer(serverName: string): Promise<void> {
    const process = this.runningServers.get(serverName);
    if (!process) {
      throw new Error(`Server not running: ${serverName}`);
    }

    await this.deps.processAdapter.stopProcess(process);
    this.runningServers.delete(serverName);

    await this.deps.stdioAdapter.closeCommunication(serverName);

    this.deps.eventPublisher.publishServerStopped({
      serverName,
      timestamp: new Date()
    });
  }

  async restartServer(serverName: string): Promise<void> {
    if (this.runningServers.has(serverName)) {
      await this.stopServer(serverName);
    }
    await this.startServer(serverName);
  }

  async getServerStatus(serverName: string): Promise<any> {
    const process = this.runningServers.get(serverName);
    const isRunning = !!process;
    
    return {
      name: serverName,
      status: isRunning ? "running" : "stopped",
      pid: process?.pid,
      uptime: process ? Date.now() - process.startTime : 0,
      memoryUsage: process ? await this.deps.processAdapter.getMemoryUsage(process.pid) : 0,
      health: isRunning ? await this.deps.healthMonitor.checkServerHealth(serverName) : "stopped"
    };
  }

  async listServers(): Promise<any[]> {
    const configs = await this.deps.mcpService.getAllServerConfigs();
    
    return Promise.all(
      configs.map(async config => ({
        ...config,
        status: await this.getServerStatus(config.name)
      }))
    );
  }

  async configureServer(serverName: string, config: McpServerConfig): Promise<void> {
    await this.deps.mcpService.updateServerConfig(serverName, config);
    
    // Restart if running
    if (this.runningServers.has(serverName)) {
      await this.restartServer(serverName);
    }
  }

  async removeServer(serverName: string): Promise<void> {
    if (this.runningServers.has(serverName)) {
      await this.stopServer(serverName);
    }
    
    await this.deps.mcpService.removeServerConfig(serverName);
  }

  async getServerLogs(serverName: string, lines?: number): Promise<string[]> {
    return await this.deps.processAdapter.getLogs(serverName, lines || 100);
  }

  async getServerHealth(serverName: string): Promise<any> {
    const status = await this.getServerStatus(serverName);
    
    if (status.status !== "running") {
      return { status: "stopped", healthy: false };
    }

    return await this.deps.healthMonitor.checkServerHealth(serverName);
  }

  async startAllServers(): Promise<void> {
    const configs = await this.deps.mcpService.getAllServerConfigs();
    
    for (const config of configs) {
      if (config.autoStart) {
        try {
          await this.startServer(config.name);
        } catch (error) {
          console.error(`Failed to start server ${config.name}:`, error);
        }
      }
    }
  }

  async stopAllServers(): Promise<void> {
    const serverNames = Array.from(this.runningServers.keys());
    
    for (const serverName of serverNames) {
      try {
        await this.stopServer(serverName);
      } catch (error) {
        console.error(`Failed to stop server ${serverName}:`, error);
      }
    }
  }

  async updateConfig(config: any): Promise<void> {
    Object.assign(this.deps.config, config);
  }

  getConfig(): any {
    return { ...this.deps.config };
  }
}
