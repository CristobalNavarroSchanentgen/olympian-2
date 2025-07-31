"use strict";
// User Interaction Capture Adapter
// Captures user interactions like clicks, scrolls, and form submissions
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInteractionCapture = createInteractionCapture;
function createInteractionCapture() {
    let isActive = false;
    let interactionCallback = null;
    const getElementIdentifier = (element) => {
        if (element.id)
            return '#' + element.id;
        if (element.className)
            return '.' + element.className.split(' ')[0];
        return element.tagName.toLowerCase();
    };
    const handleClick = (event) => {
        if (isActive && interactionCallback && event.target instanceof Element) {
            interactionCallback('click', getElementIdentifier(event.target), {
                coordinates: { x: event.clientX, y: event.clientY },
                button: event.button,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey
            });
        }
    };
    const handleScroll = () => {
        if (isActive && interactionCallback) {
            interactionCallback('scroll', 'window', {
                scrollX: window.scrollX,
                scrollY: window.scrollY
            });
        }
    };
    const handleFormSubmit = (event) => {
        if (isActive && interactionCallback && event.target instanceof HTMLFormElement) {
            interactionCallback('form-submit', getElementIdentifier(event.target), {
                formData: new FormData(event.target)
            });
        }
    };
    const handleNavigation = () => {
        if (isActive && interactionCallback) {
            interactionCallback('navigation', 'window', {
                url: window.location.href,
                pathname: window.location.pathname
            });
        }
    };
    return {
        start() {
            if (isActive)
                return;
            isActive = true;
            document.addEventListener('click', handleClick);
            window.addEventListener('scroll', handleScroll, { passive: true });
            document.addEventListener('submit', handleFormSubmit);
            window.addEventListener('popstate', handleNavigation);
        },
        stop() {
            if (!isActive)
                return;
            isActive = false;
            document.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('submit', handleFormSubmit);
            window.removeEventListener('popstate', handleNavigation);
        },
        onInteraction(callback) {
            interactionCallback = callback;
        }
    };
}
//# sourceMappingURL=interaction-capture-adapter.js.map