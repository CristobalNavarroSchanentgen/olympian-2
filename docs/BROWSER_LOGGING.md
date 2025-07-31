# Browser Logging System

The Olympian AI Browser Logging System provides comprehensive client-side logging capabilities that integrate seamlessly with the server-side logging infrastructure.

## Architecture Overview

This implementation follows the AI-native architecture principles with clear separation of concerns:

```
features/observability/browser-logger/
??? contract.ts                 # Interface definitions
??? browser-logger.ts          # Main implementation

adapters/features/observability/browser-logger/
??? console-capture-adapter.ts  # Intercepts console.* calls
??? error-capture-adapter.ts    # Captures unhandled errors
??? interaction-capture-adapter.ts # Tracks user interactions

services/logging-service.ts     # Cross-feature logging interface
events/                        # Event definitions
models/observability/          # Pure type definitions
config/features/observability/ # Configuration schemas
```

## Features

### ? Core Logging Capabilities
- **Console Interception**: Automatically captures console.log, warn, error, debug calls
- **Error Tracking**: Captures unhandled JavaScript errors and promise rejections
- **User Interactions**: Optional tracking of clicks, scrolls, form submissions
- **Session Management**: Groups logs by user sessions
- **Smart Buffering**: Configurable buffer size and auto-flush intervals

### ? Configuration Management
- **Environment-specific configs**: Different settings for dev/staging/production
- **Privacy Controls**: Mask sensitive data, exclude fields, hash identifiers  
- **Performance Optimization**: Batching, compression, throttling, sampling
- **Feature Flags**: Enable/disable specific logging features

### ? Enhanced Make Commands

The `make logs` command now provides unified browser + server logging:

```bash
# Stream all logs in real-time with color coding
make logs

# Export logs to files (JSON + CSV)
make logs-export

# Show logging statistics only
make logs-stats

# Show browser logs only
make logs-browser

# Show Docker logs only (original behavior)
make logs-docker
```

## Quick Start

### 1. Automatic Initialization

The browser logger is automatically initialized in `main.tsx`:

```typescript
import { initializeBrowserLogger } from './utils/browser-logger-init';

// Initialize before React renders
initializeBrowserLogger();
```

### 2. Using in React Components

```typescript
import { useBrowserLogger, browserLog } from '../utils/browser-logger-init';

function MyComponent() {
  const { logger } = useBrowserLogger();
  
  const handleClick = () => {
    browserLog.info('Button clicked', { component: 'MyComponent' });
  };
  
  const handleError = (error: Error) => {
    browserLog.logError(error, { context: 'user-action' });
  };
  
  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}
```

### 3. Manual Logging

```typescript
import { getBrowserLogger } from '../utils/browser-logger-init';

const logger = getBrowserLogger();
if (logger) {
  logger.log('info', 'Manual log entry', { custom: true });
  logger.flush(); // Force send to server
}
```

## API Endpoints

### POST /api/logs
Receive browser logs from clients

### GET /api/logs
Retrieve aggregated logs with filtering:
- `?level=error` - Filter by log level
- `?sessionId=abc123` - Filter by session
- `?startTime=2024-01-01` - Time range filtering
- `?format=csv` - Export as CSV
- `?includeInteractions=true` - Include user interactions

### GET /api/logs/stats
Get logging statistics and health metrics

## Configuration Examples

### Development Configuration
```typescript
{
  enabled: true,
  levels: ['debug', 'info', 'warn', 'error'],
  includeUserInteractions: true,
  maxBufferSize: 500,
  flushInterval: 10000, // 10 seconds
  featureFlags: {
    enableRealTimeStreaming: true,
    enablePerformanceTracking: true
  }
}
```

### Production Configuration
```typescript
{
  enabled: true,
  levels: ['warn', 'error'],
  includeUserInteractions: false,
  maxBufferSize: 50,
  flushInterval: 60000, // 1 minute
  samplingRate: 0.1, // Only log 10% of sessions
  privacy: {
    maskSensitiveData: true,
    hashUserIdentifiers: true
  }
}
```

## Log Format

### Browser Log Entry
```json
{
  "id": "abc123",
  "timestamp": "2024-07-31T15:30:00.000Z",
  "level": "error",
  "source": "console",
  "message": "API request failed",
  "data": { "url": "/api/data", "status": 500 },
  "sessionId": "session-xyz",
  "url": "http://localhost:3000/chat",
  "userAgent": "Mozilla/5.0...",
  "stackTrace": "Error: API request failed\n    at fetch..."
}
```

### User Interaction Entry
```json
{
  "id": "int456",
  "timestamp": "2024-07-31T15:30:00.000Z",
  "type": "click",
  "element": "#submit-button",
  "coordinates": { "x": 150, "y": 200 },
  "sessionId": "session-xyz",
  "data": { "ctrlKey": false, "shiftKey": false }
}
```

## Development Tools

### LoggingDemo Component
A development component (`packages/client/src/components/dev/LoggingDemo.tsx`) provides:
- Interactive testing of all log levels
- Error simulation and handling
- Log buffer management (clear, flush, export)
- Real-time log display
- Session and configuration monitoring

### Enhanced Log Streaming
Run `make logs` to see:
- **Docker logs** in blue: `[DOCKER] server-1 | Starting server...`
- **Browser logs** color-coded by level:
  - Errors in red: `[BROWSER] [2024-07-31T15:30:00] [ERROR] API failed`
  - Warnings in yellow: `[BROWSER] [2024-07-31T15:30:00] [WARN] Slow response`
  - Info in cyan: `[BROWSER] [2024-07-31T15:30:00] [INFO] User clicked`

## Privacy & Security

- **Sensitive Data Masking**: Automatically masks passwords, tokens, API keys
- **User Identifier Hashing**: Hash user IDs and personal data
- **Configurable Sampling**: Reduce data collection in production
- **Data Retention**: Logs are stored temporarily and can be automatically cleaned

## Performance Impact

- **Minimal Runtime Overhead**: < 5ms per log entry
- **Smart Buffering**: Batches logs to reduce network requests
- **Compression**: Optional gzip compression for large payloads
- **Throttling**: Prevents log spam from degrading performance
- **Sampling**: Production environments can sample a percentage of sessions

## Troubleshooting

### Logs Not Appearing
1. Check if logger is initialized: `getBrowserLogger() !== null`
2. Verify API endpoint is accessible: `curl http://localhost:3001/api/logs/stats`
3. Check browser console for initialization errors
4. Ensure Docker services are running: `make status`

### High Memory Usage
1. Reduce `maxBufferSize` in configuration
2. Decrease `flushInterval` to flush more frequently
3. Enable `samplingRate < 1.0` to reduce log volume
4. Disable `includeUserInteractions` if not needed

### Missing Interactions
1. Verify `includeUserInteractions: true` in config
2. Check that interaction capture adapter is started
3. Look for JavaScript errors preventing event listeners

## Future Enhancements

- [ ] Real-time log streaming via WebSockets
- [ ] Advanced filtering and search capabilities
- [ ] Integration with external monitoring services
- [ ] Performance metrics and Core Web Vitals tracking
- [ ] Automated anomaly detection
- [ ] Log-based alerting system
