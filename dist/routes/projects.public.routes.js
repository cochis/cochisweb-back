import { Router } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Project } from "../models/project.model.js";
export const projectsPublicRouter = Router();
projectsPublicRouter.get("/projects", asyncHandler(async (_req, res) => {
    const items = await Project.find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .select("-__v");
    res.json(items);
}));
projectsPublicRouter.get("/projects/:slug", asyncHandler(async (req, res) => {
    const item = await Project.findOne({ slug: req.params.slug, status: "published" }).select("-__v");
    if (!item)
        return res.status(404).json({ error: "Not found" });
    res.json(item);
}));
//# sourceMappingURL=projects.public.routes.js.map