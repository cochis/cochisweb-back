import { ContactMessage } from "../models/contact-message.model.js";
import { clampText } from "../utils/sanitize.js";
export async function createContactMessage(input) {
    const doc = await ContactMessage.create({
        name: clampText(input.name, 80),
        email: clampText(input.email, 120),
        message: clampText(input.message, 4000),
        meta: { ip: clampText(input.ip, 60), userAgent: clampText(input.userAgent, 220) }
    });
    return doc.toObject();
}
export async function adminListMessages() {
    return ContactMessage.find({}).sort({ createdAt: -1 }).lean();
}
//# sourceMappingURL=contact.service.js.map