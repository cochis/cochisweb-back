import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

export async function hashPassword(plain: string): Promise<string> {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(plain, hashed);
}

export function signJwt(payload: object, expiresIn: string = "12h"): string {
    return jwt.sign(payload, ENV.JWT_SECRET, { expiresIn });
}

export function verifyJwt<T>(token: string): T {
    return jwt.verify(token, ENV.JWT_SECRET) as T;
}