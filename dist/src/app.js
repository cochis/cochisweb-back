"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const auth_routes_1 = require("./routes/auth.routes");
const projects_public_routes_1 = require("./routes/projects.public.routes");
const projects_admin_routes_1 = require("./routes/projects.admin.routes");
const uploads_admin_routes_1 = require("./routes/uploads.admin.routes");
const contact_routes_1 = require("./routes/contact.routes");
const messages_admin_routes_1 = require("./routes/messages.admin.routes");
function createApp() {
    const app = (0, express_1.default)();
    app.set("trust proxy", 1);
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: "cross-origin" }, // ✅ permite <img> desde otro origen
    }));
    const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:4200',
        'https://cochisweb.com',
        'https://www.cochisweb.com',
    ];
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Permite requests sin origin (Postman, mobile apps, SSR, etc.)
            if (!origin)
                return callback(null, true);
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
    }));
    app.use(express_1.default.json({ limit: "1mb" }));
    app.use('/uploads', express_1.default.static(path_1.default.resolve(process.cwd(), 'uploads')));
    app.use((0, express_rate_limit_1.default)({
        windowMs: 60_000,
        max: 120,
        standardHeaders: true,
        legacyHeaders: false
    }));
    app.get("/api/health", (_req, res) => res.json({ ok: true }));
    app.use("/api", auth_routes_1.authRouter);
    app.use("/api", projects_public_routes_1.projectsPublicRouter);
    app.use("/api", projects_admin_routes_1.projectsAdminRouter);
    app.use("/api", contact_routes_1.contactRouter);
    app.use("/api", messages_admin_routes_1.messagesAdminRouter);
    app.use('/api', uploads_admin_routes_1.uploadsAdminRouter);
    app.use("/api", (_req, res) => res.status(404).json({ error: "Not found" }));
    /*     app.use(errorHandler); */
    return app;
}
//# sourceMappingURL=app.js.map