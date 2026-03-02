"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesAdminRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const contact_message_model_1 = require("../models/contact-message.model");
exports.messagesAdminRouter = (0, express_1.Router)();
exports.messagesAdminRouter.use("/admin", auth_middleware_1.requireAuth);
exports.messagesAdminRouter.get("/admin/messages", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const items = await contact_message_model_1.ContactMessage.find().sort({ createdAt: -1 }).select("-__v");
    res.json(items);
}));
exports.messagesAdminRouter.delete("/admin/messages/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deleted = await contact_message_model_1.ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
}));
//# sourceMappingURL=messages.admin.routes.js.map