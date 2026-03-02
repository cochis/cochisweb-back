"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const user_model_1 = require("../models/user.model");
const jwt_1 = require("../utils/jwt");
exports.authRouter = (0, express_1.Router)();
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1)
});
exports.authRouter.post("/auth/login", (0, validate_middleware_1.validate)(LoginSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    const user = await user_model_1.User.findOne({ email });
    if (!user)
        return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcryptjs_1.default.compare(password, user.passwordHash);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    const token = (0, jwt_1.signJwt)({ sub: String(user._id), email: user.email });
    res.json({ token });
}));
//# sourceMappingURL=auth.routes.js.map