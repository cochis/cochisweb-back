"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContactMessage = createContactMessage;
exports.adminListMessages = adminListMessages;
const contact_message_model_js_1 = require("../models/contact-message.model.js");
const sanitize_js_1 = require("../utils/sanitize.js");
async function createContactMessage(input) {
    const doc = await contact_message_model_js_1.ContactMessage.create({
        name: (0, sanitize_js_1.clampText)(input.name, 80),
        email: (0, sanitize_js_1.clampText)(input.email, 120),
        message: (0, sanitize_js_1.clampText)(input.message, 4000),
        meta: { ip: (0, sanitize_js_1.clampText)(input.ip, 60), userAgent: (0, sanitize_js_1.clampText)(input.userAgent, 220) }
    });
    return doc.toObject();
}
async function adminListMessages() {
    return contact_message_model_js_1.ContactMessage.find({}).sort({ createdAt: -1 }).lean();
}
//# sourceMappingURL=contact.service.js.map