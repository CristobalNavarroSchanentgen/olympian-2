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
export declare function validateProcessConfig(config: ProcessConfig): {
    isValid: boolean;
    errors: string[];
};
export declare function buildEnvironment(baseEnv?: Record<string, string>, additionalEnv?: Record<string, string>): Record<string, string>;
//# sourceMappingURL=process-manager.d.ts.map