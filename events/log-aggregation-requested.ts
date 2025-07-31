// Log Aggregation Requested Event
// Fired when logs need to be aggregated from multiple sources

export interface LogAggregationRequestedEvent {
  type: 'log-aggregation-requested';
  payload: {
    sources: ('browser' | 'server' | 'database')[];
    timeRange?: { start: Date; end: Date };
    filters?: {
      levels?: string[];
      sessionId?: string;
    };
    requestId: string;
    timestamp: Date;
  };
}

