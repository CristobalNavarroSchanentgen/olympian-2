"use strict";
/**
 * MCP server started event
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServerStartedEvent = createServerStartedEvent;
function createServerStartedEvent(serverName, pid, command, runner, args, restartCount, startupTime) {
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