import { Schema, model, Document } from 'mongoose';

export type ProjectImage = {
    fileName: string;  // ✅ solo nombre: "p-123.png"
    alt?: string;
};

export type ProjectLinks = {
    liveUrl?: string;
    repoUrl?: string;
    videoUrl?: string;
};

export type ProjectCategory = 'SaaS' | 'Dashboard' | 'Web' | 'Other';

export interface ProjectDoc extends Document {
    title: string;
    slug: string;

    summary: string;
    description: string;
    content: string; // ✅ para detalle (markdown/html/text)

    category: ProjectCategory;
    tags: string[];

    // ✅ Images: SOLO NOMBRE (no URLs)
    thumbnailName?: string;   // grid/card preview
    coverImageName?: string;  // project detail hero
    gallery: ProjectImage[];  // screenshots (solo nombre)

    // Links
    links: ProjectLinks;

    // Tech
    techStack: string[];

    // Flags
    featured: boolean;
    published: boolean;
    publishedAt?: Date;

    createdAt: Date;
    updatedAt: Date;
}

const ProjectImageSchema = new Schema<ProjectImage>(
    {
        fileName: { type: String, required: true, trim: true, maxlength: 180 },
        alt: { type: String, trim: true, maxlength: 140 },
    },
    { _id: false }
);

const LinksSchema = new Schema<ProjectLinks>(
    {
        liveUrl: { type: String, trim: true, default: '' },
        repoUrl: { type: String, trim: true, default: '' },
        videoUrl: { type: String, trim: true, default: '' },
    },
    { _id: false }
);

const ProjectSchema = new Schema<ProjectDoc>(
    {
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
    },
    { timestamps: true }
);

// Helpful compound indexes for public listing queries
ProjectSchema.index({ published: 1, featured: -1, publishedAt: -1, updatedAt: -1 });
ProjectSchema.index({ published: 1, category: 1, publishedAt: -1 });

export const Project = model<ProjectDoc>('Project', ProjectSchema);