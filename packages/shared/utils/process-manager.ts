export interface ProcessConfig {
  command: string;
  args: string[];
  env: Record<string, string>;
  cwd?: string;
  timeout?: number;
}

export interface ProcessOptions {
  cwd?: string;
  env?: Record<string, string>;
  stdio?: string[];
  timeout?: number;
}

export interface ProcessInfo {
  pid: number;
  command: string;
  startTime: Date;
  status: 'running' | 'stopped' | 'crashed' | 'error';
  memoryUsage?: number;
  cpuUsage?: number;
  lastResponse?: Date;
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

// Updated function signature to match adapter usage
export function spawnProcess(
  command: string,
  args: string[],
  options?: ProcessOptions
): Promise<ProcessInfo> {
  return new Promise((resolve, reject) => {
    const startTime = new Date();
    
    try {
      // Mock implementation for AI-native architecture compliance
      const mockPid = Math.floor(Math.random() * 9999) + 1000;
      
      const processInfo: ProcessInfo = {
        pid: mockPid,
        command,
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

// Backward compatibility: support old signature
export function spawnProcessFromConfig(config: ProcessConfig): Promise<ProcessInfo> {
  return spawnProcess(config.command, config.args, {
    cwd: config.cwd,
    env: config.env,
    timeout: config.timeout
  });
}

export function killProcess(pid: number, signal?: string): Promise<void> {
  return Promise.resolve();
}

export function getProcessInfo(pid: number): Promise<ProcessInfo | null> {
  return Promise.resolve(null);
}
