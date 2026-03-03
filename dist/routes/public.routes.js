import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { listPublicProjects, getPublicProjectBySlug } from "../services/projects.service.js";
import { listSkills, listServices } from "../services/public.service.js";
export const publicRouter = Router();
publicRouter.get("/health", (_req, res) => res.json({ ok: true }));
/**
 * GET /api/public/projects
 * Query:
 *  - q=search
 *  - category=SaaS|Dashboard|Web|Other
 *  - tag=Angular
 *  - featured=true|false
 *  - page=1
 *  - pageSize=12
 */
publicRouter.get("/projects", asyncHandler(async (req, res) => {
    const q = req.query.q ? String(req.query.q) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const tag = req.query.tag ? String(req.query.tag) : undefined;
    const featured = typeof req.query.featured === "string"
        ? req.query.featured === "true"
        : undefined;
    const page = typeof req.query.page === "string" ? Number(req.query.page) : undefined;
    const pageSize = typeof req.query.pageSize === "string"
        ? Number(req.query.pageSize)
        : undefined;
    const result = await listPublicProjects({
        q,
        category,
        tag,
        featured,
        page,
        pageSize,
    });
    res.json(result);
}));
/**
 * GET /api/public/projects/:slug
 */
publicRouter.get("/projects/:slug", asyncHandler(async (req, res) => {
    const p = await getPublicProjectBySlug(String(req.params.slug));
    if (!p) {
        return res.status(404).json({ message: "Project not found" });
    }
    res.json(p);
}));
publicRouter.get("/skills", asyncHandler(async (_req, res) => {
    res.json(await listSkills());
}));
publicRouter.get("/services", asyncHandler(async (_req, res) => {
    res.json(await listServices());
}));
//# sourceMappingURL=public.routes.js.map