import { Router } from "express";
import { z } from "zod";

import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { Project } from "../models/project.model";
import { slugify } from "../utils/slugify";

export const projectsAdminRouter = Router();

// Protege TODO este router (asumiendo que lo montas en /api)
projectsAdminRouter.use(requireAuth);

// -------------------- helpers --------------------
function normalizeUrl(v?: string) {
    const s = (v ?? "").trim();
    return s.length ? s : undefined;
}

/**
 * Extrae nombre de archivo desde:
 * - "p-123.png"
 * - "/uploads/projects/p-123.png"
 * - "http://localhost:3000/uploads/projects/p-123.png"
 */
function toFileName(v?: string): string | undefined {
    const s = (v ?? "").trim();
    if (!s) return undefined;

    // Si ya es nombre (sin slash), lo usamos tal cual
    if (!s.includes("/")) return s;

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
function fileNameFromUrlOrName(name?: string, url?: string): string | undefined {
    return toFileName(name) ?? toFileName(url);
}

// -------------------- Zod Schemas --------------------
const UrlOrEmpty = z.string().url().or(z.literal("")).optional();

const ProjectImageSchema = z.object({
    url: z.string().url(),
    alt: z.string().max(140).optional(),
});

/**
 * ⚠️ CLAVE:
 * NO hagas .partial() sobre un schema con superRefine (ZodEffects)
 * Por eso: primero base object (ZodObject), luego:
 * - Create = base.superRefine(...)
 * - Update = base.partial()
 */
const ProjectBaseSchema = z.object({
    title: z.string().min(2).max(120).optional(),
    slug: z.string().min(2).max(140).optional(),

    summary: z.string().min(5).max(220).optional(),

    // Nuevo
    description: z.string().min(1).max(20000).optional(),
    // Legacy
    content: z.string().min(1).max(20000).optional(),

    category: z.enum(["SaaS", "Dashboard", "Web", "Other"]).optional(),

    // ✅ NOMBRES (lo que realmente quieres guardar)
    thumbnailName: z.string().optional(),
    coverImageName: z.string().optional(),

    // Compat: si te mandan url en vez de name, extraemos el filename
    thumbnailUrl: UrlOrEmpty,
    coverImageUrl: UrlOrEmpty,

    gallery: z.array(ProjectImageSchema).optional().default([]),

    tags: z.array(z.string().min(1)).optional().default([]),

    // Nuevo
    techStack: z.array(z.string().min(1)).optional().default([]),
    // Legacy
    stack: z.array(z.string().min(1)).optional().default([]),

    links: z
        .object({
            liveUrl: UrlOrEmpty,
            repoUrl: UrlOrEmpty,
            videoUrl: UrlOrEmpty,
        })
        .optional()
        .default({}),

    featured: z.boolean().optional(),
    // Nuevo
    published: z.boolean().optional(),
    // Legacy
    status: z.enum(["draft", "published"]).optional(),
});

/**
 * CREATE: requiere title + summary y (description OR content)
 */
const ProjectCreateSchema = ProjectBaseSchema.extend({
    title: z.string().min(2).max(120),
    summary: z.string().min(5).max(220),
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
projectsAdminRouter.get(
    "/admin/projects",
    asyncHandler(async (_req, res) => {
        const items = await Project.find()
            .sort({ updatedAt: -1 })
            .select("-__v")
            .lean();

        res.json(items);
    })
);

projectsAdminRouter.post(
    "/admin/projects",
    validate(ProjectCreateSchema),
    asyncHandler(async (req, res) => {
        const data = req.body as z.infer<typeof ProjectCreateSchema>;

        // Normaliza description
        const description = (data.description ?? data.content ?? "").trim();

        // ✅ Mongoose te exige content -> lo mantenemos igual que description
        const content = description;

        // Slug: si no viene, lo generamos del title
        const slug = slugify((data.slug ?? "").trim() || data.title);

        // Compat published/status
        const published =
            typeof data.published === "boolean" ? data.published : data.status === "published";

        const publishedAt = published ? new Date() : undefined;

        // techStack: prefer nuevo, fallback legacy stack
        const techStack = (data.techStack?.length ? data.techStack : data.stack) ?? [];

        // ✅ nombres desde name o url
        const thumbnailName = fileNameFromUrlOrName(data.thumbnailName, data.thumbnailUrl);
        const coverImageName = fileNameFromUrlOrName(data.coverImageName, data.coverImageUrl);

        const created = await Project.create({
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
    })
);

projectsAdminRouter.delete(
    "/admin/projects/:id",
    asyncHandler(async (req, res) => {
        const deleted = await Project.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ error: "Not found" });
        res.json({ ok: true });
    })
);

projectsAdminRouter.put(
    "/admin/projects/:id",

    asyncHandler(async (req, res) => {
        const data = req.body as z.infer<typeof ProjectUpdateSchema>;

        // Armamos un update SOLO con campos que vengan.
        const update: any = {};

        if (typeof data.title === "string") update.title = data.title.trim();
        if (typeof data.summary === "string") update.summary = data.summary.trim();
        if (typeof data.category === "string") update.category = data.category;

        // slug opcional (si te mandan uno lo actualizamos)
        if (typeof data.slug === "string" && data.slug.trim()) {
            update.slug = slugify(data.slug.trim());
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
        if (Array.isArray(data.tags)) update.tags = data.tags;

        // techStack (prefer nuevo, fallback legacy)
        const techStack = (data.techStack?.length ? data.techStack : data.stack);
        if (Array.isArray(techStack)) update.techStack = techStack;

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
        if (Array.isArray(data.gallery)) update.gallery = data.gallery;

        // links
        if (data.links) {
            update.links = {
                liveUrl: normalizeUrl(data.links.liveUrl),
                repoUrl: normalizeUrl(data.links.repoUrl),
                videoUrl: normalizeUrl(data.links.videoUrl),
            };
        }

        // featured
        if (typeof data.featured === "boolean") update.featured = data.featured;

        // compat published/status (solo si te lo mandan)
        const hasPublished = typeof (req.body as any).published === "boolean";
        const hasStatus = typeof (req.body as any).status === "string";

        if (hasPublished || hasStatus) {
            const published =
                typeof data.published === "boolean" ? data.published : data.status === "published";

            update.published = published;

            if (published) {
                // si ya tenía publishedAt, lo dejamos; si no, lo ponemos
                update.$setOnInsert = update.$setOnInsert || {};
                // con findByIdAndUpdate no hay insert, pero no pasa nada.
                update.publishedAt = new Date();
            } else {
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
        const updated = await Project.findByIdAndUpdate(req.params.id, update, {
            new: true,
            runValidators: true,
        });
        console.log('updated::: ', updated);

        if (!updated) return res.status(404).json({ error: "Not found" });

        res.json(updated);
    })
);