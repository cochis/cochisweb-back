export function slugify(input) {
    return input
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}
//# sourceMappingURL=slugify.js.map