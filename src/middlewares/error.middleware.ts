import type { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
    const status = Number(err?.status) || 500;
    if (status >= 500) console.error("[api] error:", err);

    res.status(status).json({
        error: err?.message || "Server error",
        details: err?.details
    });
}