"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const projects_service_js_1 = require("../services/projects.service.js");
const public_service_js_1 = require("../services/public.service.js");
exports.publicRouter = (0, express_1.Router)();
exports.publicRouter.get("/health", (_req, res) => res.json({ ok: true }));
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
exports.publicRouter.get("/projects", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
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
    const result = await (0, projects_service_js_1.listPublicProjects)({
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
exports.publicRouter.get("/projects/:slug", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const p = await (0, projects_service_js_1.getPublicProjectBySlug)(String(req.params.slug));
    if (!p) {
        return res.status(404).json({ message: "Project not found" });
    }
    res.json(p);
}));
exports.publicRouter.get("/skills", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, public_service_js_1.listSkills)());
}));
exports.publicRouter.get("/services", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json(await (0, public_service_js_1.listServices)());
}));
//# sourceMappingURL=public.routes.js.map