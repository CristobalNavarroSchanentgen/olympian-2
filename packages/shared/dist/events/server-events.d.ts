/**
 * Server-related events
 */
export interface ServerStarted {
    readonly type: 'server-started';
    readonly serverId: string;
    readonly timestamp: Date;
}
export interface ServerStopped {
    readonly type: 'server-stopped';
    readonly serverId: string;
    readonly timestamp: Date;
}
export interface ServerError {
    readonly type: 'server-error';
    readonly serverId: string;
    readonly error: string;
    readonly timestamp: Date;
}
//# sourceMappingURL=server-events.d.ts.map