"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginAdmin = loginAdmin;
const user_model_js_1 = require("../models/user.model.js");
const crypto_js_1 = require("../utils/crypto.js");
async function loginAdmin(email, password) {
    const user = await user_model_js_1.User.findOne({ email }).lean();
    if (!user)
        throw Object.assign(new Error("INVALID_CREDENTIALS"), { status: 401 });
    const ok = await (0, crypto_js_1.verifyPassword)(password, user.passwordHash);
    if (!ok)
        throw Object.assign(new Error("INVALID_CREDENTIALS"), { status: 401 });
    const token = (0, crypto_js_1.signJwt)({ sub: String(user._id), role: "admin" }, "12h");
    return { token };
}
//# sourceMappingURL=auth.service.js.map