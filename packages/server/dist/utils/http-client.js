/**
 * HTTP Client Utility
 * Pure functions for HTTP requests
 */
import axios from "axios";
export const httpClient = axios.create({
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});
// Add request interceptor for consistent error handling
httpClient.interceptors.response.use((response) => response, (error) => {
    console.error("HTTP request failed:", error);
    return Promise.reject(error);
});
//# sourceMappingURL=http-client.js.map