import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import type { UserRole } from "../models/user.model.js";

type JwtPayload = {
    id: number;
    role: UserRole;
};

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return next(new AppError("Token requerido", 401));
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return next(new AppError("JWT_SECRET no configurado", 500));
    }

    try {
        const payload = jwt.verify(token, secret) as JwtPayload;
        req.user = { id: payload.id, role: payload.role };
        return next();
    } catch {
        return next(new AppError("Token inválido", 401));
    }
};
