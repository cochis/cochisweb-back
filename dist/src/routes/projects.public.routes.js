"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectsPublicRouter = void 0;
const express_1 = require("express");
const asyncHandler_1 = require("../utils/asyncHandler");
const project_model_1 = require("../models/project.model");
exports.projectsPublicRouter = (0, express_1.Router)();
exports.projectsPublicRouter.get("/projects", (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const items = await project_model_1.Project.find({ status: "published" })
        .sort({ publishedAt: -1, createdAt: -1 })
        .select("-__v");
    res.json(items);
}));
exports.projectsPublicRouter.get("/projects/:slug", (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const item = await project_model_1.Project.findOne({ slug: req.params.slug, status: "published" }).select("-__v");
    if (!item)
        return res.status(404).json({ error: "Not found" });
    res.json(item);
}));
//# sourceMappingURL=projects.public.routes.js.map