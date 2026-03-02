import mongoose from "mongoose";

const ContactMessageSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },

        website: { type: String, default: "" }, // honeypot
        ip: { type: String, default: "" },
        userAgent: { type: String, default: "" }
    },
    { timestamps: true }
);

export const ContactMessageModel = mongoose.model("ContactMessage", ContactMessageSchema);