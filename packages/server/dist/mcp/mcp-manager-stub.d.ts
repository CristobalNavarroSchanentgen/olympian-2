export declare class MCPManager {
    initialize(): Promise<void>;
    getServerStatus(): {};
    getAllTools(): never[];
    executeTool(serverName: string, toolName: string, args: any): Promise<any>;
}
