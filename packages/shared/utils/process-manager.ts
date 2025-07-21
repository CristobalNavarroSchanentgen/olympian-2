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
