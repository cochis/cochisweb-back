"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProjectImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function ensureDir(dir) {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
}
const PROJECTS_DIR = path_1.default.resolve(process.cwd(), 'uploads', 'projects');
ensureDir(PROJECTS_DIR);
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, PROJECTS_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname || '').toLowerCase() || '.png';
        const safeExt = ['.png', '.jpg', '.jpeg', '.webp', '.avif'].includes(ext) ? ext : '.png';
        const name = `p-${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`;
        cb(null, name);
    },
});
function fileFilter(_req, file, cb) {
    const ok = /^image\/(png|jpe?g|webp|avif)$/i.test(file.mimetype);
    if (!ok)
        return cb(new Error('Only image files are allowed (png, jpg, jpeg, webp, avif).'));
    cb(null, true);
}
exports.uploadProjectImage = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single('file'); // el campo se llama "file"
//# sourceMappingURL=upload.js.map