import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import type { UserRole } from "../models/user.model.js";

export const requireRole = (...roles: UserRole[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            return next(new AppError("Token requerido", 401));
        }
        if (!roles.includes(user.role)) {
            return next(new AppError("No autorizado para esta acción", 403));
        }
        return next();
    };
};
