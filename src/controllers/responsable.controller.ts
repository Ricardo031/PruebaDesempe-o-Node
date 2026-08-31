import type { NextFunction, Request, Response } from "express";
import { responsableService } from "../services/responsable.service.js";

export const responsableController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const responsable = await responsableService.create(req.body);
            res.status(201).json(responsable);
        } catch (error) {
            next(error);
        }
    },

    getAll: async (_req: Request, res: Response, next: NextFunction) => {
        try {
            const responsables = await responsableService.getAll();
            res.status(200).json(responsables);
        } catch (error) {
            next(error);
        }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const responsable = await responsableService.getById(Number(req.params.id));
            res.status(200).json(responsable);
        } catch (error) {
            next(error);
        }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const responsable = await responsableService.update(Number(req.params.id), req.body);
            res.status(200).json(responsable);
        } catch (error) {
            next(error);
        }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            await responsableService.delete(Number(req.params.id));
            res.status(200).json({ message: "Responsable eliminado correctamente" });
        } catch (error) {
            next(error);
        }
    },
};
