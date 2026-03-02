"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsAdminRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const project_model_1 = require("../models/project.model");
const slugify_1 = require("../utils/slugify");
exports.projectsAdminRouter = (0, express_1.Router)();
// Protege TODO este router (asumiendo que lo montas en /api)
exports.projectsAdminRouter.use(auth_middleware_1.requireAuth);
// -------------------- helpers --------------------
function normalizeUrl(v) {
    const s = (v ?? "").trim();
    return s.length ? s : undefined;
}
/**
 * Extrae nombre de archivo desde:
 * - "p-123.png"
 * - "/uploads/projects/p-123.png"
 * - "http://localhost:3000/uploads/projects/p-123.png"
 */
function toFileName(v) {
    const s = (v ?? "").trim();
    if (!s)
        return undefined;
    // Si ya es nombre (sin slash), lo usamos tal cual
    if (!s.includes("/"))
        return s;
    // Si es url/ruta, nos quedamos con el último segmento
    const last = s
        .split("?")[0]
        .split("#")[0]
        .split("/")
        .filter(Boolean)
        .pop();
    return last?.trim() || undefined;
}
/**
 * Si mandan "thumbnailUrl" pero tú quieres guardar solo nombre,
 * esta función intenta extraer el nombre desde la url.
 */
function fileNameFromUrlOrName(name, url) {
    return toFileName(name) ?? toFileName(url);
}
// -------------------- Zod Schemas --------------------
const UrlOrEmpty = zod_1.z.string().url().or(zod_1.z.literal("")).optional();
const ProjectImageSchema = zod_1.z.object({
    url: zod_1.z.string().url(),
    alt: zod_1.z.string().max(140).optional(),
});
/**
 * ⚠️ CLAVE:
 * NO hagas .partial() sobre un schema con superRefine (ZodEffects)
 * Por eso: primero base object (ZodObject), luego:
 * - Create = base.superRefine(...)
 * - Update = base.partial()
 */
const ProjectBaseSchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(120).optional(),
    slug: zod_1.z.string().min(2).max(140).optional(),
    summary: zod_1.z.string().min(5).max(220).optional(),
    // Nuevo
    description: zod_1.z.string().min(1).max(20000).optional(),
    // Legacy
    content: zod_1.z.string().min(1).max(20000).optional(),
    category: zod_1.z.enum(["SaaS", "Dashboard", "Web", "Other"]).optional(),
    // ✅ NOMBRES (lo que realmente quieres guardar)
    thumbnailName: zod_1.z.string().optional(),
    coverImageName: zod_1.z.string().optional(),
    // Compat: si te mandan url en vez de name, extraemos el filename
    thumbnailUrl: UrlOrEmpty,
    coverImageUrl: UrlOrEmpty,
    gallery: zod_1.z.array(ProjectImageSchema).optional().default([]),
    tags: zod_1.z.array(zod_1.z.string().min(1)).optional().default([]),
    // Nuevo
    techStack: zod_1.z.array(zod_1.z.string().min(1)).optional().default([]),
    // Legacy
    stack: zod_1.z.array(zod_1.z.string().min(1)).optional().default([]),
    links: zod_1.z
        .object({
        liveUrl: UrlOrEmpty,
        repoUrl: UrlOrEmpty,
        videoUrl: UrlOrEmpty,
    })
        .optional()
        .default({}),
    featured: zod_1.z.boolean().optional(),
    // Nuevo
    published: zod_1.z.boolean().optional(),
    // Legacy
    status: zod_1.z.enum(["draft", "published"]).optional(),
});
/**
 * CREATE: requiere title + summary y (description OR content)
 */
const ProjectCreateSchema = ProjectBaseSchema.extend({
    title: zod_1.z.string().min(2).max(120),
    summary: zod_1.z.string().min(5).max(220),
}).superRefine((data, ctx) => {
    const hasDesc = !!data.description?.trim();
    const hasContent = !!data.content?.trim();
    if (!hasDesc && !hasContent) {
        ctx.addIssue({
            code: "custom",
            path: ["description"],
            message: "Required (description or content)",
        });
    }
});
/**
 * UPDATE (PUT): parcial, NO superRefine, para poder actualizar solo imagen/nombre/etc.
 */
