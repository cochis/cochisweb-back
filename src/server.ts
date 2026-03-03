import { createApp } from "./app.js";
import { connectMongo } from "./config/mongo.js";
import { ENV } from "./config/env.js";

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
    await connectMongo();
    const app = createApp();

    /**
     * ✅ 1) Uploads estáticos
     * Carpeta real: apps/api/uploads
     * URL pública:  /uploads/...
     */
    const uploadsDir = path.join(process.cwd(), "uploads");
    app.use(
        "/uploads",
        express.static(uploadsDir, {
            etag: true,
            maxAge: "7d",
            redirect: false,
            fallthrough: true, // ✅ no lances 404 aquí
        })
    );

    /**
     * ✅ 2) Angular build
     * Debe existir: apps/api/dist/client/index.html
     */
    const webRoot = path.join(process.cwd(), "dist", "client"); // ✅ sin __dirname
    const indexPath = path.join(webRoot, "index.html");

    // 🔎 Log útil
    console.log(`[web] static root: ${webRoot}`);
    console.log(`[uploads] static root: ${uploadsDir}`);

    // ✅ Si no existe el build, avisa claro (evitas 500 confusos)
    if (!fs.existsSync(indexPath)) {
        console.warn(
            `[web] WARNING: No existe ${indexPath}. ` +
            `Construye Angular y cópialo a apps/api/dist/client`
        );
    }

    // ✅ Sirve assets reales (chunks, css, etc.)
    app.use(
        express.static(webRoot, {
            index: false,       // ✅ el index lo servimos en fallback
            etag: true,
            maxAge: "1y",
            redirect: false,    // ✅ evita redirects de carpetas
            fallthrough: true,  // ✅ deja pasar al fallback
        })
    );

    /**
     * ✅ 3) Fallback SPA (solo cuando el cliente pide HTML)
     * IMPORTANTE:
     * - Si piden un .js/.css y no existe, NO mandes index.html.
     * - Si piden HTML (navegación), manda index.html.
     */
    app.get("*", (req, res) => {
        // API no encontrada
        if (req.path.startsWith("/api")) {
            return res.status(404).json({
                ok: false,
                msg: "Ruta API no encontrada.",
            });
        }

        // Si parece request de archivo (chunk, css, ico, png) y no existe -> 404 (NO index.html)
        const looksLikeFile = path.extname(req.path).length > 0;
        if (looksLikeFile) return res.status(404).end();

        // Solo servir index.html si existe
        if (!fs.existsSync(indexPath)) {
            return res
                .status(500)
                .send("Frontend build no encontrado. Falta dist/client/index.html");
        }

        return res.sendFile(indexPath);
    });

    app.listen(ENV.PORT, () => {
        console.log(`[api] listening on :${ENV.PORT} (${ENV.NODE_ENV})`);
    });
}

main().catch((err) => {
    console.error("[api] fatal:", err);
    process.exit(1);
});