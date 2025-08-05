// Error Capture Adapter
// Captures unhandled errors and promise rejections
export function createErrorCapture() {
    let isActive = false;
    let errorCallback = null;
    const handleError = (event) => {
        if (isActive && errorCallback) {
            const error = new Error(event.message);
            error.stack = event.filename + ':' + event.lineno + ':' + event.colno;
            errorCallback(error, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                type: 'javascript-error'
            });
        }
    };
    const handleUnhandledRejection = (event) => {
        if (isActive && errorCallback) {
            const error = event.reason instanceof Error
                ? event.reason
                : new Error(String(event.reason));
            errorCallback(error, {
                type: 'unhandled-promise-rejection',
                reason: event.reason
            });
        }
    };
    return {
        start() {
            if (isActive)
                return;
            isActive = true;
            window.addEventListener('error', handleError);
            window.addEventListener('unhandledrejection', handleUnhandledRejection);
        },
        stop() {
            if (!isActive)
                return;
            isActive = false;
            window.removeEventListener('error', handleError);
            window.removeEventListener('unhandledrejection', handleUnhandledRejection);
        },
        onError(callback) {
            errorCallback = callback;
        }
    };
}
//# sourceMappingURL=error-capture-adapter.js.map