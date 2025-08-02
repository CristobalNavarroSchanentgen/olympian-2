"use strict";
/**
 * HTTP Client Utility
 * Pure functions for HTTP requests
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpClient = void 0;
const axios_1 = __importDefault(require("axios"));
exports.httpClient = axios_1.default.create({
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});
// Add request interceptor for consistent error handling
exports.httpClient.interceptors.response.use((response) => response, (error) => {
    console.error("HTTP request failed:", error);
    return Promise.reject(error);
});
//# sourceMappingURL=http-client.js.map