export const validate = (schema) => (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const e = new Error("Validation error");
        e.status = 400;
        e.details = result.error.flatten();
        throw e;
    }
    req.body = result.data;
    next();
};
//# sourceMappingURL=validate.middleware.js.map