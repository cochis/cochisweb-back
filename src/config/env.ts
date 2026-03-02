import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),

    MONGO_URI: z.string().min(1),
    JWT_SECRET: z.string().min(16),

    ADMIN_EMAIL: z.string().email(),
    ADMIN_PASSWORD: z.string().min(8),

    CORS_ORIGIN: z.string().min(1)
});

export const ENV = EnvSchema.parse(process.env);