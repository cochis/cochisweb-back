"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactMessage = void 0;
const mongoose_1 = require("mongoose");
const ContactMessageSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
}, { timestamps: true });
exports.ContactMessage = (0, mongoose_1.model)("ContactMessage", ContactMessageSchema);
//# sourceMappingURL=contact-message.model.js.map