const ProjectUpdateSchema = ProjectBaseSchema.partial();
// -------------------- routes --------------------
exports.projectsAdminRouter.get("/admin/projects", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const items = await project_model_1.Project.find()
        .sort({ updatedAt: -1 })
        .select("-__v")
        .lean();
    res.json(items);
}));
exports.projectsAdminRouter.post("/admin/projects", (0, validate_middleware_1.validate)(ProjectCreateSchema), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    // Normaliza description
    const description = (data.description ?? data.content ?? "").trim();
    // ✅ Mongoose te exige content -> lo mantenemos igual que description
    const content = description;
    // Slug: si no viene, lo generamos del title
    const slug = (0, slugify_1.slugify)((data.slug ?? "").trim() || data.title);
    // Compat published/status
    const published = typeof data.published === "boolean" ? data.published : data.status === "published";
    const publishedAt = published ? new Date() : undefined;
    // techStack: prefer nuevo, fallback legacy stack
    const techStack = (data.techStack?.length ? data.techStack : data.stack) ?? [];
    // ✅ nombres desde name o url
    const thumbnailName = fileNameFromUrlOrName(data.thumbnailName, data.thumbnailUrl);
    const coverImageName = fileNameFromUrlOrName(data.coverImageName, data.coverImageUrl);
    const created = await project_model_1.Project.create({
        title: data.title.trim(),
        slug,
        summary: data.summary.trim(),
        description,
        content, // ✅ requerido
        category: data.category ?? "Other",
        tags: data.tags ?? [],
        techStack,
        // ✅ SOLO nombres
        thumbnailName: thumbnailName ?? "",
        coverImageName: coverImageName ?? "",
        // si quieres dejar estas urls fuera, no las guardes:
        // thumbnailUrl: undefined,
        // coverImageUrl: undefined,
        gallery: data.gallery ?? [],
        links: {
            liveUrl: normalizeUrl(data.links?.liveUrl),
            repoUrl: normalizeUrl(data.links?.repoUrl),
            videoUrl: normalizeUrl(data.links?.videoUrl),
        },
        featured: !!data.featured,
        published,
        publishedAt,
    });
    res.status(201).json(created);
}));
exports.projectsAdminRouter.delete("/admin/projects/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const deleted = await project_model_1.Project.findByIdAndDelete(req.params.id);
    if (!deleted)
        return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
}));
exports.projectsAdminRouter.put("/admin/projects/:id", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = req.body;
    // Armamos un update SOLO con campos que vengan.
    const update = {};
    if (typeof data.title === "string")
        update.title = data.title.trim();
    if (typeof data.summary === "string")
        update.summary = data.summary.trim();
    if (typeof data.category === "string")
        update.category = data.category;
    // slug opcional (si te mandan uno lo actualizamos)
    if (typeof data.slug === "string" && data.slug.trim()) {
        update.slug = (0, slugify_1.slugify)(data.slug.trim());
    }
    // ✅ description/content (mantener content requerido)
    // Si viene description o content -> sincronizamos ambos
    const incomingDesc = typeof data.description === "string" ? data.description.trim() : "";
    const incomingContent = typeof data.content === "string" ? data.content.trim() : "";
    if (incomingDesc || incomingContent) {
        const finalDesc = (incomingDesc || incomingContent).trim();
        update.description = finalDesc;
        update.content = finalDesc; // ✅ requerido en mongoose
    }
    // Si NO viene description/content, NO tocamos content (evita fallas)
    // tags
    if (Array.isArray(data.tags))
        update.tags = data.tags;
    // techStack (prefer nuevo, fallback legacy)
    const techStack = (data.techStack?.length ? data.techStack : data.stack);
    if (Array.isArray(techStack))
        update.techStack = techStack;
    // ✅ IMAGES: guardar solo nombres
    // Nota: si en el body te mandan url, extraemos nombre
    const thumbName = fileNameFromUrlOrName(data.thumbnailName, data.thumbnailUrl);
    console.log('thumbName::: ', thumbName);
    const coverName = fileNameFromUrlOrName(data.coverImageName, data.coverImageUrl);
    console.log('coverName::: ', coverName);
    if (thumbName) {
        update.thumbnailUrl = thumbName;
        update.thumbnailName = thumbName;
        update.thumbnailUrl = thumbName;
    }
    if (coverName) {
        update.coverImageName = coverName;
        update.coverImageUrl = coverName;
    }
    // gallery
    if (Array.isArray(data.gallery))
        update.gallery = data.gallery;
    // links
    if (data.links) {
        update.links = {
            liveUrl: normalizeUrl(data.links.liveUrl),
            repoUrl: normalizeUrl(data.links.repoUrl),
            videoUrl: normalizeUrl(data.links.videoUrl),
        };
    }
    // featured
    if (typeof data.featured === "boolean")
        update.featured = data.featured;
    // compat published/status (solo si te lo mandan)
    const hasPublished = typeof req.body.published === "boolean";
    const hasStatus = typeof req.body.status === "string";
    if (hasPublished || hasStatus) {
        const published = typeof data.published === "boolean" ? data.published : data.status === "published";
        update.published = published;
        if (published) {
            // si ya tenía publishedAt, lo dejamos; si no, lo ponemos
            update.$setOnInsert = update.$setOnInsert || {};
            // con findByIdAndUpdate no hay insert, pero no pasa nada.
            update.publishedAt = new Date();
        }
        else {
            update.publishedAt = undefined;
        }
    }
    if (thumbName) {
        update.thumbnailUrl = thumbName;
        update.thumbnailName = thumbName;
        update.thumbnailUrl = thumbName;
    }
    if (coverName) {
        update.coverImageName = coverName;
        update.coverImageUrl = coverName;
    }
    console.log('upddsaddsaate::: ', update);
    const updated = await project_model_1.Project.findByIdAndUpdate(req.params.id, update, {
        new: true,
        runValidators: true,
    });
    console.log('updated::: ', updated);
    if (!updated)
        return res.status(404).json({ error: "Not found" });
    res.json(updated);
}));
//# sourceMappingURL=projects.admin.routes.js.map