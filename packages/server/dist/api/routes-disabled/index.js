"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupRoutes = setupRoutes;
// Fixed API routes with proper timestamps
const express_1 = require("express");
function setupRoutes(app, db, mcp) {
    const router = (0, express_1.Router)();
    // Basic routes that work for now
    router.get("/health", (req, res) => {
        res.json({ status: "ok", timestamp: new Date() });
    });
    router.get("/status", (req, res) => {
        res.json({
            database: true,
            mcp: mcp.getServerStatus(),
            timestamp: new Date()
        });
    });
    app.use("/api", router);
    console.log("📡 API routes configured");
}
//# sourceMappingURL=index.js.map