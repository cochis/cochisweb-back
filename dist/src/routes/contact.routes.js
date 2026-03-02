"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = require("express");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const contact_message_model_1 = require("../models/contact-message.model");
exports.contactRouter = (0, express_1.Router)();
const ContactSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(80),
    email: zod_1.z.string().email(),
    message: zod_1.z.string().min(10).max(4000),
    website: zod_1.z.string().optional().default("") // honeypot
});
const contactLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60_000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});
exports.contactRouter.post("/contact", contactLimiter, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { name, email, message, website } = req.body;
    // Honeypot: si viene lleno, respondemos OK pero no guardamos
    if (website && website.trim().length > 0) {
        return res.json({ ok: true });
    }
    await contact_message_model_1.ContactMessage.create({
        name,
        email,
        message,
        website: "",
        ip: req.ip,
        userAgent: req.headers["user-agent"] ?? ""
    });
    res.json({ ok: true });
}));
//# sourceMappingURL=contact.routes.js.map