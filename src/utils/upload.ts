import multer from 'multer';
import path from 'path';
import fs from 'fs';

function ensureDir(dir: string) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

const PROJECTS_DIR = path.resolve(process.cwd(), 'uploads', 'projects');
ensureDir(PROJECTS_DIR);

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, PROJECTS_DIR),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname || '').toLowerCase() || '.png';
        const safeExt = ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(ext) ? ext : '.png';
        const name = `p-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
        cb(null, name);
    },
});

function fileFilter(_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) {
    const ok = /^image\/(png|jpe?g|webp|avif)$/i.test(file.mimetype);
    if (!ok) return cb(new Error('Only image files are allowed (png, jpg, jpeg, webp, avif).'));
    cb(null, true);
}

export const uploadProjectImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('file'); // el campo se llama "file"