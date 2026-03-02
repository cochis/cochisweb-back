import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
        const e = new Error("Validation error");
        (e as any).status = 400;
        (e as any).details = result.error.flatten();
        throw e;
    }
    req.body = result.data;
    next();
};