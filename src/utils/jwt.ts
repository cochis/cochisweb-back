import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";


export type JwtPayload = { sub: string; email: string };

export function signJwt(payload: JwtPayload) {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string) {
    return jwt.verify(token, ENV.JWT_SECRET) as JwtPayload;
}