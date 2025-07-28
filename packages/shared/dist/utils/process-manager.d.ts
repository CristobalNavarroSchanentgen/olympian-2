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
export declare function validateProcessConfig(config: ProcessConfig): {
    isValid: boolean;
    errors: string[];
};
export declare function buildEnvironment(baseEnv?: Record<string, string>, additionalEnv?: Record<string, string>): Record<string, string>;
export declare function spawnProcess(command: string, args: string[], options?: ProcessOptions): Promise<ProcessInfo>;
export declare function spawnProcessFromConfig(config: ProcessConfig): Promise<ProcessInfo>;
export declare function killProcess(pid: number, signal?: string): Promise<void>;
export declare function getProcessInfo(pid: number): Promise<ProcessInfo | null>;
//# sourceMappingURL=process-manager.d.ts.map