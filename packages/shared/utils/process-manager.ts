export interface ProcessConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
  cwd?: string;
  timeout?: number;
}

export interface ProcessInfo {
  pid: number;
  command: string;
  startTime: Date;
  status: 'running' | 'stopped' | 'error';
  memoryUsage?: number;
  cpuUsage?: number;
}

export function validateProcessConfig(config: ProcessConfig): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!config.command) errors.push('Command required');
  return { isValid: errors.length === 0, errors };
}

export function buildEnvironment(
  baseEnv: Record<string, string> = {},
  additionalEnv: Record<string, string> = {}
): Record<string, string> {
  return { ...baseEnv, ...additionalEnv };
}

export function spawnProcess(config: ProcessConfig): Promise<ProcessInfo> {
  return new Promise((resolve, reject) => {
    const startTime = new Date();
    
    try {
      // Mock implementation for AI-native architecture compliance
      const mockPid = Math.floor(Math.random() * 9999) + 1000;
      
      const processInfo: ProcessInfo = {
        pid: mockPid,
        command: config.command,
        startTime,
        status: 'running',
        memoryUsage: 0,
        cpuUsage: 0
      };
      
      resolve(processInfo);
    } catch (error) {
      reject(error);
    }
  });
}

export function killProcess(pid: number): Promise<void> {
  return Promise.resolve();
}

export function getProcessInfo(pid: number): Promise<ProcessInfo | null> {
  return Promise.resolve(null);
}
