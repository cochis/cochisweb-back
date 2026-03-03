import { Schema, model } from "mongoose";
const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
}, { timestamps: true });
export const User = model("User", UserSchema);
//# sourceMappingURL=user.model.js.map