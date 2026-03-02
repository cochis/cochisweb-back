"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongo_1 = require("../src/config/mongo");
const env_1 = require("../src/config/env");
const user_model_js_1 = require("../src/models/user.model.js");
async function run() {
    await (0, mongo_1.connectMongo)();
    const exists = await user_model_js_1.User.findOne({ email: env_1.ENV.ADMIN_EMAIL });
    if (!exists) {
        const hash = await bcryptjs_1.default.hash(env_1.ENV.ADMIN_PASSWORD, 10);
        await user_model_js_1.User.create({ email: env_1.ENV.ADMIN_EMAIL, passwordHash: hash });
        console.log("[seed] admin created ✅", env_1.ENV.ADMIN_EMAIL);
    }
    else {
        console.log("[seed] admin exists ✅", env_1.ENV.ADMIN_EMAIL);
    }
    process.exit(0);
}
run().catch((e) => {
    console.error("[seed] fatal:", e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map