import { User } from "../models/user.model.js";
import { signJwt, verifyPassword } from "../utils/crypto.js";

export async function loginAdmin(email: string, password: string): Promise<{ token: string }> {
    const user = await User.findOne({ email }).lean();
    if (!user) throw Object.assign(new Error("INVALID_CREDENTIALS"), { status: 401 });

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) throw Object.assign(new Error("INVALID_CREDENTIALS"), { status: 401 });

    const token = signJwt({ sub: String(user._id), role: "admin" }, "12h");
    return { token };
}