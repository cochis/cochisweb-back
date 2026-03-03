import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ContactMessage } from "../models/contact-message.model.js";

export const messagesAdminRouter = Router();

messagesAdminRouter.use("/admin", requireAuth);

messagesAdminRouter.get(
    "/admin/messages",
    asyncHandler(async (_req, res) => {
        const items = await ContactMessage.find().sort({ createdAt: -1 }).select("-__v");
        res.json(items);
    })
);

messagesAdminRouter.delete(
    "/admin/messages/:id",
    asyncHandler(async (req, res) => {
        const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true });
    })
);