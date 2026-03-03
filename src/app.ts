import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from 'path';
import { authRouter } from "./routes/auth.routes.js";
import { projectsPublicRouter } from "./routes/projects.public.routes.js";
import { projectsAdminRouter } from "./routes/projects.admin.routes.js";
import { uploadsAdminRouter } from "./routes/uploads.admin.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { messagesAdminRouter } from "./routes/messages.admin.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";

export function createApp() {
    const app = express();

    app.set("trust proxy", 1);
    app.use(
        helmet({
            crossOriginResourcePolicy: { policy: "cross-origin" }, // ✅ permite <img> desde otro origen
        })
    );
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:4200',
        'https://cochisweb.com',
        'https://www.cochisweb.com',
    ];

    app.use(
        cors({
            origin: (origin, callback) => {
                // Permite requests sin origin (Postman, mobile apps, SSR, etc.)
                if (!origin) return callback(null, true);

                if (allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }

                return callback(new Error('Not allowed by CORS'));
            },
            credentials: true,
        })
    );
    app.use(express.json({ limit: "1mb" }));

    app.use('/uploads', express.static(path.resolve(process.cwd(), 'uploads')));
    app.use(
        rateLimit({
            windowMs: 60_000,
            max: 120,
            standardHeaders: true,
            legacyHeaders: false
        })
    );

    app.get("/api/health", (_req, res) => res.json({ ok: true }));
    app.use("/api", authRouter);
    app.use("/api", projectsPublicRouter);
    app.use("/api", projectsAdminRouter);
    app.use("/api", contactRouter);
    app.use("/api", messagesAdminRouter);
    app.use('/api', uploadsAdminRouter);

    app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));






    /*     app.use(errorHandler); */

    return app;
}