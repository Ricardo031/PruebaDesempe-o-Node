import type { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError.js";
import { importJsonSeed } from "../seeders/import-json.seeder.js";

export const seedController = {
    importJson: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const file = req.file;
            if (!file) {
                throw new AppError("Debes adjuntar un archivo JSON en el campo 'file'", 400);
            }

            const result = await importJsonSeed(file.buffer.toString("utf-8"));
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },
};
