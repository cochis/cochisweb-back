"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    limit: 240,
    standardHeaders: "draft-7",
    legacyHeaders: false
});
exports.contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 60_000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false
});
//# sourceMappingURL=rateLimit.js.map