"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const mongo_1 = require("./config/mongo");
const env_1 = require("./config/env");
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
async function main() {
    await (0, mongo_1.connectMongo)();
    const app = (0, app_1.createApp)();
    /**
     * ✅ 1) Servir uploads (imágenes) - AJUSTA si tu carpeta real es otra
     * Ej: /uploads/projects/<file.png>
     */
    const uploadsDir = path_1.default.join(process.cwd(), "uploads");
    app.use("/uploads", express_1.default.static(uploadsDir, { maxAge: "7d" }));
    /**
     * ✅ 2) Servir Angular build (SPA)
     * Ajusta la ruta según tu build real:
     * - NO SSR: dist/cochisweb-web
     * - SSR:    dist/cochisweb-web/browser
     */
    const webRoot = path_1.default.join(__dirname, "client"); // <- AJUSTA
    app.use(express_1.default.static(webRoot, {
        index: false, // importante: el index lo servimos en el fallback
        etag: true,
        maxAge: "1y",
    }));
    /**
     * ✅ 3) Fallback SPA:
     * - si es /api -> 404 JSON
     * - si NO es /api -> index.html
     */
    app.get("*", (req, res) => {
        if (req.path.startsWith("/api")) {
            return res.status(404).json({
                ok: false,
                msg: "Ruta API no encontrada. Revisa la documentación.",
            });
        }
        return res.sendFile(path_1.default.join(webRoot, "index.html"));
    });
    app.listen(env_1.ENV.PORT, () => {
        console.log(`[api] listening on :${env_1.ENV.PORT} (${env_1.ENV.NODE_ENV})`);
        console.log(`[web] static root: ${webRoot}`);
        console.log(`[uploads] static root: ${uploadsDir}`);
    });
}
main().catch((err) => {
    console.error("[api] fatal:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map