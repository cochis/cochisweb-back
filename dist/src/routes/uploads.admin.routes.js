"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsAdminRouter = void 0;
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const upload_1 = require("../utils/upload");
exports.uploadsAdminRouter = (0, express_1.Router)();
/**
 * POST /api/admin/uploads/projects
 * Upload project image
 * Returns ONLY filename (frontend stores just name)
 */
exports.uploadsAdminRouter.post('/admin/uploads/projects', auth_middleware_1.requireAuth, (req, res, next) => {
    (0, upload_1.uploadProjectImage)(req, res, (err) => {
        if (err) {
            return res.status(400).json({
                error: 'Upload error',
                details: err?.message ?? String(err),
            });
        }
        next();
    });
}, (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file) {
        return res.status(400).json({
            error: 'No file uploaded',
        });
    }
    // 🔥 solo devolvemos nombre
    return res.status(201).json({
        fileName: file.filename,
        url: `/uploads/projects/${file.filename}`, // opcional para preview
    });
}));
//# sourceMappingURL=uploads.admin.routes.js.map