import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
function jwtSecret() {
    const s = (ENV.JWT_SECRET ?? "").toString().trim();
    if (!s)
        throw new Error("ENV.JWT_SECRET is missing");
    return s;
}
export async function hashPassword(plain) {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt);
}
export async function verifyPassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
}
export function signJwt(payload, expiresIn = "12h") {
    const options = { expiresIn };
    return jwt.sign(payload, jwtSecret(), options);
}
export function verifyJwt(token) {
    return jwt.verify(token, jwtSecret());
}
//# sourceMappingURL=crypto.js.map