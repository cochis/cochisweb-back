import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { UserModel } from "../models/user.model";
import { signJwt } from "../utils/jwt";

export const authRouter = Router();

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

authRouter.post(
    "/auth/login",
    validate(LoginSchema),
    asyncHandler(async (req, res) => {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return res.status(401).json({ error: "Invalid credentials" });

        const token = signJwt({ sub: String(user._id), email: user.email });
        res.json({ token });
    })
);