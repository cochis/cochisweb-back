import { Schema, model } from "mongoose";
const ContactMessageSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
}, { timestamps: true });
export const ContactMessage = model("ContactMessage", ContactMessageSchema);
//# sourceMappingURL=contact-message.model.js.map