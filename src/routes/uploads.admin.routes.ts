import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadProjectImage } from '../utils/upload.js';

export const uploadsAdminRouter = Router();

/**
 * POST /api/admin/uploads/projects
 * Upload project image
 * Returns ONLY filename (frontend stores just name)
 */
uploadsAdminRouter.post(
    '/admin/uploads/projects',
    requireAuth,
    (req, res, next) => {
        uploadProjectImage(req as any, res as any, (err: any) => {
            if (err) {
                return res.status(400).json({
                    error: 'Upload error',
                    details: err?.message ?? String(err),
                });
            }
            next();
        });
    },
    asyncHandler(async (req, res) => {
        const file = (req as any).file as Express.Multer.File | undefined;

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
    })
);
