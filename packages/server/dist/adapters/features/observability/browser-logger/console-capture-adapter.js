"use strict";
// Console Capture Adapter
// Intercepts browser console methods to capture logs
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConsoleCapture = createConsoleCapture;
function createConsoleCapture() {
    let isActive = false;
    let logCallback = null;
    const originalMethods = {
        log: console.log,
        info: console.info,
        warn: console.warn,
        error: console.error,
        debug: console.debug
    };
    const interceptMethod = (level, originalMethod) => {
        return (...args) => {
            // Call original method first
            originalMethod.apply(console, args);
            // Capture for our logging system
            if (isActive && logCallback) {
                const message = args.map(arg => typeof arg === 'object' ? JSON.stringify(arg) : String(arg)).join(' ');
                logCallback(level, message, args.length > 1 ? args.slice(1) : undefined);
            }
        };
    };
    return {
        start() {
            if (isActive)
                return;
            isActive = true;
            console.log = interceptMethod('info', originalMethods.log);
            console.info = interceptMethod('info', originalMethods.info);
            console.warn = interceptMethod('warn', originalMethods.warn);
            console.error = interceptMethod('error', originalMethods.error);
            console.debug = interceptMethod('debug', originalMethods.debug);
        },
        stop() {
            if (!isActive)
                return;
            isActive = false;
            console.log = originalMethods.log;
            console.info = originalMethods.info;
            console.warn = originalMethods.warn;
            console.error = originalMethods.error;
            console.debug = originalMethods.debug;
        },
        onLog(callback) {
            logCallback = callback;
        }
    };
}
//# sourceMappingURL=console-capture-adapter.js.map