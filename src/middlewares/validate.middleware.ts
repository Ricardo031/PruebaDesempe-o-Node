import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { AppError } from "../errors/AppError.js";

export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) {
            const message = parsed.error.issues.map((i) => i.message).join(", ");
            return next(new AppError(message, 400));
        }
        req.body = parsed.data;
        return next();
    };
};

