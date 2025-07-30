/**
 * MCP server started event
 */
export function createServerStartedEvent(serverName, pid, command, runner, args, restartCount, startupTime) {
    return {
        type: 'server-started',
        serverName,
        pid,
        command,
        timestamp: new Date(),
        metadata: {
            runner,
            args,
            restartCount,
            startupTime
        }
    };
}
//# sourceMappingURL=server-started.js.map