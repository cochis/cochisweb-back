import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env.js";

function jwtSecret(): Secret {
    const s = (ENV.JWT_SECRET ?? "").toString().trim();
    if (!s) throw new Error("ENV.JWT_SECRET is missing");
    return s as Secret;
}

export async function hashPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
}

export function signJwt(
    payload: object,
    expiresIn: SignOptions["expiresIn"] = "12h"
): string {
    const options: SignOptions = { expiresIn };
    return jwt.sign(payload, jwtSecret(), options);
}

export function verifyJwt<T>(token: string): T {
    return jwt.verify(token, jwtSecret()) as T;
}