import type { Request, Response, NextFunction } from "express";
import { verifyJwt } from "../utils/jwt.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers.authorization ?? "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

    if (!token) return res.status(401).json({ error: "Missing token" });

    try {
        const payload = verifyJwt(token);
        (req as any).user = payload;
        return next();
    } catch {
        return res.status(401).json({ error: "Invalid token" });
    }
}