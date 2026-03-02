"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.signJwt = signJwt;
exports.verifyJwt = verifyJwt;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("../config/env.js");
function jwtSecret() {
    const s = (env_js_1.ENV.JWT_SECRET ?? "").toString().trim();
    if (!s)
        throw new Error("ENV.JWT_SECRET is missing");
    return s;
}
async function hashPassword(plain) {
    const salt = await bcryptjs_1.default.genSalt(12);
    return bcryptjs_1.default.hash(plain, salt);
}
async function verifyPassword(plain, hashed) {
    return bcryptjs_1.default.compare(plain, hashed);
}
function signJwt(payload, expiresIn = "12h") {
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, jwtSecret(), options);
}
function verifyJwt(token) {
    return jsonwebtoken_1.default.verify(token, jwtSecret());
}
//# sourceMappingURL=crypto.js.map