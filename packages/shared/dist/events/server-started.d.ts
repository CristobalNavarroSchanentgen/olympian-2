/**
 * MCP server started event
 */
export interface ServerStartedEvent {
    readonly type: 'server-started';
    readonly serverName: string;
    readonly pid: number;
    readonly command: string;
    readonly timestamp: Date;
    readonly metadata: {
        readonly runner: string;
        readonly args: string[];
        readonly restartCount: number;
        readonly startupTime: number;
    };
}
export declare function createServerStartedEvent(serverName: string, pid: number, command: string, runner: string, args: string[], restartCount: number, startupTime: number): ServerStartedEvent;
//# sourceMappingURL=server-started.d.ts.map