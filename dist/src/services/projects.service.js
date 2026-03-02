"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPublicProjects = listPublicProjects;
exports.getPublicProjectBySlug = getPublicProjectBySlug;
const project_model_1 = require("../models/project.model");
const PUBLIC_CARD_SELECT = 'title slug summary category tags thumbnailUrl featured publishedAt techStack';
function toSafeInt(value, fallback) {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? Math.floor(n) : fallback;
}
async function listPublicProjects(params = {}) {
    const q = params.q?.trim() || '';
    const category = params.category?.trim();
    const tag = params.tag?.trim();
    const featured = params.featured;
    const safePage = Math.max(1, toSafeInt(params.page, 1));
    const safePageSize = Math.min(48, Math.max(1, toSafeInt(params.pageSize, 12)));
    const filter = { published: true };
    if (category)
        filter.category = category;
    if (typeof featured === 'boolean')
        filter.featured = featured;
    if (tag) {
        // tags is an array, so this matches documents that contain the tag
        filter.tags = { $in: [tag] };
    }
    if (q.length) {
        // Search in title/summary and tags array (more correct for arrays)
        const rx = new RegExp(escapeRegExp(q), 'i');
        // Typings for $or with regex can be picky; this cast is safe here.
        filter.$or = [
            { title: rx },
            { summary: rx },
            { tags: { $elemMatch: { $regex: rx } } }
        ];
    }
    const skip = (safePage - 1) * safePageSize;
    const [items, total] = await Promise.all([
        project_model_1.Project.find(filter)
            .sort({ featured: -1, publishedAt: -1, updatedAt: -1 })
            .select(PUBLIC_CARD_SELECT)
            .skip(skip)
            .limit(safePageSize)
            .lean(),
        project_model_1.Project.countDocuments(filter),
    ]);
    return {
        items,
        meta: {
            page: safePage,
            pageSize: safePageSize,
            total,
            totalPages: Math.max(1, Math.ceil(total / safePageSize)),
        },
    };
}
async function getPublicProjectBySlug(slug) {
    const cleanSlug = String(slug || '').trim().toLowerCase();
    if (!cleanSlug)
        return null;
    return project_model_1.Project.findOne({ slug: cleanSlug, published: true }).lean();
}
/**
 * Escapes user input for RegExp usage.
 */
function escapeRegExp(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
//# sourceMappingURL=projects.service.js.map