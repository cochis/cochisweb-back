import { Router } from "express";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { ContactMessageModel } from "../models/contact-message.model";

export const contactRouter = Router();

const ContactSchema = z.object({
    name: z.string().min(2).max(80),
    email: z.string().email(),
    message: z.string().min(10).max(4000),
    website: z.string().optional().default("") // honeypot
});

const contactLimiter = rateLimit({
    windowMs: 60_000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false
});

contactRouter.post(
    "/contact",
    contactLimiter,

    asyncHandler(async (req, res) => {
        const { name, email, message, website } = req.body;

        // Honeypot: si viene lleno, respondemos OK pero no guardamos
        if (website && website.trim().length > 0) {
            return res.json({ ok: true });
        }

        await ContactMessageModel.create({
            name,
            email,
            message,
            website: "",
            ip: req.ip,
            userAgent: req.headers["user-agent"] ?? ""
        });

        res.json({ ok: true });
    })
);