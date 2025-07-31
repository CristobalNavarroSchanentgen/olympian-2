// Browser Logger Configuration Schema
// Configuration interface for the browser logger feature

import { LogCollectionConfig } from '../../../../models/observability/log-collection-config';

export interface BrowserLoggerConfig extends LogCollectionConfig {
  // Feature-specific configuration
  featureFlags: {
    enableRealTimeStreaming: boolean;
    enableLogAggregation: boolean;
    enableErrorReporting: boolean;
    enablePerformanceTracking: boolean;
  };
  
  // Security and privacy
  privacy: {
    maskSensitiveData: boolean;
    excludeFields: string[];
    hashUserIdentifiers: boolean;
  };
  
  // Performance optimization
  performance: {
    batchSize: number;
    compressionEnabled: boolean;
    throttleInterval: number;
  };
  
  // Integration settings
  integrations: {
    errorTrackingService?: string;
    analyticsService?: string;
    monitoringDashboard?: string;
  };
}

// Default configuration factory
export function createDefaultBrowserLoggerConfig(): BrowserLoggerConfig {
  return {
    enabled: true,
    levels: ['info', 'warn', 'error'],
    includeUserInteractions: false,
    includeNetworkRequests: false,
    maxBufferSize: 100,
    flushInterval: 30000,
    endpoint: '/api/logs',
    enableStackTraces: true,
    enablePerformanceMonitoring: false,
    enableMemoryUsageTracking: false,
    samplingRate: 1.0,
    
    featureFlags: {
      enableRealTimeStreaming: false,
      enableLogAggregation: true,
      enableErrorReporting: true,
      enablePerformanceTracking: false
    },
    
    privacy: {
      maskSensitiveData: true,
      excludeFields: ['password', 'token', 'apikey'],
      hashUserIdentifiers: true
    },
    
    performance: {
      batchSize: 50,
      compressionEnabled: false,
      throttleInterval: 1000
    },
    
    integrations: {}
  };
}

// Environment-specific configurations
export function createDevelopmentConfig(): BrowserLoggerConfig {
  const config = createDefaultBrowserLoggerConfig();
  return {
    ...config,
    levels: ['debug', 'info', 'warn', 'error'],
    includeUserInteractions: true,
    maxBufferSize: 500,
    flushInterval: 10000,
    samplingRate: 1.0,
    featureFlags: {
      ...config.featureFlags,
      enableRealTimeStreaming: true,
      enablePerformanceTracking: true
    },
    privacy: {
      ...config.privacy,
      maskSensitiveData: false
    }
  };
}

export function createProductionConfig(): BrowserLoggerConfig {
  const config = createDefaultBrowserLoggerConfig();
  return {
    ...config,
    levels: ['warn', 'error'],
    maxBufferSize: 50,
    flushInterval: 60000,
    samplingRate: 0.1,
    performance: {
      ...config.performance,
      compressionEnabled: true,
      batchSize: 100
    }
  };
}
