// Browser Log Captured Event
// Fired when a new browser log entry is captured

import { BrowserLogEntry } from '../features/observability/browser-logger/contract';

export interface BrowserLogCapturedEvent {
  type: 'browser-log-captured';
  payload: {
    log: BrowserLogEntry;
    sessionId: string;
    timestamp: Date;
  };
}

