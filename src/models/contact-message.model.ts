import { Schema, model, type Document } from "mongoose";

export interface ContactMessageDoc extends Document {
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const ContactMessageSchema = new Schema<ContactMessageDoc>(
    {
        name: { type: String, required: true, trim: true, maxlength: 120 },
        email: { type: String, required: true, trim: true, lowercase: true, maxlength: 180 },
        message: { type: String, required: true, trim: true, maxlength: 5000 },
    },
    { timestamps: true }
);

export const ContactMessage = model<ContactMessageDoc>("ContactMessage", ContactMessageSchema);