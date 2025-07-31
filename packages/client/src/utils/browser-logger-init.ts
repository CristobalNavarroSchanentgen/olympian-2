// Browser Logger Initialization
// Integrates the browser logger into the React application

import { createBrowserLogger } from '../../../../features/observability/browser-logger/browser-logger';
import { BrowserLogger } from '../../../../features/observability/browser-logger/browser-logger';

let globalLogger: BrowserLogger | null = null;

export function initializeBrowserLogger(): BrowserLogger {
  if (globalLogger) {
    return globalLogger;
  }

  // Configuration based on environment
  const isDevelopment = import.meta.env.DEV;
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  globalLogger = createBrowserLogger({
    enabled: true,
    levels: isDevelopment ? ['debug', 'info', 'warn', 'error'] : ['warn', 'error'],
    includeUserInteractions: true,
    includeNetworkRequests: false,
    maxBufferSize: isDevelopment ? 500 : 200,
    flushInterval: isDevelopment ? 10000 : 30000, // More frequent flushing in dev
    endpoint: apiUrl + '/api/logs'
  });

  // Start a session immediately
  globalLogger.startSession();
  
  // Log initialization
  globalLogger.log('info', 'Browser logger initialized', {
    environment: isDevelopment ? 'development' : 'production',
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  });

  // Handle page unload - flush logs before leaving
  window.addEventListener('beforeunload', () => {
    if (globalLogger) {
      globalLogger.flush();
      globalLogger.endSession();
    }
  });

  // Handle visibility change - flush logs when tab becomes hidden
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && globalLogger) {
      globalLogger.flush();
    }
  });

  return globalLogger;
}

export function getBrowserLogger(): BrowserLogger | null {
  return globalLogger;
}

// Utility functions for easy logging from React components
export const browserLog = {
  debug: (message: string, data?: any) => {
    globalLogger?.log('debug', message, data);
  },
  info: (message: string, data?: any) => {
    globalLogger?.log('info', message, data);
  },
  warn: (message: string, data?: any) => {
    globalLogger?.log('warn', message, data);
  },
  error: (message: string, data?: any) => {
    globalLogger?.log('error', message, data);
  },
  logError: (error: Error, context?: any) => {
    globalLogger?.logError(error, context);
  }
};

// Hook for React components
export function useBrowserLogger() {
  return {
    logger: globalLogger,
    log: browserLog
  };
}