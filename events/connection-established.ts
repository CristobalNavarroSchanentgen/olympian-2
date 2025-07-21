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

export function createConnectionEstablishedEvent(
  connectionId: string,
  endpoint: string,
  connectionType: 'ollama' | 'mongodb' | 'mcp',
  latency: number,
  retryAttempt = 0,
  version?: string,
  capabilities?: string[]
): ConnectionEstablishedEvent {
  return {
    type: 'connection-established',
    connectionId,
    endpoint,
    timestamp: new Date(),
    metadata: {
      connectionType,
      latency,
      version,
      capabilities,
      retryAttempt
    }
  };
}
