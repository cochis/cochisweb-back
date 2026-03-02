import { Schema, model, type Document } from "mongoose";

export interface UserDoc extends Document {
    email: string;
    passwordHash: string;
    role: "admin" | "user";
}

const UserSchema = new Schema<UserDoc>(
    {
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        passwordHash: { type: String, required: true },
        role: { type: String, enum: ["admin", "user"], default: "user" },
    },
    { timestamps: true }
);

export const User = model<UserDoc>("User", UserSchema);