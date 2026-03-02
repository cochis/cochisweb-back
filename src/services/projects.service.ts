import { FilterQuery } from 'mongoose';
import { Project, ProjectDoc } from '../models/project.model';

export type ListPublicProjectsParams = {
    q?: string;
    category?: string;
    tag?: string;
    featured?: boolean;
    page?: number;
    pageSize?: number;
};

export type PublicProjectCard = {
    _id: string;
    title: string;
    slug: string;
    summary: string;
    category: string;
    tags: string[];
    thumbnailUrl?: string;
    featured: boolean;
    publishedAt?: Date;
    techStack?: string[];
};

type PublicProjectsResult = {
    items: PublicProjectCard[];
    meta: {
        page: number;
        pageSize: number;
        total: number;
        totalPages: number;
    };
};

const PUBLIC_CARD_SELECT =
    'title slug summary category tags thumbnailUrl featured publishedAt techStack';

function toSafeInt(value: unknown, fallback: number): number {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? Math.floor(n) : fallback;
}

export async function listPublicProjects(
    params: ListPublicProjectsParams = {}
): Promise<PublicProjectsResult> {
    const q = params.q?.trim() || '';
    const category = params.category?.trim();
    const tag = params.tag?.trim();
    const featured = params.featured;

    const safePage = Math.max(1, toSafeInt(params.page, 1));
    const safePageSize = Math.min(48, Math.max(1, toSafeInt(params.pageSize, 12)));

    const filter: FilterQuery<ProjectDoc> = { published: true };

    if (category) filter.category = category;
    if (typeof featured === 'boolean') filter.featured = featured;

    if (tag) {
        // tags is an array, so this matches documents that contain the tag
        filter.tags = { $in: [tag] };
    }

    if (q.length) {
        // Search in title/summary and tags array (more correct for arrays)
        const rx = new RegExp(escapeRegExp(q), 'i');

        // Typings for $or with regex can be picky; this cast is safe here.
        (filter as any).$or = [
            { title: rx },
            { summary: rx },
            { tags: { $elemMatch: { $regex: rx } } }
        ] as FilterQuery<ProjectDoc>[];
    }

    const skip = (safePage - 1) * safePageSize;

    const [items, total] = await Promise.all([
        Project.find(filter)
            .sort({ featured: -1, publishedAt: -1, updatedAt: -1 })
            .select(PUBLIC_CARD_SELECT)
            .skip(skip)
            .limit(safePageSize)
            .lean<PublicProjectCard[]>(),
        Project.countDocuments(filter),
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

export async function getPublicProjectBySlug(
    slug: string
): Promise<ProjectDoc | null> {
    const cleanSlug = String(slug || '').trim().toLowerCase();
    if (!cleanSlug) return null;

    return Project.findOne({ slug: cleanSlug, published: true }).lean<ProjectDoc | null>();
}

/**
 * Escapes user input for RegExp usage.
 */
function escapeRegExp(input: string): string {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}