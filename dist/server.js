import { createApp } from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { ENV } from "./config/env.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
async function main() {
    await connectMongo();
    const app = createApp();
    /**
     * ✅ 1) Servir uploads (imágenes)
     * Ruta física: apps/api/uploads
     * URL pública:  /uploads/<carpeta>/<archivo>
     */
    const uploadsDir = path.join(process.cwd(), "uploads");
    app.use("/uploads", express.static(uploadsDir, { maxAge: "7d", etag: true }));
    /**
     * ✅ 2) Servir Angular build (SPA)
     * RECOMENDADO: poner el build del front dentro de:
     * apps/api/dist/client
     *
     * Entonces en runtime:
     * dist/client/index.html
     * dist/client/*.js
     */
    const webRoot = path.join(__dirname, "client"); // dist/client
    app.use(express.static(webRoot, {
        index: false,
        etag: true,
        maxAge: "1y",
    }));
    /**
     * ✅ 3) Fallback SPA
     */
    app.get("*", (req, res) => {
        if (req.path.startsWith("/api")) {
            return res.status(404).json({
                ok: false,
                msg: "Ruta API no encontrada. Revisa la documentación.",
            });
        }
        return res.sendFile(path.join(webRoot, "index.html"));
    });
    app.listen(ENV.PORT, () => {
        console.log(`[api] listening on :${ENV.PORT} (${ENV.NODE_ENV})`);
        console.log(`[web] static root: ${webRoot}`);
        console.log(`[uploads] static root: ${uploadsDir}`);
    });
}
main().catch((err) => {
    console.error("[api] fatal:", err);
    process.exit(1);
});
//# sourceMappingURL=server.js.map