import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
    }

    console.error(error);
    return res.status(500).json({ message: "Error interno del servidor" });
};

