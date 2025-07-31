"use strict";
// Browser Logger Implementation
// Main implementation of the browser logging system
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserLogger = void 0;
exports.createBrowserLogger = createBrowserLogger;
const console_capture_adapter_1 = require("../../../adapters/features/observability/browser-logger/console-capture-adapter");
const error_capture_adapter_1 = require("../../../adapters/features/observability/browser-logger/error-capture-adapter");
const interaction_capture_adapter_1 = require("../../../adapters/features/observability/browser-logger/interaction-capture-adapter");
class BrowserLogger {
    config;
    logBuffer = [];
    interactionBuffer = [];
    currentSessionId = null;
    flushTimer = null;
    consoleCapture = (0, console_capture_adapter_1.createConsoleCapture)();
    errorCapture = (0, error_capture_adapter_1.createErrorCapture)();
    interactionCapture = (0, interaction_capture_adapter_1.createInteractionCapture)();
    constructor(initialConfig) {
        this.config = {
            enabled: true,
            levels: ['debug', 'info', 'warn', 'error'],
            includeUserInteractions: true,
            includeNetworkRequests: false,
            maxBufferSize: 1000,
            flushInterval: 30000, // 30 seconds
            endpoint: '/api/logs',
            ...initialConfig
        };
        this.setupCaptures();
        this.startAutoFlush();
    }
    setupCaptures() {
        if (!this.config.enabled)
            return;
        // Console capture
        this.consoleCapture.onLog((level, message, data) => {
            if (this.config.levels.includes(level)) {
                this.createLogEntry(level, message, data, 'console');
            }
        });
        this.consoleCapture.start();
        // Error capture
        this.errorCapture.onError((error, context) => {
            this.createLogEntry('error', error.message, {
                stack: error.stack,
                context
            }, 'error');
        });
        this.errorCapture.start();
        // Interaction capture
        if (this.config.includeUserInteractions) {
            this.interactionCapture.onInteraction((type, element, data) => {
                this.logUserInteraction({
                    type: type,
                    element,
                    data
                });
            });
            this.interactionCapture.start();
        }
    }
    createLogEntry(level, message, data, source = 'console') {
        const entry = {
            id: this.generateId(),
            timestamp: new Date(),
            level,
            source,
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent,
            sessionId: this.currentSessionId || this.startSession()
        };
        this.logBuffer.push(entry);
        this.maintainBufferSize();
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    maintainBufferSize() {
        if (this.logBuffer.length > this.config.maxBufferSize) {
            this.logBuffer.splice(0, this.logBuffer.length - this.config.maxBufferSize);
        }
    }
    startAutoFlush() {
        if (this.flushTimer)
            clearInterval(this.flushTimer);
        this.flushTimer = setInterval(() => {
            if (this.logBuffer.length > 0) {
                this.flush();
            }
        }, this.config.flushInterval);
    }
    // Public methods implementing BrowserLoggerContract
    log(level, message, data) {
        this.createLogEntry(level, message, data);
    }
    logUserInteraction(interaction) {
        const fullInteraction = {
            id: this.generateId(),
            timestamp: new Date(),
            sessionId: this.currentSessionId || this.startSession(),
            ...interaction
        };
        this.interactionBuffer.push(fullInteraction);
    }
    logError(error, context) {
        this.createLogEntry('error', error.message, {
            stack: error.stack,
            context
        }, 'error');
    }
    async flush() {
        if (this.logBuffer.length === 0)
            return;
        try {
            const response = await fetch(this.config.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    logs: this.logBuffer,
                    interactions: this.interactionBuffer
                })
            });
            if (response.ok) {
                this.logBuffer = [];
                this.interactionBuffer = [];
            }
        }
        catch (error) {
            console.warn('Failed to flush logs to server:', error);
        }
    }
    clear() {
        this.logBuffer = [];
        this.interactionBuffer = [];
    }
    getBufferedLogs() {
        return [...this.logBuffer];
    }
    configure(config) {
        this.config = { ...this.config, ...config };
        // Restart captures with new config
        this.consoleCapture.stop();
        this.errorCapture.stop();
        this.interactionCapture.stop();
        this.setupCaptures();
        this.startAutoFlush();
    }
    getConfig() {
        return { ...this.config };
    }
    startSession() {
        this.currentSessionId = this.generateId();
        return this.currentSessionId;
    }
    endSession() {
        this.flush();
        this.currentSessionId = null;
    }
    getCurrentSessionId() {
        return this.currentSessionId;
    }
    getLogs(filter) {
        let logs = [...this.logBuffer];
        if (filter?.levels) {
            logs = logs.filter(log => filter.levels.includes(log.level));
        }
        if (filter?.timeRange) {
            logs = logs.filter(log => log.timestamp >= filter.timeRange.start &&
                log.timestamp <= filter.timeRange.end);
        }
        if (filter?.sources) {
            logs = logs.filter(log => filter.sources.includes(log.source));
        }
        return logs;
    }
    exportLogs(format) {
        const logs = this.logBuffer;
        if (format === 'json') {
            return JSON.stringify(logs, null, 2);
        }
        // CSV format
        const headers = ['timestamp', 'level', 'source', 'message', 'sessionId'];
        const csvLines = [headers.join(',')];
        logs.forEach(log => {
            const row = [
                log.timestamp.toISOString(),
                log.level,
                log.source,
                JSON.stringify(log.message),
                log.sessionId
            ];
            csvLines.push(row.join(','));
        });
        return csvLines.join('\n');
    }
}
exports.BrowserLogger = BrowserLogger;
function createBrowserLogger(config) {
    return new BrowserLogger(config);
}
//# sourceMappingURL=browser-logger.js.map