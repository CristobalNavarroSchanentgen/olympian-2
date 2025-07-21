/**
 * Tool invoked event
 */
export interface ToolInvokedEvent {
    readonly type: 'tool-invoked';
    readonly toolName: string;
    readonly serverName: string;
    readonly invocationId: string;
    readonly arguments: Record<string, unknown>;
    readonly timestamp: Date;
    readonly metadata: {
        readonly conversationId?: string;
        readonly messageId?: string;
        readonly timeout: number;
        readonly retryCount: number;
    };
}
export declare function createToolInvokedEvent(toolName: string, serverName: string, invocationId: string, arguments_: Record<string, unknown>, timeout: number, retryCount?: number, conversationId?: string, messageId?: string): ToolInvokedEvent;
//# sourceMappingURL=tool-invoked.d.ts.map