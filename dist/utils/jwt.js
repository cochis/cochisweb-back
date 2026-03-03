import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
export function signJwt(payload) {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
}
export function verifyJwt(token) {
    return jwt.verify(token, ENV.JWT_SECRET);
}
//# sourceMappingURL=jwt.js.map