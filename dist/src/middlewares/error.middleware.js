"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, _req, res, _next) {
    const status = Number(err?.status) || 500;
    if (status >= 500)
        console.error("[api] error:", err);
    res.status(status).json({
        error: err?.message || "Server error",
        details: err?.details
    });
}
//# sourceMappingURL=error.middleware.js.map