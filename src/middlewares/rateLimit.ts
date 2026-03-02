import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
    windowMs: 60_000,
    limit: 240,
    standardHeaders: "draft-7",
    legacyHeaders: false
});

export const contactLimiter = rateLimit({
    windowMs: 10 * 60_000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
});