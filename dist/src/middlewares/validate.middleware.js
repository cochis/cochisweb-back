"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => (req, _res, next) => {
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
exports.validate = validate;
//# sourceMappingURL=validate.middleware.js.map