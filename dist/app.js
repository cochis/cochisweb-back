import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { authRouter } from "./routes/auth.routes.js";
import { projectsPublicRouter } from "./routes/projects.public.routes.js";
import { projectsAdminRouter } from "./routes/projects.admin.routes.js";
import { uploadsAdminRouter } from "./routes/uploads.admin.routes.js";
import { contactRouter } from "./routes/contact.routes.js";
import { messagesAdminRouter } from "./routes/messages.admin.routes.js";
export function createApp() {
    const app = express();
    app.set("trust proxy", 1);
    // ✅ Helmet: desactiva CSP (por ahora) para que no rompa Angular ni XHR
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" },
    }));
    const allowedOrigins = [
        "http://localhost:4200",
        "http://localhost:3000",
        "https://cochisweb.com",
        "https://www.cochisweb.com",
    ];
    app.use(cors({
        origin: (origin, cb) => {
            if (!origin)
                return cb(null, true);
            if (allowedOrigins.includes(origin))
                return cb(null, true);
            return cb(new Error("Not allowed by CORS"));
        },
        credentials: true,
    }));
    // ✅ Importante para preflight
    app.options("*", cors());
    app.use(express.json({ limit: "2mb" }));
    // ✅ Uploads estáticos
    app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));
    // ✅ Rate limit
    app.use(rateLimit({
        windowMs: 60_000,
        max: 120,
        standardHeaders: true,
        legacyHeaders: false,
    }));
    // ✅ Health
    app.get("/api/health", (_req, res) => res.json({ ok: true }));
    // ✅ API routes
    app.use("/api", authRouter);
    app.use("/api", projectsPublicRouter);
    app.use("/api", projectsAdminRouter);
    app.use("/api", uploadsAdminRouter);
    app.use("/api", contactRouter);
    app.use("/api", messagesAdminRouter);
    // ✅ 404 solo para /api
    app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));
    return app;
}
//# sourceMappingURL=app.js.map