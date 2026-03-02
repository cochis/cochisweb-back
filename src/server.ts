import { createApp } from "./app";
import { connectMongo } from "./config/mongo";
import { ENV } from "./config/env";
import path from "path";
import express from "express";

async function main() {
    await connectMongo();

    const app = createApp();

    /**
     * ✅ 1) Servir uploads (imágenes) - AJUSTA si tu carpeta real es otra
     * Ej: /uploads/projects/<file.png>
     */
    const uploadsDir = path.join(process.cwd(), "uploads");
    app.use("/uploads", express.static(uploadsDir, { maxAge: "7d" }));

    /**
     * ✅ 2) Servir Angular build (SPA)
     * Ajusta la ruta según tu build real:
     * - NO SSR: dist/cochisweb-web
     * - SSR:    dist/cochisweb-web/browser
     */
    const webRoot = path.join(__dirname, "client"); // <- AJUSTA
    app.use(
        express.static(webRoot, {
            index: false, // importante: el index lo servimos en el fallback
            etag: true,
            maxAge: "1y",
        })
    );

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