/**
 * Connection-related events
 */

export interface ConnectionEstablished {
  readonly type: 'connection-established';
  readonly connectionId: string;
  readonly timestamp: Date;
}

export interface ConnectionLost {
  readonly type: 'connection-lost';
  readonly connectionId: string;
  readonly timestamp: Date;
}

export interface HealthChecked {
  readonly type: 'health-checked';
  readonly connectionId: string;
  readonly status: string;
  readonly timestamp: Date;
}

export interface CapabilitiesUpdated {
  readonly type: 'capabilities-updated';
  readonly modelName: string;
  readonly capabilities: string[];
  readonly timestamp: Date;
}
