/**
 * Connection established event
 */
export interface ConnectionEstablishedEvent {
    readonly type: 'connection-established';
    readonly connectionId: string;
    readonly endpoint: string;
    readonly timestamp: Date;
    readonly metadata: {
        readonly connectionType: 'ollama' | 'mongodb' | 'mcp';
        readonly latency: number;
        readonly version?: string;
        readonly capabilities?: string[];
        readonly retryAttempt: number;
    };
}
export declare function createConnectionEstablishedEvent(connectionId: string, endpoint: string, connectionType: 'ollama' | 'mongodb' | 'mcp', latency: number, retryAttempt?: number, version?: string, capabilities?: string[]): ConnectionEstablishedEvent;
//# sourceMappingURL=connection-established.d.ts.map