"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    MONGO_URI: zod_1.z.string().min(1),
    JWT_SECRET: zod_1.z.string().min(16),
    ADMIN_EMAIL: zod_1.z.string().email(),
    ADMIN_PASSWORD: zod_1.z.string().min(8),
    CORS_ORIGIN: zod_1.z.string().min(1)
});
exports.ENV = EnvSchema.parse(process.env);
//# sourceMappingURL=env.js.map