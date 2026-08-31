import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";
import { AppError } from "../errors/AppError.js";

export const validateBody = (schema: ZodType) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const message = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", ");
            return next(new AppError(message, 400));
        }
        req.body = parsed.data;
        return next();
    };
};

