"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const mongoose_1 = require("mongoose");
const ProjectImageSchema = new mongoose_1.Schema({
    fileName: { type: String, required: true, trim: true, maxlength: 180 },
    alt: { type: String, trim: true, maxlength: 140 },
}, { _id: false });
const LinksSchema = new mongoose_1.Schema({
    liveUrl: { type: String, trim: true, default: '' },
    repoUrl: { type: String, trim: true, default: '' },
    videoUrl: { type: String, trim: true, default: '' },
}, { _id: false });
const ProjectSchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
        maxlength: 140,
    },
    summary: { type: String, required: true, trim: true, maxlength: 280 },
    description: { type: String, trim: true, maxlength: 2000 },
    content: { type: String, required: true, trim: true, maxlength: 20000 },
    category: { type: String, enum: ['SaaS', 'Dashboard', 'Web', 'Other'], default: 'Other', index: true },
    tags: { type: [String], default: [], index: true },
    // ✅ Names only
    thumbnailName: { type: String, trim: true, default: '' },
    coverImageName: { type: String, trim: true, default: '' },
    gallery: { type: [ProjectImageSchema], default: [] },
    links: { type: LinksSchema, default: {} },
    techStack: { type: [String], default: [], index: true },
    featured: { type: Boolean, default: false, index: true },
    published: { type: Boolean, default: false, index: true },
    publishedAt: { type: Date, index: true },
}, { timestamps: true });
// Helpful compound indexes for public listing queries
ProjectSchema.index({ published: 1, featured: -1, publishedAt: -1, updatedAt: -1 });
ProjectSchema.index({ published: 1, category: 1, publishedAt: -1 });
exports.Project = (0, mongoose_1.model)('Project', ProjectSchema);
//# sourceMappingURL=project.model.js.map